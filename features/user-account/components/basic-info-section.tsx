"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { UserAccount } from "../types/account-types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IconUser, IconMail, IconPhone, IconCalendar, IconMapPin } from "@tabler/icons-react";

interface BasicInfoSectionProps {
  user: UserAccount;
  onUpdate: (data: Partial<UserAccount>) => Promise<void>;
}

const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return "";
  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "";
  return dateObj.toISOString().split("T")[0];
};

export default function BasicInfoSection({
  user,
  onUpdate,
}: BasicInfoSectionProps) {
  const form = useForm({
    defaultValues: {
      username: user.username || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      pob: user.pob || "",
      dob: formatDateForInput(user.dob),
    },
  });

  const onSubmit = async (data: any) => {
    await onUpdate(data);
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-8">
      <h2 className="mb-6 text-2xl font-bold text-black">
        Basic Information
      </h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <Controller
          name="username"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Username</FieldLabel>
              <div className="relative">
                <IconUser className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input {...field} className="pl-10" placeholder="Enter username" />
              </div>
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Email</FieldLabel>
              <div className="relative">
                <IconMail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  {...field}
                  type="email"
                  className="pl-10"
                  placeholder="Enter email"
                />
              </div>
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Phone</FieldLabel>
              <div className="relative">
                <IconPhone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input {...field} className="pl-10" placeholder="Enter phone number" />
              </div>
            </Field>
          )}
        />

        <Controller
          name="gender"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Gender</FieldLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          )}
        />

        <Controller
          name="pob"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Place of Birth</FieldLabel>
              <div className="relative">
                <IconMapPin className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input {...field} className="pl-10" placeholder="Enter place of birth" />
              </div>
            </Field>
          )}
        />

        <Controller
          name="dob"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel>Date of Birth</FieldLabel>
              <div className="relative">
                <IconCalendar className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                <Input
                  {...field}
                  type="date"
                  className="pl-10"
                  placeholder="Select date"
                />
              </div>
            </Field>
          )}
        />

        <Button 
          type="submit" 
          className="w-full rounded-full bg-black py-6 text-base font-medium hover:bg-neutral-800"
        >
          Save Changes
        </Button>
      </form>
    </div>
  );
}
