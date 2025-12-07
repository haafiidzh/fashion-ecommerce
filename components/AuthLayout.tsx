import { AuthLayoutProps } from "@/types/components";

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-center text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-center text-gray-600">{subtitle}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
