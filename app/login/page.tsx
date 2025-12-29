"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/AuthLayout";
import FormInput from "@/components/FormInput";
import Button from "@/components/Button";
import ErrorMessage from "@/components/ErrorMessage";
import { useAuthForm } from "@/hooks/useAuthForm";
import { FormField, LoginFormValues } from "@/types/form";

const FORM_FIELDS: FormField[] = [
  { id: "email", name: "email", type: "email", label: "Email", placeholder: "email@example.com" },
  { id: "password", name: "password", type: "password", label: "Password", placeholder: "••••••••" },
];

export default function LoginPage() {
  const router = useRouter();

  const { values, error, loading, handleChange, handleSubmit } = useAuthForm<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: async (values) => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      // Check user role and redirect accordingly
      try {
        const response = await fetch('/api/user-role');
        if (response.ok) {
          const data = await response.json();
          if (data.isAdmin) {
            router.push("/dashboard");
          } else {
            router.push("/shop");
          }
        } else {
          // Default to shop if role check fails
          router.push("/shop");
        }
      } catch (error) {
        console.error("Failed to check user role:", error);
        // Default to shop if role check fails
        router.push("/shop");
      }

      router.refresh();
    },
  });

  return (
    <AuthLayout title="Login" subtitle="Masuk ke akun Anda">
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
          Login
        </Button>

        <p className="text-center text-sm text-gray-600">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-600 hover:underline">
            Daftar di sini
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
