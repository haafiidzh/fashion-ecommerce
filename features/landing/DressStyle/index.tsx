import { cn } from "@/lib/utils";
import { integralCF } from "@/styles/fonts";
import React from "react";
import * as motion from "framer-motion/client";
import DressStyleCard from "./DressStyleCard";

const DressStyle = () => {
  const items = [
    {
      title: "Casual",
      url: "/shop#casual",
      image: "/images/dress-style-1.png",
      className: "md:col-span-1",
    },
    {
      title: "Formal",
      url: "/shop#formal",
      image: "/images/dress-style-2.png",
      className: "md:col-span-2",
    },
    {
      title: "Party",
      url: "/shop#party",
      image: "/images/dress-style-3.png",
      className: "md:col-span-2",
    },
    {
      title: "Gym",
      url: "/shop#gym",
      image: "/images/dress-style-4.png",
      className: "md:col-span-1",
    },
  ];

  return (
      <div className="px-4 xl:px-0">
        <section className="max-w-frame mx-auto bg-[#F0F0F0] px-6 pb-6 pt-10 md:p-[70px] rounded-[40px] text-center">
          <motion.h2
              initial={{ y: "100px", opacity: 0 }}
              whileInView={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className={cn([
                integralCF.className,
                "text-[32px] leading-[36px] md:text-5xl mb-8 md:mb-14 capitalize",
              ])}
          >
            BROWSE BY dress STYLE
          </motion.h2>

          {/* Bento Grid */}
          <motion.div
              initial={{ y: "100px", opacity: 0 }}
              whileInView={{ y: "0", opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 md:auto-rows-[289px]"
          >
            {items.map((item, i) => (
                <DressStyleCard
                    key={i}
                    title={item.title}
                    url={item.url}
                    image={item.image}
                    className={item.className}
                />
            ))}
          </motion.div>
        </section>
      </div>
  );
};

export default DressStyle;