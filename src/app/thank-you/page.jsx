"use client";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex items-center justify-center  bg-[#b4a6811a] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className=" w-full bg-[#f5f5dc] rounded-2xl shadow-2xl border border-[rgb(110,97,70)]/20 text-center max-w-2xl  p-8"
      >
        <div className="flex justify-center mb-6">
          <div className="bg-[rgb(110,97,70)]/10 p-4 rounded-full">
            <CheckCircle className="h-14 w-14 text-[rgb(110,97,70)]" />
          </div>
        </div>
        <h1 className="text-3xl font-semibold text-[rgb(110,97,70)] mb-3">
          {" "}
          Thank You for Your Time
        </h1>
        <p className="mt-8 text-xs text-[rgb(110,97,70)]/60">
          {" "}
          We look forward to hosting you amidst nature 🌿
        </p>
      </motion.div>
    </div>
  );
}
