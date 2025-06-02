import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import landingImgAvif from '../assets/landing.avif'

const Landing = () => {
  return (
    <div className="relative w-full h-[70vh] overflow-hidden" id="landing">
      <picture>
        <source srcSet={landingImgAvif} type="image/avif" />
        <img
          src="assets/landing.webp"
          alt="Landing"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover z-0"
        />
      </picture>

      <div className="absolute inset-0 bg-black/40 z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-1/2 left-1/2 z-20 transform -translate-x-1/2 -translate-y-1/2 text-white text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold mb-2">
          أهلاً بك في التميز العقاري
        </h1>
        <p className="text-lg md:text-xl">
          استكشف أفضل العقارات للبيع والإيجار بسهولة
        </p>
      </motion.div>

      <a
        href="#filter"
        className="absolute bottom-15 left-1/2 transform -translate-x-1/2 z-20 animate-bounce text-white"
      >
        <ChevronDown size={32} />
      </a>
    </div>
  );
};

export default Landing;
