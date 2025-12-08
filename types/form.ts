export interface FormField {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
}

export interface UseAuthFormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => Promise<void>;
  validate?: (values: T) => string | null;
}

export interface LoginFormValues extends Record<string, string> {
  email: string;
  password: string;
}

export interface RegisterFormValues extends Record<string, string> {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}
