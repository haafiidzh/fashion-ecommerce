"use client";

export default function UsersPage() {
  const users = [
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "User" },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Users
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your users here
        </p>
      </div>

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
                  Role
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-800 dark:text-neutral-200">
                    {user.role}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
