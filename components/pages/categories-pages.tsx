import CategoryList from "@/features/categories/components/category-list";
import { CategoryProvider } from "@/features/categories/context/category-context";

export default function CategoriesPages() {
    return (
        <CategoryProvider>
            <div className="container mx-auto px-4 py-8">
                <CategoryList />
            </div>
        </CategoryProvider>
    );
}