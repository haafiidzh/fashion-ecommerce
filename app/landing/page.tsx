import LandingPages from "@/components/pages/landing-pages";
import {ProductProvider} from "@/features/products/context/product-context";

export default function Landing() {
    return(
        <ProductProvider>
            <LandingPages/>
        </ProductProvider>
    )
}