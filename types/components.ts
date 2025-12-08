export interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export interface FormInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
}

export interface ButtonProps {
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
}

export interface ErrorMessageProps {
  message: string;
}
