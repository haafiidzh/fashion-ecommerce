import { useState } from "react";
import { UseAuthFormProps } from "@/types/form";

export function useAuthForm<T extends Record<string, string>>({
  initialValues,
  onSubmit,
  validate,
}: UseAuthFormProps<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (validate) {
      const validationError = validate(values);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    setLoading(true);

    try {
      await onSubmit(values);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return {
    values,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
}
