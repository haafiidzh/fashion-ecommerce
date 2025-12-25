"use client";

import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
  useCallback,
  useRef,
} from "react";
import { Cart, CartState } from "../types/cart-types";
import { cartApi } from "../service/cart-service";
import { toast } from "sonner";

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
};

type CartAction =
  | { type: "FETCH_CART_REQUEST" }
  | { type: "FETCH_CART_SUCCESS"; payload: Cart }
  | { type: "FETCH_CART_ERROR"; payload: string }
  | { type: "ADD_TO_CART_REQUEST" }
  | { type: "ADD_TO_CART_SUCCESS"; payload: Cart }
  | { type: "ADD_TO_CART_ERROR"; payload: string }
  | { type: "REMOVE_FROM_CART_REQUEST" }
  | { type: "REMOVE_FROM_CART_SUCCESS"; payload: Cart | null }
  | { type: "REMOVE_FROM_CART_ERROR"; payload: string }
  | { type: "UPDATE_QUANTITY_REQUEST" }
  | { type: "UPDATE_QUANTITY_SUCCESS"; payload: Cart }
  | { type: "UPDATE_QUANTITY_ERROR"; payload: string }
  | { type: "CLEAR_CART_REQUEST" }
  | { type: "CLEAR_CART_SUCCESS" }
  | { type: "CLEAR_CART_ERROR"; payload: string };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case "FETCH_CART_REQUEST":
    case "ADD_TO_CART_REQUEST":
    case "REMOVE_FROM_CART_REQUEST":
    case "UPDATE_QUANTITY_REQUEST":
    case "CLEAR_CART_REQUEST":
      return { ...state, loading: true, error: null };
    case "FETCH_CART_SUCCESS":
      return {
        ...state,
        loading: false,
        cart: action.payload,
        error: null,
      };
    case "ADD_TO_CART_SUCCESS":
    case "UPDATE_QUANTITY_SUCCESS":
      return {
        ...state,
        loading: false,
        cart: action.payload,
        error: null,
      };
    case "REMOVE_FROM_CART_SUCCESS":
      return {
        ...state,
        loading: false,
        cart: action.payload,
        error: null,
      };
    case "CLEAR_CART_SUCCESS":
      return {
        ...state,
        loading: false,
        cart: null,
        error: null,
      };
    case "FETCH_CART_ERROR":
    case "ADD_TO_CART_ERROR":
    case "REMOVE_FROM_CART_ERROR":
    case "UPDATE_QUANTITY_ERROR":
    case "CLEAR_CART_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  fetchCart: (userId: number) => Promise<void>;
  addToCart: (userId: number, productId: number, quantity?: number) => Promise<void>;
  removeFromCart: (userId: number, productId: number) => Promise<void>;
  updateQuantity: (userId: number, productId: number, quantity: number) => Promise<void>;
  clearCart: (userId: number) => Promise<void>;
}>({
  state: initialState,
  fetchCart: async () => {},
  addToCart: async () => {},
  removeFromCart: async () => {},
  updateQuantity: async () => {},
  clearCart: async () => {},
});

export const CartProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const isLoadingRef = useRef(false);

  const fetchCart = useCallback(async (userId: number, force: boolean = false) => {
    if (isLoadingRef.current && !force) return; // Prevent multiple simultaneous fetches unless forced
    
    isLoadingRef.current = true;
    dispatch({ type: "FETCH_CART_REQUEST" });
    try {
      const cart = await cartApi.getCart(userId);
      dispatch({
        type: "FETCH_CART_SUCCESS",
        payload: cart,
      });
    } catch (error) {
      console.error("Failed to fetch cart:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch cart";
      dispatch({
        type: "FETCH_CART_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      isLoadingRef.current = false;
    }
  }, []);

  const addToCart = async (
    userId: number,
    productId: number,
    quantity: number = 1
  ) => {
    dispatch({ type: "ADD_TO_CART_REQUEST" });
    try {
      await cartApi.addToCart(userId, productId, quantity);
      const freshCart = await cartApi.getCart(userId);
      dispatch({
        type: "ADD_TO_CART_SUCCESS",
        payload: freshCart,
      });
      toast.success("Item added to cart successfully");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add item to cart";
      dispatch({
        type: "ADD_TO_CART_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  const removeFromCart = async (userId: number, productId: number) => {
    dispatch({ type: "REMOVE_FROM_CART_REQUEST" });
    try {
      await cartApi.removeFromCart(userId, productId);
      const freshCart = await cartApi.getCart(userId);
      dispatch({
        type: "REMOVE_FROM_CART_SUCCESS",
        payload: freshCart,
      });
      toast.success("Item removed from cart successfully");
    } catch (error) {
      console.error("Failed to remove from cart:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to remove item from cart";
      dispatch({
        type: "REMOVE_FROM_CART_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  const updateQuantity = async (
    userId: number,
    productId: number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      await removeFromCart(userId, productId);
      return;
    }

    dispatch({ type: "UPDATE_QUANTITY_REQUEST" });
    try {
      const updatedCart = await cartApi.updateCartItemQuantity(
        userId,
        productId,
        quantity
      );
      
      dispatch({
        type: "UPDATE_QUANTITY_SUCCESS",
        payload: updatedCart,
      });
      toast.success("Quantity updated successfully");
    } catch (error) {
      console.error("Failed to update quantity:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to update item quantity";
      dispatch({
        type: "UPDATE_QUANTITY_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  const clearCart = async (userId: number) => {
    dispatch({ type: "CLEAR_CART_REQUEST" });
    try {
      await cartApi.clearCart(userId);
      dispatch({
        type: "CLEAR_CART_SUCCESS",
      });
      toast.success("Cart cleared successfully");
    } catch (error) {
      console.error("Failed to clear cart:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to clear cart";
      dispatch({
        type: "CLEAR_CART_ERROR",
        payload: errorMessage,
      });
      toast.error(errorMessage);
    }
  };

  return (
    <CartContext.Provider
      value={{
        state,
        fetchCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

