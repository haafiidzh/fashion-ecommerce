import ProductsPages from "@/components/pages/products-pages";
import { ProductProvider } from "@/features/products/context/product-context";

export default function Products() {
  return (
    <ProductProvider>
      <ProductsPages />
    </ProductProvider>
  );
}
