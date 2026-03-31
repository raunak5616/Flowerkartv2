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
      axios.get(`${import.meta.env.VITE_API_URL}/user-data/${user._id}`)
        .then((res) => {
          if (res.data) {
            cartDispatch({ type: "SET_INITIAL_DATA", payload: res.data });
          }
          isInitialized.current = true;
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
      axios.post(`${import.meta.env.VITE_API_URL}/user-data/${user._id}`, {
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


