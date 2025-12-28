// features/products/context/product-context.tsx
'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { productApi } from '../services/product-service';
import { Product, ProductState, ProductFormData } from '../types/product-types';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

// Tipe untuk state pemilihan produk
interface ProductSelectionState {
    sizeSelection: string;
    colorSelection: {
        name: string;
        code: string;
    };
    quantity: number;
}

// Tipe untuk Cart Item
interface CartItem {
    id: number;
    name: string;
    srcUrl: string;
    price: number;
    attributes: string[];
    discount: {
        percentage: number;
        amount: number;
    };
    quantity: number;
}

// === PERBAIKAN BACKWARD COMPATIBILITY ===
// ProductContextType sekarang memiliki properti `state` bersarang
// agar kompatibel dengan kode yang sudah ada.
interface ProductContextType {
    state: ProductState; // State untuk produk (products, loading, error)
    selection: ProductSelectionState; // State untuk pemilihan (ukuran, warna, qty)
    cart: CartItem[]; // State untuk keranjang
    // Fungsi-fungsi
    fetchProducts: () => Promise<void>;
    createProduct: (data: ProductFormData) => Promise<void>;
    updateProduct: (id: number, data: ProductFormData) => Promise<void>;
    deleteProduct: (id: number) => Promise<void>;
    clearError: () => void;
    setSizeSelection: (size: string) => void;
    setColorSelection: (color: { name: string; code: string }) => void;
    setQuantity: (quantity: number) => void;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number, attributes: string[]) => void;
    updateCartQuantity: (id: number, attributes: string[], quantity: number) => void;
    clearCart: () => void;
}

// === PERBAIKAN BACKWARD COMPATIBILITY ===
// initialState sekarang memiliki struktur bersarang dengan properti `state`
const initialState = {
    state: {
        products: [],
        loading: false,
        error: null,
    } as ProductState,
    selection: {
        sizeSelection: 'Medium',
        colorSelection: {
            name: 'Coklat',
            code: 'bg-[#4F4631]',
        },
        quantity: 1,
    },
    cart: [] as CartItem[],
};

type ProductAction =
    | { type: 'SET_LOADING'; payload: boolean }
    | { type: 'SET_ERROR'; payload: string | null }
    | { type: 'FETCH_PRODUCTS_SUCCESS'; payload: Product[] }
    | { type: 'CREATE_PRODUCT_SUCCESS'; payload: Product }
    | { type: 'UPDATE_PRODUCT_SUCCESS'; payload: Product }
    | { type: 'DELETE_PRODUCT_SUCCESS'; payload: number }
    | { type: 'SET_SIZE_SELECTION'; payload: string }
    | { type: 'SET_COLOR_SELECTION'; payload: { name: string; code: string } }
    | { type: 'SET_QUANTITY'; payload: number }
    | { type: 'ADD_TO_CART'; payload: CartItem }
    | { type: 'REMOVE_FROM_CART'; payload: { id: number; attributes: string[] } }
    | { type: 'UPDATE_CART_QUANTITY'; payload: { id: number; attributes: string[]; quantity: number } }
    | { type: 'CLEAR_CART' }
    | { type: 'RESET_STATE' };

// === PERBAIKAN BACKWARD COMPATIBILITY ===
// Reducer sekarang memanipulasi `state.state` untuk menjaga struktur bersarang
const productReducer = (state: typeof initialState, action: ProductAction): typeof initialState => {
    switch (action.type) {
        case 'SET_LOADING':
            return {
                ...state,
                state: { ...state.state, loading: action.payload }
            };
        case 'SET_ERROR':
            return {
                ...state,
                state: { ...state.state, error: action.payload, loading: false }
            };
        case 'FETCH_PRODUCTS_SUCCESS':
            return {
                ...state,
                state: { loading: false, products: action.payload, error: null }
            };
        case 'CREATE_PRODUCT_SUCCESS':
            return {
                ...state,
                state: {
                    ...state.state,
                    loading: false,
                    products: [...state.state.products, action.payload],
                    error: null,
                },
            };
        case 'UPDATE_PRODUCT_SUCCESS':
            return {
                ...state,
                state: {
                    ...state.state,
                    loading: false,
                    products: state.state.products.map((product) =>
                        product.id === action.payload.id ? action.payload : product
                    ),
                    error: null,
                },
            };
        case 'DELETE_PRODUCT_SUCCESS':
            return {
                ...state,
                state: {
                    ...state.state,
                    loading: false,
                    products: state.state.products.filter((product) => product.id !== action.payload),
                    error: null,
                },
            };
        case 'SET_SIZE_SELECTION':
            return {
                ...state,
                selection: { ...state.selection, sizeSelection: action.payload },
            };
        case 'SET_COLOR_SELECTION':
            return {
                ...state,
                selection: { ...state.selection, colorSelection: action.payload },
            };
        case 'SET_QUANTITY':
            return {
                ...state,
                selection: { ...state.selection, quantity: action.payload },
            };
        case 'ADD_TO_CART':
            const existingItem = state.cart.find(
                (item) =>
                    item.id === action.payload.id &&
                    JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
            );

            if (existingItem) {
                return {
                    ...state,
                    cart: state.cart.map((item) =>
                        item.id === action.payload.id &&
                        JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
                            ? { ...item, quantity: item.quantity + action.payload.quantity }
                            : item
                    ),
                };
            } else {
                return {
                    ...state,
                    cart: [...state.cart, action.payload],
                };
            }
        case 'REMOVE_FROM_CART':
            return {
                ...state,
                cart: state.cart.filter(
                    (item) =>
                        !(item.id === action.payload.id && JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes))
                ),
            };
        case 'UPDATE_CART_QUANTITY':
            return {
                ...state,
                cart: state.cart.map((item) =>
                    item.id === action.payload.id && JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)
                        ? { ...item, quantity: action.payload.quantity }
                        : item
                ),
            };
        case 'CLEAR_CART':
            return {
                ...state,
                cart: [],
            };
        case 'RESET_STATE':
            return { ...initialState };
        default:
            return state;
    }
};

const ProductContext = createContext<ProductContextType>({
    ...initialState,
    fetchProducts: async () => { },
    createProduct: async () => { },
    updateProduct: async () => { },
    deleteProduct: async () => { },
    clearError: () => { },
    setSizeSelection: () => { },
    setColorSelection: () => { },
    setQuantity: () => { },
    addToCart: () => { },
    removeFromCart: () => { },
    updateCartQuantity: () => { },
    clearCart: () => { },
});

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [reducerState, dispatch] = useReducer(productReducer, initialState);

    const path = usePathname();
    const fetchProducts = async () => {
        dispatch({ type: 'SET_LOADING', payload: true });
        try {
            const products = await productApi.getProducts();
            dispatch({ type: 'FETCH_PRODUCTS_SUCCESS', payload: products });
            if (path === "/dashboard/products") {
                toast.success("Success to fetch products");
            }
        } catch (error) {
            console.error('Failed to fetch products:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Failed to fetch products' });
            if (path === "/dashboard/products") {
                toast.error("Failed to fetch products");
            }
        }
    };

    const createProduct = async (data: ProductFormData) => {
        try {
            const product = await productApi.createProduct(data);
            dispatch({ type: 'CREATE_PRODUCT_SUCCESS', payload: product });
            toast.success('Produk berhasil dibuat');
            fetchProducts();
        } catch (error) {
            console.error('Failed to create product:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal membuat produk' });
            toast.error('Gagal membuat produk');
            throw error;
        }
    };

    const updateProduct = async (id: number, data: ProductFormData) => {
        try {
            const product = await productApi.updateProduct(id, data);
            dispatch({ type: 'UPDATE_PRODUCT_SUCCESS', payload: product });
            toast.success('Produk berhasil diperbarui');
        } catch (error) {
            console.error('Failed to update product:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal memperbarui produk' });
            toast.error('Gagal memperbarui produk');
            throw error;
        }
    };

    const deleteProduct = async (id: number) => {
        try {
            await productApi.deleteProduct(id);
            dispatch({ type: 'DELETE_PRODUCT_SUCCESS', payload: id });
            toast.success('Produk berhasil dihapus');
        } catch (error) {
            console.error('Failed to delete product:', error);
            dispatch({ type: 'SET_ERROR', payload: 'Gagal menghapus produk' });
            toast.error('Gagal menghapus produk');
            throw error;
        }
    };

    const clearError = () => {
        dispatch({ type: 'SET_ERROR', payload: null });
    };

    const setSizeSelection = (size: string) => {
        dispatch({ type: 'SET_SIZE_SELECTION', payload: size });
    };

    const setColorSelection = (color: { name: string; code: string }) => {
        dispatch({ type: 'SET_COLOR_SELECTION', payload: color });
    };

    const setQuantity = (quantity: number) => {
        dispatch({ type: 'SET_QUANTITY', payload: quantity });
    };

    const addToCart = (item: CartItem) => {
        dispatch({ type: 'ADD_TO_CART', payload: item });
        toast.success('Produk ditambahkan ke keranjang');
    };

    const removeFromCart = (id: number, attributes: string[]) => {
        dispatch({ type: 'REMOVE_FROM_CART', payload: { id, attributes } });
        toast.success('Produk dihapus dari keranjang');
    };

    const updateCartQuantity = (id: number, attributes: string[], quantity: number) => {
        dispatch({ type: 'UPDATE_CART_QUANTITY', payload: { id, attributes, quantity } });
    };

    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // === PERBAIKAN BACKWARD COMPATIBILITY ===
    // Value yang diberikan ke provider harus sesuai dengan ProductContextType
    const contextValue: ProductContextType = {
        state: reducerState.state,
        selection: reducerState.selection,
        cart: reducerState.cart,
        fetchProducts,
        createProduct,
        updateProduct,
        deleteProduct,
        clearError,
        setSizeSelection,
        setColorSelection,
        setQuantity,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
    };

    return (
        <ProductContext.Provider value={contextValue}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProduct must be used within a ProductProvider');
    }
    return context;
};