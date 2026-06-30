import React from 'react'
import { motion } from "framer-motion";
import Link from 'next/link';

export default function CardRouteHome({
    route = {},
    idx = 0,
    Icon
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: idx * 0.06 + 0.25 }}
      whileHover={{ y: -4, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.97 }}
    >
      <Link href={route.path}>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:border-[#FF821E]/30 hover:shadow-md transition-all group h-full">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
            style={{ backgroundColor: `${route.color}18` }}
          >
            <Icon style={{ fontSize: 22, color: route.color }} />
          </div>
          <p className="font-semibold text-[#1F4363] text-sm group-hover:text-[#FF821E] transition-colors">
            {route.name}
          </p>
          <p className="text-gray-400 text-xs mt-0.5 leading-snug">
            {route.desc}
          </p>
        </div>
      </Link>
    </motion.div>
  );
}
