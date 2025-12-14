import UserDetailPages from "@/components/pages/admin/users/user-detail-pages";
import { usersApi } from "@/data/users";

export default async function UserDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

	const res = await fetch(`${process.env.API_URL}/users/${parseInt(id)}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
		},
	});
	
	const data = await res.json();
  return (
    <div className="container mx-auto px-4 py-8">
      <UserDetailPages data={data} />
    </div>
  );
}
