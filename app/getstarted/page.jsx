"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check, ChevronRight, Store, Truck, User } from "lucide-react";

const GetStartedPage = () => {
  const [step, setStep] = useState(0);
  const [accountType, setAccountType] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    businessName: "",
    businessType: "",
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData);
    setStep(step + 1);
  };

  const steps = [
    {
      title: "Choose Account Type",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AccountTypeCard
            icon={Store}
            title="Business Account"
            description="List products, manage orders, and grow your delivery business."
            onClick={() => {
              setAccountType("business");
              setStep(1);
            }}
          />
          <AccountTypeCard
            icon={User}
            title="Customer Account"
            description="Order from local businesses and enjoy fast, reliable delivery."
            onClick={() => {
              setAccountType("customer");
              setStep(1);
            }}
          />
        </div>
      ),
    },
    {
      title: "Create Your Account",
      content: (
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          {accountType === "business" && (
            <>
              <Input
                label="Business Name"
                name="businessName"
                value={formData.businessName}
                onChange={handleInputChange}
                required
              />
              <Select
                label="Business Type"
                name="businessType"
                value={formData.businessType}
                onChange={handleInputChange}
                required
                options={[
                  { value: "restaurant", label: "Restaurant" },
                  { value: "grocery", label: "Grocery Store" },
                  { value: "retail", label: "Retail Store" },
                  { value: "other", label: "Other" },
                ]}
              />
            </>
          )}
          <Button type="submit">Create Account</Button>
        </form>
      ),
    },
    {
      title: "Account Created",
      content: (
        <div className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-block p-4 bg-green-100 rounded-full mb-6"
          >
            <Check size={48} className="text-green-500" />
          </motion.div>
          <h3 className="text-2xl font-bold mb-4">
            Congratulations! Your account has been created.
          </h3>
          <p className="text-gray-600 mb-6">
            You're all set to start using PayNDeliver. Let's get you to your
            dashboard.
          </p>
          <Button onClick={() => console.log("Redirect to dashboard")}>
            Go to Dashboard
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="/images/logo/payNdeliver.svg"
            alt="PayNDeliver Logo"
            className="h-12 w-auto mx-auto mb-8"
          />
          <div className="bg-white shadow-xl rounded-lg overflow-hidden">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-3xl font-bold text-center mb-8">
                {steps[step].title}
              </h2>
              {steps[step].content}
            </div>
          </div>
          {step < steps.length - 1 && (
            <div className="mt-8 text-center">
              <Button onClick={() => setStep(0)} variant="text">
                Start Over
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

const AccountTypeCard = ({ icon: Icon, title, description, onClick }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="bg-white p-6 rounded-lg shadow-md cursor-pointer"
    onClick={onClick}
  >
    <Icon size={48} className="text-green-500 mb-4" />
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
    <ChevronRight className="text-green-500 mt-4 ml-auto" />
  </motion.div>
);

const Input = ({ label, ...props }) => (
  <div>
    <label
      htmlFor={props.name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <input
      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
      {...props}
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label
      htmlFor={props.name}
      className="block text-sm font-medium text-gray-700 mb-1"
    >
      {label}
    </label>
    <select
      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

const Button = ({ children, variant = "primary", ...props }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
      variant === "primary"
        ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        : "bg-white text-green-600 hover:bg-gray-50"
    }`}
    {...props}
  >
    {children}
  </motion.button>
);

export default GetStartedPage;
