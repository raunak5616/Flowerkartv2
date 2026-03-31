import { motion } from "framer-motion";

const ShopCard = ({ shop, onClick }) => {
  const url = shop?.images?.[0]?.url || shop?.images?.url || "/no-image.png";

  return (
    <motion.div 
      onClick={() => onClick(shop._id)}
      whileHover={{ y: -12, scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-white rounded-[2.5rem] p-5 transition-all duration-500 hover:shadow-[0_30px_60px_rgba(0,0,0,0.12)] cursor-pointer border border-gray-100 flex flex-col h-[400px] w-full max-w-[340px] mx-auto overflow-hidden bg-gradient-to-b from-white to-gray-50/50"
    >
      {/* Decorative Background Element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      
      {/* Status Badge */}
      <div className="absolute top-8 left-8 z-20 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm border border-gray-100/50 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Open Now</span>
      </div>

      {/* Image Section */}
      <div className="relative h-48 w-full rounded-[2rem] overflow-hidden mb-6 shadow-inner bg-gray-100/30">
        <motion.img 
          src={url} 
          alt={shop?.shop}
          whileHover={{ scale: 1.15 }}
          transition={{ duration: 0.8 }}
          className="h-full w-full object-cover transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 px-2 relative z-10">
        <div className="mb-4">
          <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.25em] mb-1.5 translate-y-0 group-hover:-translate-y-1 transition-transform">
            Authorized Partner
          </p>
          <h3 className="text-2xl font-black text-gray-900 leading-tight tracking-tight group-hover:text-red-600 transition-colors">
            {shop?.shop || "FlowerKart Partner"}
          </h3>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-gray-400 text-sm">person</span>
          <p className="text-xs text-gray-500 font-bold tracking-wide">
            {shop?.name || "Local Seller"}
          </p>
        </div>

        <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100/50">
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-orange-400 text-xs">star</span>
            <span className="text-xs font-black text-gray-900">
              {shop?.rating > 0 ? shop.rating.toFixed(1) : "New"}
            </span>
            {shop?.numReviews > 0 && (
              <span className="text-[10px] text-gray-400 font-bold ml-1">
                ({shop.numReviews})
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-1 text-red-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
            Visit Store
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopCard;