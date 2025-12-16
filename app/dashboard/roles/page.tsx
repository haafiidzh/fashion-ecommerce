import RolePages from "@/components/pages/admin/roles/role-table-pages";
import { RoleProvider } from "@/features/roles/context/role-context";

export default async function RolesPage() {
	return (
		<RoleProvider>
			<RolePages />
		</RoleProvider>
  );
}
