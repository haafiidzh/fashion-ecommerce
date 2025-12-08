"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { useAuthForm } from "@/hooks/useAuthForm";
import { FormField, RegisterFormValues } from "@/types/form";

const FORM_FIELDS: FormField[] = [
  { id: "username", name: "username", type: "text", label: "Username", placeholder: "johndoe" },
  { id: "email", name: "email", type: "email", label: "Email", placeholder: "email@example.com" },
  { id: "password", name: "password", type: "password", label: "Password", placeholder: "••••••••" },
  { id: "confirmPassword", name: "confirmPassword", type: "password", label: "Konfirmasi Password", placeholder: "••••••••" },
];

export default function RegisterPage() {
  const router = useRouter();

  const { values, error, loading, handleChange, handleSubmit } = useAuthForm<RegisterFormValues>({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: (values) => {
      if (values.password !== values.confirmPassword) {
        return "Password tidak cocok";
      }
      if (values.password.length < 6) {
        return "Password minimal 6 karakter";
      }
      return null;
    },
    onSubmit: async (values) => {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Terjadi kesalahan");
      }

      router.push("/login?registered=true");
    },
  });

  return (
    <AuthLayout title="Daftar" subtitle="Buat akun baru">
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <ErrorMessage message={error} />

        <div className="space-y-4">
          {FORM_FIELDS.map((field) => (
            <FormInput
              key={field.id}
              {...field}
              value={values[field.name as keyof typeof values]}
              onChange={handleChange}
            />
          ))}
        </div>

        <Button type="submit" loading={loading}>
          Daftar
        </Button>

        <p className="text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login di sini
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
