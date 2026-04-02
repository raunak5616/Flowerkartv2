export const cartReducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_INITIAL_DATA":
      return {
        ...state,
        cart: payload.cart || [],
        favourite: payload.favourite || []
      };

    case "MERGE_DATA": {
      const serverCart = payload.cart || [];
      const serverFav = payload.favourite || [];

      // Merge Cart: Combine Guest items with Server items. If same ID, sum qty.
      const mergedCart = [...state.cart];
      serverCart.forEach(serverItem => {
        const existingItemIndex = mergedCart.findIndex(item => item._id === serverItem._id);
        if (existingItemIndex > -1) {
          mergedCart[existingItemIndex].qty = (mergedCart[existingItemIndex].qty || 1) + (serverItem.qty || 1);
        } else {
          mergedCart.push(serverItem);
        }
      });

      // Merge Favorites: Unique IDs
      const mergedFav = [...state.favourite];
      serverFav.forEach(serverItem => {
        if (!mergedFav.find(item => item._id === serverItem._id)) {
          mergedFav.push(serverItem);
        }
      });

      return {
        ...state,
        cart: mergedCart,
        favourite: mergedFav
      };
    }

    case "ADD_TO_CART":
      return {
        ...state,
        cart: [...state.cart, { ...payload, qty: 1 }],
      };

    case "REMOVE_FROM_CART":
      return {
        ...state,
        cart: state.cart.filter(item => item._id !== payload),
      };

    case "ADD_TO_FAVORITE":
      return {
        ...state,
        favourite: [...state.favourite, payload],
      };

    case "REMOVE_FROM_FAVORITE":
      return {
        ...state,
        favourite: state.favourite.filter(item => item._id !== payload),
      };

    case "INCREMENT_QTY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item._id === payload
            ? { ...item, qty: item.qty + 1 }
            : item
        ),
      };

    case "DECREMENT_QTY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item._id === payload && item.qty > 1
            ? { ...item, qty: item.qty - 1 }
            : item
        ),
      };

    default:
      return state;
  }
};
