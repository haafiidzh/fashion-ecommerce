"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { UpdatePasswordData } from "../types/account-types";
import { IconLock, IconEye, IconEyeOff } from "@tabler/icons-react";
import { useState } from "react";

interface PasswordSectionProps {
  onUpdate: (data: UpdatePasswordData) => Promise<void>;
}

export default function PasswordSection({ onUpdate }: PasswordSectionProps) {
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const form = useForm<UpdatePasswordData>({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: UpdatePasswordData) => {
    if (data.newPassword !== data.confirmPassword) {
      alert("New passwords do not match");
      return;
    }
    await onUpdate(data);
    form.reset();
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8">
      <h2 className="mb-6 text-2xl font-bold text-black">
        Change Password
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="currentPassword"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Current Password</FieldLabel>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  {...field}
                  type={showPasswords.current ? "text" : "password"}
                  className="pl-10 pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      current: !prev.current,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPasswords.current ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>
          )}
        />

        <Controller
          name="newPassword"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>New Password</FieldLabel>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  {...field}
                  type={showPasswords.new ? "text" : "password"}
                  className="pl-10 pr-10"
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({ ...prev, new: !prev.new }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPasswords.new ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>
          )}
        />

        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Confirm New Password</FieldLabel>
              <div className="relative">
                <IconLock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  {...field}
                  type={showPasswords.confirm ? "text" : "password"}
                  className="pl-10 pr-10"
                  placeholder="Confirm new password"
                />
                <button
                  type="button"
                  onClick={() =>
                    setShowPasswords((prev) => ({
                      ...prev,
                      confirm: !prev.confirm,
                    }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  {showPasswords.confirm ? (
                    <IconEyeOff className="h-5 w-5" />
                  ) : (
                    <IconEye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>
          )}
        />

        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Password must be at least 8 characters long and contain uppercase,
            lowercase, and numbers.
          </p>
        </div>

        <Button 
          type="submit" 
          className="w-full rounded-full bg-black py-6 text-base font-medium hover:bg-neutral-800"
        >
          Update Password
        </Button>
      </form>
    </div>
  );
}
