"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useRole } from "../context/role-context";
import RoleTable from "./role-table";
import { useRouter } from "next/navigation";
import RoleForm from "./role-form";

export default function RoleList() {
  const { state, createRole, updateRole, deleteRole } = useRole();
  const { roles, loading } = state;
  const [edit, setEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleOpenDialog = (isEdit: boolean, data: any) => {
    setEdit(isEdit);
    setOpen(true);
    setSelectedRole(data);
  };

  const handleSubmitAdd = (data: any) => {
    createRole(data);
    setOpen(false);
  };

  const handleSubmitEdit = (id: number, data: any) => {
    updateRole(id, data);
    setOpen(false);
  };

  const handleDelete = (id: number) => {
    deleteRole(id);
  };

  const handleDetail = (id: number) => {
    router.push(`/dashboard/roles/${id}`);
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Roles
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your roles here
          </p>
        </div>

        <Button className="cursor-pointer" onClick={() => handleOpenDialog(false, null)}>
          <IconPlus /> Add role
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <RoleTable
          data={roles}
          onDelete={handleDelete}
          onEdit={(isEdit, data) => handleOpenDialog(isEdit, data)}
          onDetail={handleDetail}
        />
      )}

      <RoleForm
        isEdit={edit}
        open={open}
        setOpen={() => setOpen(false)}
        onSubmit={handleSubmitAdd}
        onEdit={handleSubmitEdit}
        selectedRoleData={selectedRole}
      />
    </div>
  );
}
