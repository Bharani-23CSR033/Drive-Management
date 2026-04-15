// src/components/landing/TestimonialsSection.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Arjun Sharma',
    role: 'Placed at Google',
    college: 'VIT Chennai',
    text: 'PlaceDrive made the entire placement process so smooth. I could track all my applications in one place and never missed a deadline.',
    avatar: 'A',
    color: 'bg-[#004643]',
  },
  {
    name: 'Priya Menon',
    role: 'Placed at Amazon',
    college: 'PSG Tech',
    text: 'The dashboard is incredibly intuitive. I got notified the moment I was shortlisted and the calendar view helped me prep for interviews on time.',
    avatar: 'P',
    color: 'bg-[#0F766E]',
  },
  {
    name: 'Rahul Nair',
    role: 'Placed at Zoho',
    college: 'Kongu Engineering',
    text: "As someone who applied to 15+ companies, PlaceDrive's status tracking saved me from the chaos of managing everything manually.",
    avatar: 'R',
    color: 'bg-blue-500',
  },
  {
    name: 'Sneha Reddy',
    role: 'Placed at TCS',
    college: 'SRM University',
    text: 'The admin team at our college loved how easy it was to coordinate drives. Everything from scheduling to attendance was managed perfectly.',
    avatar: 'S',
    color: 'bg-amber-500',
  },
];

const TestimonialsSection = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + testimonials.length) % testimonials.length);
  const next = () => setCurrent((c) => (c + 1) % testimonials.length);

  const testimonial = testimonials[current];

  return (
    <section className="py-24 bg-white dark:bg-[#143C3A] border-t border-[#E5E7EB] dark:border-[#1F4D4A]">
      <div className="max-w-4xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004643]/10 dark:bg-[#004643]/30 text-[#004643] dark:text-[#E6F4F1] text-xs font-medium">
            Student Stories
          </span>
          <h2 className="text-4xl font-bold text-[#111827] dark:text-[#E6F4F1] tracking-tight">
            What students say
          </h2>
        </motion.div>

        {/* Testimonial Card */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-2xl border border-[#E5E7EB] dark:border-[#1F4D4A] p-8 md:p-12 space-y-6"
            >
              <Quote size={32} className="text-[#004643]/30 dark:text-[#0F766E]/40" />

              <p className="text-lg md:text-xl text-[#111827] dark:text-[#E6F4F1] leading-relaxed font-medium">
                "{testimonial.text}"
              </p>

              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 ${testimonial.color} rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {testimonial.avatar}
                </div>
                <div>
                  <p className="font-semibold text-[#111827] dark:text-[#E6F4F1]">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/60">
                    {testimonial.role} · {testimonial.college}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-between mt-8">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-8 bg-[#004643]'
                      : 'w-3 bg-[#E5E7EB] dark:bg-[#1F4D4A]'
                  }`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={prev}
                className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] flex items-center justify-center text-[#6B7280] hover:text-[#004643] hover:border-[#004643] dark:hover:text-[#E6F4F1] dark:hover:border-[#0F766E] transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={next}
                className="w-9 h-9 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] flex items-center justify-center text-[#6B7280] hover:text-[#004643] hover:border-[#004643] dark:hover:text-[#E6F4F1] dark:hover:border-[#0F766E] transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;