// src/components/landing/HowItWorks.jsx

import { motion } from 'framer-motion';
import { UserPlus, Search, Send, Trophy } from 'lucide-react';

const steps = [
  {
    icon: UserPlus,
    step: '01',
    title: 'Register',
    description: 'Create your account as a student, admin, or company in under 2 minutes.',
    color: 'bg-[#004643]',
  },
  {
    icon: Search,
    step: '02',
    title: 'Explore Drives',
    description: 'Browse placement drives filtered by your eligibility, skills, and preferences.',
    color: 'bg-[#0F766E]',
  },
  {
    icon: Send,
    step: '03',
    title: 'Apply',
    description: 'Apply to drives with one click. Track your application status in real time.',
    color: 'bg-blue-500',
  },
  {
    icon: Trophy,
    step: '04',
    title: 'Get Placed',
    description: 'Receive offers, confirm selections, and celebrate your placement.',
    color: 'bg-amber-500',
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 bg-[#FAFAFA] dark:bg-[#0F2F2C]">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16 space-y-4"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#004643]/10 dark:bg-[#004643]/30 text-[#004643] dark:text-[#E6F4F1] text-xs font-medium">
            Simple Process
          </span>
          <h2 className="text-4xl font-bold text-[#111827] dark:text-[#E6F4F1] tracking-tight">
            How it works
          </h2>
          <p className="text-[#6B7280] dark:text-[#E6F4F1]/60 text-base leading-relaxed">
            From registration to placement — the entire process is streamlined into four simple steps.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">

          {/* Connector Line */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#004643]/30 to-transparent" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.12 }}
                  className="relative flex flex-col items-center text-center space-y-4"
                >
                  {/* Step Number */}
                  <div className="relative">
                    <div className={`w-14 h-14 ${step.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                      <Icon size={24} className="text-white" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-full text-[10px] font-bold text-[#004643] dark:text-[#E6F4F1] flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/60 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;