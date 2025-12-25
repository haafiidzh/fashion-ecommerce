import { CustomerLayout } from "@/components/layout";

export default function ProductsPage() {
  return (
    <CustomerLayout
      breadcrumbs={[
        { label: "Shop" }
      ]}
    >
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        <p className="text-muted-foreground">Products page content will be here...</p>
      </div>
    </CustomerLayout>
  );
}
