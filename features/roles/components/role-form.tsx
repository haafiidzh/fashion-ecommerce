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

export default function RoleForm({
  isEdit,
  open,
  setOpen,
  onSubmit,
  onEdit,
  selectedRoleData,
}: {
  isEdit: boolean;
  open: boolean;
  setOpen: () => void;
  onSubmit: (data: any) => void;
  onEdit: (id: number, data: any) => void;
  selectedRoleData: any;
}) {
  const form = useForm<{
    name: string;
    guard: string;
  }>({
    defaultValues: {
      name: "",
      guard: "",
    },
  });

  useEffect(() => {
    if (isEdit && selectedRoleData) {
      form.reset(selectedRoleData);
    }
  }, [isEdit, selectedRoleData, form]);

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
          }
        >
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
          </div>
          <Button className="cursor-pointer mt-4" type="submit">
            {isEdit ? "Update Role" : "Add Role"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

