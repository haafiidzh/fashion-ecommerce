import PermissionDetailPages from "@/components/pages/admin/permissions/permission-detail-pages";

export default async function PermissionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.API_URL}/permissions/${parseInt(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

  const { data } = await res.json();
	return (
		<div className="container mx-auto px-4 py-8">
			<PermissionDetailPages data={data} />
		</div>
	);
}
