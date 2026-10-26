import { redirect } from "next/navigation";

export default async function FlatDetailRedirect({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  redirect(`/admin/flats/${id}`);
}
