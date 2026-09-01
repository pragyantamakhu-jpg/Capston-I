export default async function RestaurantMenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div>
      <h1 className="text-2xl font-bold">Menu — Restaurant {id}</h1>
      <p className="mt-2 text-neutral-600">Cuisine/menu items go here.</p>
    </div>
  );
}