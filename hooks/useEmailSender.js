"use client";
import { useState, useRef, useCallback } from "react";

const DEFAULT_RETRY_COUNT = 3;
const RATE_LIMIT_DURATION = 60000; // 1 minute
const MAX_EMAILS_PER_DURATION = 5;

// Email templates remain the same...
const EMAIL_TEMPLATES = {
  welcome: {
    subject: "Welcome to our platform!",
    text: (name) => `Hello ${name}, welcome to our platform!`,
    html: (name) => `
        <h1>Welcome ${name}!</h1>
        <p>We're excited to have you on board.</p>
      `,
  },
  resetPassword: {
    subject: "Password Reset Request",
    text: (resetLink) => `Click this link to reset your password: ${resetLink}`,
    html: (resetLink) => `
        <h1>Password Reset</h1>
        <p>Click the button below to reset your password:</p>
        <a href="${resetLink}" style="padding: 10px 20px; background: blue; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      `,
  },
  notification: {
    subject: "New Notification",
    text: (message) => message,
    html: (message) => `<p>${message}</p>`,
  },
};

export const useEmailSender = (config = {}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const emailCount = useRef(0);
  const lastEmailTime = useRef(Date.now());

  const {
    retryCount = DEFAULT_RETRY_COUNT,
    rateLimitDuration = RATE_LIMIT_DURATION,
    maxEmailsPerDuration = MAX_EMAILS_PER_DURATION,
    onSuccess,
    onError,
  } = config;

  // Existing validation functions...
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email address");
    }
  };

  const validateContent = ({ subject, text, html }) => {
    if (!subject?.trim()) throw new Error("Subject is required");
    if (!text?.trim() && !html?.trim())
      throw new Error("Email content is required");
  };

  const checkRateLimit = useCallback(() => {
    const now = Date.now();
    if (now - lastEmailTime.current > rateLimitDuration) {
      emailCount.current = 0;
      lastEmailTime.current = now;
    }

    if (emailCount.current >= maxEmailsPerDuration) {
      const waitTime = Math.ceil(
        (rateLimitDuration - (now - lastEmailTime.current)) / 1000
      );
      throw new Error(`Rate limit exceeded. Please wait ${waitTime} seconds.`);
    }
  }, [rateLimitDuration, maxEmailsPerDuration]);

  const sendEmailWithRetry = async (emailData, attemptCount = 0) => {
    try {
      const response = await fetch("/api/sendemails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email");
      }

      return data;
    } catch (err) {
      if (attemptCount < retryCount) {
        const delay = Math.min(1000 * Math.pow(2, attemptCount), 10000);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return sendEmailWithRetry(emailData, attemptCount + 1);
      }
      throw err;
    }
  };

  // New function to handle multiple emails
  const sendMultipleEmails = async (emails) => {
    if (!Array.isArray(emails)) {
      throw new Error("Emails must be an array");
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const results = [];
    const errors = [];

    try {
      for (const emailData of emails) {
        try {
          // Check rate limit for each email
          checkRateLimit();

          // Validate email address
          validateEmail(emailData.to);

          // Process template if specified
          let emailContent = {};
          if (emailData.template && EMAIL_TEMPLATES[emailData.template]) {
            const templateConfig = EMAIL_TEMPLATES[emailData.template];
            emailContent = {
              subject: templateConfig.subject,
              text: templateConfig.text(emailData.templateData),
              html: templateConfig.html(emailData.templateData),
            };
          } else {
            emailContent = {
              subject: emailData.subject,
              text: emailData.text,
              html: emailData.html || `<p>${emailData.text}</p>`,
            };
          }

          // Validate content
          validateContent(emailContent);

          // Send email
          const result = await sendEmailWithRetry({
            to: emailData.to,
            ...emailContent,
          });

          results.push({ to: emailData.to, success: true, data: result });
          emailCount.current += 1;
          onSuccess?.({ to: emailData.to, ...emailContent });
        } catch (err) {
          errors.push({ to: emailData.to, error: err.message });
          onError?.(err);
        }
      }

      // Set overall success/error state
      if (errors.length === 0) {
        setSuccess(true);
      } else if (errors.length === emails.length) {
        setError("All emails failed to send");
      } else {
        setError("Some emails failed to send");
      }

      return {
        success: errors.length === 0,
        results,
        errors,
      };
    } catch (err) {
      setError(err.message);
      onError?.(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // Modify the original sendEmail to handle both single and multiple emails
  const sendEmail = async (emailData) => {
    if (Array.isArray(emailData)) {
      return sendMultipleEmails(emailData);
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      checkRateLimit();
      validateEmail(emailData.to);

      let emailContent = {};
      if (emailData.template && EMAIL_TEMPLATES[emailData.template]) {
        const templateConfig = EMAIL_TEMPLATES[emailData.template];
        emailContent = {
          subject: templateConfig.subject,
          text: templateConfig.text(emailData.templateData),
          html: templateConfig.html(emailData.templateData),
        };
      } else {
        emailContent = {
          subject: emailData.subject,
          text: emailData.text,
          html: emailData.html || `<p>${emailData.text}</p>`,
        };
      }

      validateContent(emailContent);

      const result = await sendEmailWithRetry({
        to: emailData.to,
        ...emailContent,
      });

      setSuccess(true);
      emailCount.current += 1;
      onSuccess?.({ to: emailData.to, ...emailContent });

      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      onError?.(err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const getTemplates = () => Object.keys(EMAIL_TEMPLATES);

  const reset = () => {
    setError(null);
    setSuccess(false);
    setLoading(false);
  };

  return {
    sendEmail,
    loading,
    error,
    success,
    reset,
    getTemplates,
  };
};
