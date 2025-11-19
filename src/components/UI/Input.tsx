import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string | null;
}

const Input: React.FC<InputProps> = ({ label, error, className = "", ...props }) => {
  return (
    <div className="w-full mb-4">
      {label && (
        <label className="block mb-1 font-medium text-gray-700">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full px-3 py-2 rounded-md border 
          focus:outline-none focus:ring-2 transition
          ${error
            ? "border-red-500 focus:ring-red-300"
            : "border-gray-300 focus:ring-blue-300"}
          ${className}
        `}
      />

      {error && (
        <p className="mt-1 text-sm text-red-500">
          {error}
        </p>
      )}
    </div>
  );
};

export default Input;