"use client";

import type { AnimatedProps } from "@/types/framer-motion";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
  company: string;
  image: string;
}

const testimonials: TestimonialProps[] = [
  {
    content:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.",
    author: "Sarah Chen",
    role: "CEO",
    company: "TechVision Inc",
    image: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
  {
    content:
      "Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris. Fusce nec tellus sed augue semper porta.",
    author: "Michael Rodriguez",
    role: "Founder",
    company: "InnovateLab",
    image: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
  {
    content:
      "Mauris massa. Vestibulum lacinia arcu eget nulla. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.",
    author: "Emily Davis",
    role: "CTO",
    company: "CodeCrafters",
    image: "https://avatars.githubusercontent.com/u/124599?v=4",
  },
];

export function Testimonials({ id }: AnimatedProps) {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div id={id} className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-cyan-100 dark:bg-cyan-800/30 mx-auto mb-4">
            <Star className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
          </div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
            Success{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-pink-600 dark:from-cyan-600 dark:to-cyan-700">
              Stories
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Don&apos;t just take my word for it - hear from the clients
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function TestimonialCard({
  content,
  author,
  role,
  company,
  image,
}: TestimonialProps) {
  return (
    <motion.div
      className="group relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-xl bg-gradient-to-r from-cyan-500/20 via-slate-500/20 to-cyan-500/20 opacity-50 blur-xl transition-all duration-500 group-hover:opacity-100 dark:from-cyan-200/20 dark:via-slate-200/20 dark:to-cyan-200/20 sm:block"></div>
      <div className="relative z-10 flex flex-col h-full p-8 rounded-2xl bg-slate-50 dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-slate-200 dark:border-slate-700 hover:scale-[1.02]">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-16 h-16 overflow-hidden rounded-full ring-2 ring-slate-100 dark:ring-slate-700">
            <Image
              src={image}
              alt={author}
              className="object-cover"
              width={64}
              height={64}
            />
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {author}
            </p>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {role} at {company}
            </p>
          </div>
        </div>
        <Quote className="w-8 h-8 mb-4 text-slate-400 dark:text-slate-500" />
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed flex-grow">
          {content}
        </p>
      </div>
    </motion.div>
  );
}
