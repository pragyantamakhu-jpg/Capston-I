async function getHealthData() {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch health data");
  return res.json();
}

export default async function HealthPage() {
  const data = await getHealthData();

  return (
    <div>
      <h1 className="text-2xl font-bold">Health Check</h1>
      <p className="mt-2 text-neutral-600">
        Status: <span className="font-semibold text-brand-600">OK</span>
      </p>
      <pre className="mt-4 rounded-lg bg-neutral-100 p-4 text-sm">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}