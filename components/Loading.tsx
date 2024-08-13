import React from "react";
import { motion } from "framer-motion";
import { Loader } from "lucide-react";

interface LoadingProps {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }} // 设置旋转的角度
      transition={{
        repeat: Infinity, // 无限循环
        duration: 2, // 每次旋转的时间，单位是秒
        ease: "linear", // 使用线性动画，保证匀速旋转
      }}
      className={className}
    >
      <Loader className="w-full h-full" />
    </motion.div>
  );
};

export default Loading;
