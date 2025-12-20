import ProductsPages from "@/components/pages/products-pages";
import { ProductProvider } from "@/features/products/context/product-context";
import {CategoryProvider} from "@/features/categories/context/category-context";

export default function Products() {
  return (
    <CategoryProvider>
        <ProductProvider>
          <ProductsPages />
        </ProductProvider>
    </CategoryProvider>
  );
}
