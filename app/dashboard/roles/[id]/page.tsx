import RoleDetailPages from "@/components/pages/admin/roles/role-detail-pages";

export default async function RoleDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const res = await fetch(`${process.env.API_URL}/roles/${parseInt(id)}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { data } = await res.json();
  return (
    <div className="container mx-auto px-4 py-8">
      <RoleDetailPages data={data} />
    </div>
  );
}

