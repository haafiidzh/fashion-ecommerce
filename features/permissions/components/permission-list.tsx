"use client";

import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { usePermission } from "../context/permission-context";
import PermissionTable from "./permission-table";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PermissionForm from "./permission-form";

export default function PermissionList() {
	const { state, createPermission, updatePermission, deletePermission } = usePermission();
	const { permissions, loading } = state;
	const router = useRouter();
	const [edit, setEdit] = useState(false);
	const [selectedPermission, setSelectedPermission] = useState<any>(null);
	const [open, setOpen] = useState(false);

	const handleOpenDialog = (isEdit: boolean, data: any) => {
		setEdit(isEdit);
		setOpen(true);
		setSelectedPermission(data);
	}

	const handleSubmitAdd = (data: any) => {
		createPermission(data);
		setOpen(false);
	}

	const handleSubmitEdit = (id: number, data: any) => {
		updatePermission(id, data);
		setOpen(false);
	}

	const handleDelete = (id: number) => {
		deletePermission(id);
	}

	const handleDetail = (id: number) => {
		router.push(`/dashboard/permissions/${id}`);
	}

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
            Permissions
          </h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Manage your permissions here
          </p>
        </div>
        <Button className="cursor-pointer" onClick={() => handleOpenDialog(false, null)}>
          <IconPlus /> Add permission
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <PermissionTable 
					data={permissions} 
					onDelete={handleDelete} 
					onEdit={(isEdit, data) => handleOpenDialog(isEdit, data)} 
					onDetail={handleDetail} 
				/>
      )}

      <PermissionForm
        isEdit={edit}
        open={open}
        setOpen={() => setOpen(false)}
        onSubmit={handleSubmitAdd}
        onEdit={handleSubmitEdit}
        selectedPermissionData={selectedPermission}
      />
    </div>
  );
}
