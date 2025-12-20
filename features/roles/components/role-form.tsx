import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Permission } from "@/features/permissions/types/permission-types";

export default function RoleForm({
  isEdit,
  open,
  permissions,
  setOpen,
  onSubmit,
  onEdit,
  selectedRoleData,
}: {
  isEdit: boolean;
  open: boolean;
  permissions: Permission[];
  setOpen: () => void;
  onSubmit: (data: any) => void;
  onEdit: (id: number, data: any) => void;
  selectedRoleData: any;
}) {
  const form = useForm<{
    name: string;
    guard: string;
    permissions: number[];
  }>({
    defaultValues: {
      name: "",
      guard: "",
      permissions: [],
    },
  });

  useEffect(() => {
    if (isEdit && selectedRoleData) {
      form.reset({
        name: selectedRoleData.name || "",
        guard: selectedRoleData.guard || "",
        permissions: selectedRoleData.permissions || [],
      });
    } else if (!isEdit && open) {
      form.reset({
        name: "",
        guard: "",
        permissions: [],
      });
    }
  }, [isEdit, selectedRoleData, open, form]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogTitle>
          {isEdit ? "Edit Role" : "Add Role"}
        </DialogTitle>
        <DialogHeader>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit.
        </DialogHeader>
        <form
          className="flex flex-col gap-2"
          onSubmit={
            isEdit && selectedRoleData
              ? (e) => {
                e.preventDefault();
                onEdit(selectedRoleData.id, form.getValues());
              }
              : (e) => {
                e.preventDefault();
                onSubmit(form.getValues());
              }
          }>
          <div className="flex flex-col gap-2">
            <Controller
              name="name"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Name</FieldLabel>
                  <Input {...field} placeholder="Input Your Name" />
                </Field>
              )}
            />
            <Controller
              name="guard"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel>Guard</FieldLabel>
                  <Input {...field} placeholder="Input Your Guard" />
                </Field>
              )}
            />

            <div className="mt-6 border border-neutral-200 rounded-lg p-4 relative pt-7">
              <div className="absolute -top-5 left-2 rounded-lg border border-neutral-300 bg-white w-fit p-2 text-sm">Permission</div>
              <Controller
                name="permissions"
                control={form.control}
                render={({ field }) => (
                  <div className="grid grid-cols-2 gap-4">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center gap-2">
                        <Checkbox
                          id={permission.id.toString()}
                          checked={field.value?.includes(permission.id) || false}
                          onCheckedChange={(checked) => {
                            const currentPermissions = field.value || [];
                            if (checked) {
                              field.onChange([...currentPermissions, permission.id]);
                            } else {
                              field.onChange(
                                currentPermissions.filter((id) => id !== permission.id)
                              );
                            }
                          }}
                        />
                        <Label htmlFor={permission.id.toString()}>{permission.name}</Label>
                      </div>
                    ))}
                  </div>
                )}
              />
            </div>
          </div>
          <Button className="cursor-pointer mt-4" type="submit">
            {isEdit ? "Update Role" : "Add Role"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

