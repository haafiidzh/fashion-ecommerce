import PermissionTablePages from "@/components/pages/admin/permissions/permission-table-pages";
import { PermissionProvider } from "@/features/permissions/context/permission-context";

export default function PermissionsPage() {
  return (
    <PermissionProvider>
        <PermissionTablePages />
    </PermissionProvider>
  );
}