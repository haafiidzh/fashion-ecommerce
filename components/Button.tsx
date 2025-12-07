import { ButtonProps } from "@/types/components";

const variants = {
  primary: "bg-blue-600 hover:bg-blue-700 text-white",
  secondary: "bg-gray-600 hover:bg-gray-700 text-white",
  danger: "bg-red-600 hover:bg-red-700 text-white",
};

export default function Button({
  type = "button",
  disabled = false,
  loading = false,
  children,
  variant = "primary",
  className = "",
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`w-full py-2 px-4 font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {loading ? "Loading..." : children}
    </button>
  );
}
