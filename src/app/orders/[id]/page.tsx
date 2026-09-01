export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Order {id}</h1>
      <p className="mt-2 text-neutral-600">Order confirmation/detail goes here.</p>
    </div>
  );
}