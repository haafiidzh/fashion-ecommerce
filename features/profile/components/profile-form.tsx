"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Profile, UpdateProfileData } from "../types/profile-types";
import { useEffect } from "react";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconCalendar,
  IconMapPin,
  IconCheck,
} from "@tabler/icons-react";

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  onSubmit: (data: UpdateProfileData) => void;
  onCancel: () => void;
  saving: boolean;
}

const formatDateForInput = (
  date: Date | string | null | undefined
): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const day = String(dateObj.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function ProfileForm({
  profile,
  isEditing,
  onSubmit,
  onCancel,
  saving,
}: ProfileFormProps) {
  const form = useForm<UpdateProfileData>({
    defaultValues: {
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      pob: profile.pob || "",
      dob: formatDateForInput(profile.dob),
    },
  });

  useEffect(() => {
    form.reset({
      username: profile.username || "",
      email: profile.email || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      pob: profile.pob || "",
      dob: formatDateForInput(profile.dob),
    });
  }, [profile, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
      {/* Username */}
      <Controller
        name="username"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Username</FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconUser className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <Input
                {...field}
                readOnly={!isEditing}
                className="pl-10"
                placeholder="Enter username"
              />
            </div>
          </Field>
        )}
      />

      {/* Email */}
      <Controller
        name="email"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Email Address</FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconMail className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <Input
                {...field}
                type="email"
                readOnly={!isEditing}
                className="pl-10 pr-10"
                placeholder="Enter email"
              />
              {profile.email_verified_at && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                    <IconCheck className="h-4 w-4 text-white" />
                  </div>
                </div>
              )}
            </div>
            {profile.email_verified_at && (
              <p className="mt-1.5 text-xs text-green-600 dark:text-green-400">
                ✓ Email verified
              </p>
            )}
          </Field>
        )}
      />

      {/* Phone */}
      <Controller
        name="phone"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Phone Number</FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconPhone className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <Input
                {...field}
                readOnly={!isEditing}
                className="pl-10"
                placeholder="Enter phone number"
              />
            </div>
          </Field>
        )}
      />

      {/* Gender */}
      <Controller
        name="gender"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Gender</FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 flex items-center pl-3">
                <IconUser className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              {isEditing ? (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={field.value || ""}
                  readOnly
                  className="pl-10 capitalize"
                  placeholder=""
                />
              )}
            </div>
          </Field>
        )}
      />

      {/* Place of Birth */}
      <Controller
        name="pob"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Place of Birth</FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconMapPin className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              <Input
                {...field}
                readOnly={!isEditing}
                className="pl-10"
                placeholder="Enter place of birth"
              />
            </div>
          </Field>
        )}
      />

      {/* Date of Birth */}
      <Controller
        name="dob"
        control={form.control}
        render={({ field }) => (
          <Field>
            <FieldLabel>Date of Birth</FieldLabel>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <IconCalendar className="h-5 w-5 text-neutral-400 dark:text-neutral-500" />
              </div>
              {isEditing ? (
                <Input
                  {...field}
                  type="date"
                  className="pl-10"
                  placeholder="Select date of birth"
                />
              ) : (
                <Input
                  value={
                    profile.dob
                      ? new Date(profile.dob).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""
                  }
                  readOnly
                  className="pl-10"
                  placeholder=""
                />
              )}
            </div>
          </Field>
        )}
      />

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={saving}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="flex-1">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </form>
  );
}
