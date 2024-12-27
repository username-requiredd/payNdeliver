export const InputField = ({
  label,
  name,
  type = "text",
  value,
  disabled,
  error,
  onChange,
}) => (
  <div className="mb-6">
    <label
      htmlFor={name}
      className="block text-sm font-semibold text-gray-700 mb-2"
    >
      {label}
    </label>
    <input
      id={name}
      type={type}
      name={name}
      value={value || ""}
      onChange={(e) => onChange(name, e.target.value)}
      disabled={disabled}
      className={`
        shadow-sm focus:ring-indigo-500 focus:border-indigo-500 
        block w-full sm:text-sm border-gray-300 rounded-md p-3 
        transition-colors duration-200
        ${disabled ? "bg-gray-50" : "bg-white"}
        ${disabled ? "cursor-not-allowed" : ""}
        ${error ? "border-red-500" : ""}
      `}
      aria-invalid={error ? "true" : "false"}
      aria-describedby={error ? `${name}-error` : undefined}
    />
    {error && (
      <p
        id={`${name}-error`}
        className="mt-1 text-sm text-red-600"
        role="alert"
      >
        {error}
      </p>
    )}
  </div>
);
