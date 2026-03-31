import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/auth.context";

export const useReviewChecker = () => {
  const { user, isAuthenticated } = useAuth();
  const [pendingReviewOrder, setPendingReviewOrder] = useState(null);

  useEffect(() => {
    const checkOrders = async () => {
      if (isAuthenticated && user?._id) {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/orders/${user._id}`);
          const orders = response.data;
          
          // Find the first order that is "Delivered" but not "Reviewed"
          const unreviewedOrder = orders.find(o => o.status === "Delivered" && !o.isReviewed);
          
          if (unreviewedOrder) {
            setPendingReviewOrder(unreviewedOrder);
          } else {
            setPendingReviewOrder(null);
          }
        } catch (error) {
          console.error("Failed to check for unreviewed orders", error);
        }
      }
    };

    checkOrders();
    // Check every 30 seconds if orders are delivered
    const interval = setInterval(checkOrders, 30000);
    return () => clearInterval(interval);
  }, [user?._id, isAuthenticated]);

  return { pendingReviewOrder, setPendingReviewOrder };
};
