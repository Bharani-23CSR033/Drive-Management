// src/components/landing/FeaturesSection.jsx

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness, Users, Building2,
  Bell, BarChart3, Shield,
} from 'lucide-react';

const features = [
  {
    icon: BriefcaseBusiness,
    title: 'Drive Management',
    description: 'Create, manage, and track placement drives with deadlines, eligibility filters, and real-time updates.',
    color: 'bg-[#004643]',
  },
  {
    icon: Users,
    title: 'Student Portal',
    description: 'Students can browse drives, apply instantly, track application status, and manage their profiles.',
    color: 'bg-[#0F766E]',
  },
  {
    icon: Building2,
    title: 'Company Access',
    description: 'Companies post job drives, review applicants, and select candidates — all from one dashboard.',
    color: 'bg-blue-500',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Real-time alerts for application updates, shortlisting, interview schedules, and deadlines.',
    color: 'bg-amber-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    description: 'Admins get placement statistics, attendance tracking, and exportable PDF/Excel reports.',
    color: 'bg-purple-500',
  },
  {
    icon: Shield,
    title: 'Secure & Role-Based',
    description: 'JWT authentication with strict role-based access for students, admins, and companies.',
    color: 'bg-rose-500',
  },
];

const FeaturesSection = forwardRef((_, ref) => {
  return (
    <section
      ref={ref}
      className="py-24 bg-white dark:bg-[#143C3A] border-t border-[#E5E7EB] dark:border-[#1F4D4A]"
    >
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
            Everything You Need
          </span>
          <h2 className="text-4xl font-bold text-[#111827] dark:text-[#E6F4F1] tracking-tight">
            Built for every stakeholder
          </h2>
          <p className="text-[#6B7280] dark:text-[#E6F4F1]/60 text-base leading-relaxed">
            Whether you're a student hunting for your first job, an admin coordinating drives, or a company looking for talent — PlaceDrive has you covered.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                whileHover={{ y: -6, boxShadow: '0 16px 40px rgba(0,70,67,0.12)' }}
                className="group bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-2xl p-6 border border-[#E5E7EB] dark:border-[#1F4D4A] transition-all duration-300 cursor-default"
              >
                <div className={`w-11 h-11 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon size={20} className="text-white" />
                </div>
                <h3 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1] mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/60 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
});

FeaturesSection.displayName = 'FeaturesSection';
export default FeaturesSection;