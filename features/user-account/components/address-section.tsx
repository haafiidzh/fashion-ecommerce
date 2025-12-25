"use client";

import { Controller, useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Address } from "../types/account-types";
import { IconMapPin, IconPhone } from "@tabler/icons-react";

interface AddressSectionProps {
  addresses: Address[];
  onAdd: (data: Partial<Address>) => Promise<void>;
  onUpdate: (id: number, data: Partial<Address>) => Promise<void>;
}

export default function AddressSection({
  addresses,
  onAdd,
}: AddressSectionProps) {
  const form = useForm({
    defaultValues: {
      phone: "",
      province: "",
      region: "",
      district: "",
      village: "",
      post_code: "",
      note: "",
    },
  });

  const onSubmit = async (data: any) => {
    await onAdd(data);
    form.reset();
  };

  return (
    <div className="space-y-6">
      {/* Existing Addresses */}
      {addresses.length > 0 && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-8">
          <h2 className="mb-6 text-2xl font-bold text-black">
            Saved Addresses
          </h2>
          <div className="space-y-4">
            {addresses.map((address) => (
              <div
                key={address.id}
                className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-700"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      {address.village}, {address.district}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      {address.region}, {address.province} {address.post_code}
                    </p>
                    {address.phone && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Phone: {address.phone}
                      </p>
                    )}
                    {address.note && (
                      <p className="text-sm text-neutral-500 dark:text-neutral-500">
                        Note: {address.note}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add New Address */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-8">
        <h2 className="mb-6 text-2xl font-bold text-black">
          Add New Address
        </h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <Controller
            name="phone"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <div className="relative">
                  <IconPhone className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
                  <Input {...field} className="pl-10" placeholder="Enter phone number" />
                </div>
              </Field>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="province"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Province</FieldLabel>
                  <Input {...field} placeholder="Enter province" />
                </Field>
              )}
            />

            <Controller
              name="region"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Region/City</FieldLabel>
                  <Input {...field} placeholder="Enter region" />
                </Field>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Controller
              name="district"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>District</FieldLabel>
                  <Input {...field} placeholder="Enter district" />
                </Field>
              )}
            />

            <Controller
              name="village"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Village</FieldLabel>
                  <Input {...field} placeholder="Enter village" />
                </Field>
              )}
            />
          </div>

          <Controller
            name="post_code"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Postal Code</FieldLabel>
                <Input {...field} placeholder="Enter postal code" />
              </Field>
            )}
          />

          <Controller
            name="note"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel>Note (Optional)</FieldLabel>
                <Input {...field} placeholder="Additional notes" />
              </Field>
            )}
          />

          <Button 
            type="submit" 
            className="w-full rounded-full bg-black py-6 text-base font-medium hover:bg-neutral-800"
          >
            Add Address
          </Button>
        </form>
      </div>
    </div>
  );
}
