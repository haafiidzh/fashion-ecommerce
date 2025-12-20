"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import { Gender } from "@/app/generated/prisma/enums";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { IconEye, IconEyeOff } from "@tabler/icons-react";
import { useRole } from "@/features/roles/context/role-context";

const UserForm = ({
  isEdit,
  selectedUserData,
  open,
  setOpen,
  onSubmit,
  onEdit,
}: {
  isEdit: boolean;
  selectedUserData: any | null;
  open: boolean;
  setOpen: () => void;
  onSubmit: (data: any) => void;
  onEdit: (id: number, data: any) => void;
}) => {
  const form = useForm<{
    role: number;
    username: string;
    email: string;
    password: string;
    phone: string;
    gender: Gender | "";
    dob: string;
    pob: string;
  }>({
    defaultValues: {
      role: 1,
      username: "",
      email: "",
      password: "",
      phone: "",
      gender: "",
      dob: "",
      pob: "",
    },
  });

  const { state: roleState } = useRole();
  const { roles, loading } = roleState;
  const [showPassword, setShowPassword] = useState(false);

  const formatDateForInput = (date: Date | string | null | undefined): string => {
    if (!date) return "";
    const dateObj = typeof date === "string" ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return "";
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (open) {
      if (isEdit && selectedUserData) {
        form.reset({
          role: selectedUserData.role || 1,
          username: selectedUserData.username || "",
          email: selectedUserData.email || "",
          password: "",
          phone: selectedUserData.phone || "",
          gender: selectedUserData.gender || "",
          dob: formatDateForInput(selectedUserData.dob),
          pob: selectedUserData.pob || "",
        });
      } else {
        form.reset({
          role: undefined,
          username: "",
          email: "",
          password: "",
          phone: "",
          gender: "",
          dob: "",
          pob: "",
        });
      }
    }
  }, [open, isEdit, selectedUserData, form]);
	
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>{isEdit ? "Edit User" : "Add User"}</DialogTitle>
        <DialogHeader>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </DialogHeader>
        <form onSubmit={form.handleSubmit(isEdit && selectedUserData ? (data) => onEdit(selectedUserData.id, data) : onSubmit)}>
          <div className="flex flex-col gap-2">
          <Controller
              name="role"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
                  <FieldLabel>Role</FieldLabel>

                  <Select onValueChange={(value) => field.onChange(parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Role" />
                    </SelectTrigger>

                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem value={role.id.toString()}>{role.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
            <Controller
              name="username"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Username</FieldLabel>
                  <Input {...field} placeholder="Input Your Username" />
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Email</FieldLabel>
                  <Input {...field} type="email" placeholder="Input Your Email" />
                </Field>
              )}
            />
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Password</FieldLabel>
                  <div className="relative">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Input Your Password"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      tabIndex={-1}
                      className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer p-1 bg-transparent border-none outline-none text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                    </button>
                  </div>
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Phone</FieldLabel>
                  <Input {...field} placeholder="Input Your Phone Number" />
                </Field>
              )}
            />
            <Controller
              name="pob"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Place of Birth</FieldLabel>
                  <Input {...field} placeholder="Input Your Place of Birth" />
                </Field>
              )}
            />
            <Controller
              name="dob"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Date of Birth</FieldLabel>
                  <Input
                    {...field}
                    type="date"
                    placeholder="Input Your Date of Birth"
                  />
                </Field>
              )}
            />
            <Controller
              name="gender"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field aria-invalid={fieldState.invalid}>
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

            <Button className="cursor-pointer" type="submit">
              {isEdit ? "Update User" : "Add User"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UserForm;
