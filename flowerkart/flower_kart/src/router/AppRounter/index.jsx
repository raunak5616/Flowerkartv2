import { Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../../components/navbar";
import Home from "../../pages/home";
import { Cart } from "../../pages/cart";
import Contact from "../../pages/contact";
import Shop from "../../pages/shop";
import Support from "../../pages/support";
import Product from "../../pages/product";
import Login from "../../pages/login";
import Signup from "../../pages/signup";
import Profile from "../../pages/profile";
import Footer from "../../components/footer";
import { ShopByProduct } from "../../pages/shopByProduct";
import Favorite from "../../pages/fav";
import { useReviewChecker } from "../../hooks/useReviewChecker";
import ReviewModal from "../../components/ReviewModal";

const AppRouter = () => {
  const { pendingReviewOrder, setPendingReviewOrder } = useReviewChecker();
  const location = useLocation();

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const Page = ({ children }) => (
    <motion.div
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="min-h-svh w-full flex flex-col"
    >
        {children}
    </motion.div>
  );

  return (
    <>
      {pendingReviewOrder && (
        <ReviewModal 
          isOpen={true} 
          order={pendingReviewOrder} 
          onClose={() => setPendingReviewOrder(null)} 
        />
      )}
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Home /></Page>} />
          <Route path="/cart" element={<Page><Cart /></Page>} />
          <Route path="/shop" element={<Page><Shop /></Page>} />
          <Route path="/Support" element={<Page><Support /></Page>} />
          <Route path="/Products" element={<Page><Product /></Page>} />
          <Route path="/login" element={<Page><Login /></Page>} />
          <Route path="/signup" element={<Page><Signup /></Page>} />
          <Route path="/profile" element={<Page><Profile /></Page>} />
          <Route path="/contact" element={<Page><Contact /></Page>} />
          <Route path="/shop/:id" element={<Page><ShopByProduct /></Page>} />
          <Route path="favorite" element={<Page><Favorite /></Page>} />
        </Routes>
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default AppRouter;
