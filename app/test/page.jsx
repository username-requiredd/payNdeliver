"use client";
import React, { useState } from "react";

const EmailSender = () => {
  const [emailStatus, setEmailStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/sendemails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: "solomonpaul232@gmail.com", // Replace with recipient's email
          subject: "Test Email",
          text: "This is a test email",
          html: "<p>This is a test email</p>",
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setEmailStatus("Email sent successfully!");
        console.log("Email sent:", data);
      } else {
        setEmailStatus(`Failed to send email: ${data.message}`);
        console.error("Error:", data);
      }
    } catch (error) {
      setEmailStatus(`An error occurred: ${error.message}`);
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Email Sender</h1>
      <button onClick={sendEmail} disabled={loading}>
        {loading ? "Sending..." : "Send Test Email"}
      </button>
      {emailStatus && <p>{emailStatus}</p>}
    </div>
  );
};

export default EmailSender;
