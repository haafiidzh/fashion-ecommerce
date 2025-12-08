"use client";

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Product A", price: "$99", stock: 50 },
    { id: 2, name: "Product B", price: "$149", stock: 30 },
    { id: 3, name: "Product C", price: "$199", stock: 20 },
  ];

  return (
    <div className="flex flex-col gap-4 p-4 md:p-10">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">
          Products
        </h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          Manage your products here
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="mb-4 h-32 rounded bg-neutral-100 dark:bg-neutral-700" />
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200">
              {product.name}
            </h3>
            <p className="mt-2 text-xl font-bold text-neutral-800 dark:text-neutral-200">
              {product.price}
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              Stock: {product.stock}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
