import { CustomerLayout } from "@/components/layout";

export default function AboutPage() {
  return (
    <CustomerLayout
      breadcrumbs={[
        { label: "About" }
      ]}
    >
      <div className="max-w-frame mx-auto px-4 xl:px-0 py-8">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        <div className="prose max-w-none">
          <p className="text-muted-foreground mb-4">
            Welcome to SHOP.CO - your premier destination for fashion that makes a statement.
          </p>
          <p className="text-muted-foreground">
            We believe in providing quality clothing that suits your style and makes you feel confident.
          </p>
        </div>
      </div>
    </CustomerLayout>
  );
}
