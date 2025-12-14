"use client";

import { User } from "../types/user-types";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { IconDots, IconEdit, IconEye, IconTrash } from "@tabler/icons-react";

export default function UserTable({ data, onDelete, onEdit, onDetail }: { data: User[], onDelete: (id: number) => void, onEdit: (isEdit: boolean, data: any) => void, onDetail: (id: number) => void }) {
  return (
    <div className="rounded-lg border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-neutral-200 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Gender
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-neutral-600 dark:text-neutral-400">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {data.map((user: User, index: number) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {user.username}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {user.gender === "male" ? "Male" : "Female"}
                  </td>
                  <td className="px-6 py-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="cursor-pointer">
                          <IconDots className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onSelect={() => onDetail(user.id)}
                          className="cursor-pointer"
                        >
                          <IconEye className="w-4 h-4" /> Detail
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => onEdit(true, user)}
                          className="cursor-pointer"
                        >
                          <IconEdit className="w-4 h-4" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onSelect={() => onDelete(user.id)}
                          className="cursor-pointer"
                        >
                          <IconTrash className="w-4 h-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
  );
}