import { useReducer, useEffect, useRef } from "react";
import { cartReducer } from "../../Reducer/cartReducer";
import { CartContext } from "./cart.context";
import { useAuth } from "../auth.context";
import axios from "axios";

const initialState = {
  cart: [],
  favourite: [],
};

export const CartProvider = ({ children }) => {
  const [{ cart, favourite }, cartDispatch] = useReducer(
    cartReducer,
    initialState
  );

  const { user } = useAuth();
  const isInitialized = useRef(false);

  useEffect(() => {
    if (user?._id) {
      // Use VITE_BASE_API_URL here as it's not an auth route
      axios.get(`${import.meta.env.VITE_BASE_API_URL}/user-data/${user._id}`)
        .then((res) => {
          if (res.data) {
            // MERGE_DATA ensures Guest items are not lost when logging in
            cartDispatch({ type: "MERGE_DATA", payload: res.data });
          }
          // Only after loading and merging is the provider 'initialized' for outgoing sync
          setTimeout(() => {
            isInitialized.current = true;
          }, 500); 
        })
        .catch((err) => {
          console.error("Failed to load user cart data", err);
          isInitialized.current = true;
        });
    } else {
      isInitialized.current = false;
      cartDispatch({ type: "SET_INITIAL_DATA", payload: { cart: [], favourite: [] } });
    }
  }, [user?._id]);

  useEffect(() => {
    if (isInitialized.current && user?._id) {
      // Use VITE_BASE_API_URL here as well
      axios.post(`${import.meta.env.VITE_BASE_API_URL}/user-data/${user._id}`, {
        cart,
        favourite
      }).catch(err => console.error("Failed to sync user cart data", err));
    }
  }, [cart, favourite, user?._id]);

  return (
    <CartContext.Provider value={{ cart, favourite, cartDispatch }}>
      {children}
    </CartContext.Provider>
  );
};


