"use client";

import UserTable from "./user-table";
import { useUser } from "../context/user-context";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import UserForm from "./user-form";
import { useRouter } from "next/navigation";

export default function UserList() {
  const { state, createUser, updateUser, deleteUser } = useUser();
  const { users, loading } = state;
  const [edit, setEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleOpenDialog = (isEdit: boolean, data: any) => {
    setEdit(isEdit);
    setOpen(true);
    setSelectedUser(data);
  };

  const handleSubmitAdd = (data: any) => {
    createUser(data);
    setOpen(false);
  }

  const handleSubmitEdit = (id: number, data: any) => {
    updateUser(id, data);
    setOpen(false);
  }

  const handleDelete = (id: number) => {
    deleteUser(id);
  }

  const handleDetail = (id: number) => {
    router.push(`/dashboard/users/${id}`);
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Users
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your users here
          </p>
        </div>

        <Button className="cursor-pointer" onClick={() => handleOpenDialog(false, null)}>
          <IconPlus /> Add user
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <UserTable data={users} onDelete={handleDelete} onEdit={(isEdit, data) => handleOpenDialog(isEdit, data)} onDetail={handleDetail} />
      )}

      <UserForm 
        isEdit={edit}
        open={open} 
        setOpen={() => setOpen(false)} 
        onSubmit={handleSubmitAdd} 
        onEdit={handleSubmitEdit}
        selectedUserData={selectedUser}
      />
    </div>
  );
}
