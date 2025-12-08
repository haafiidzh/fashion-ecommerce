import { ErrorMessageProps } from "@/types/components";

export default function ErrorMessage({ message }: ErrorMessageProps) {
  if (!message) return null;
  
  return (
    <div className="bg-red-50 text-red-500 p-3 rounded text-sm">
      {message}
    </div>
  );
}
