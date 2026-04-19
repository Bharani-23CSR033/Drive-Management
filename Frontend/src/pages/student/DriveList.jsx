// src/pages/student/DriveList.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, SlidersHorizontal, MapPin, Clock,
  ArrowUpRight, X, ChevronDown, BriefcaseBusiness,
} from 'lucide-react';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const allDrives = [
  { id: 1, company: 'Google', abbr: 'G', role: 'Software Engineer Intern', salary: '8 LPA', location: 'Bangalore', deadline: 'Apr 20', daysLeft: 2, type: 'Internship', skills: ['React', 'Node.js', 'Python'], cgpa: 7.5, color: 'bg-blue-500', eligible: true },
  { id: 2, company: 'Amazon', abbr: 'A', role: 'Backend Developer', salary: '12 LPA', location: 'Hyderabad', deadline: 'Apr 22', daysLeft: 4, type: 'Full Time', skills: ['Java', 'AWS', 'SQL'], cgpa: 7.0, color: 'bg-amber-500', eligible: true },
  { id: 3, company: 'Microsoft', abbr: 'MS', role: 'SDE Intern', salary: '9 LPA', location: 'Noida', deadline: 'Apr 25', daysLeft: 7, type: 'Internship', skills: ['C++', 'Azure', 'DSA'], cgpa: 8.0, color: 'bg-blue-700', eligible: true },
  { id: 4, company: 'Zoho', abbr: 'Z', role: 'Full Stack Developer', salary: '6 LPA', location: 'Chennai', deadline: 'Apr 28', daysLeft: 10, type: 'Full Time', skills: ['React', 'Java', 'MySQL'], cgpa: 6.5, color: 'bg-red-500', eligible: true },
  { id: 5, company: 'Swiggy', abbr: 'SW', role: 'Backend Engineer', salary: '14 LPA', location: 'Bangalore', deadline: 'May 1', daysLeft: 13, type: 'Full Time', skills: ['Go', 'Kafka', 'Redis'], cgpa: 7.5, color: 'bg-orange-500', eligible: false },
  { id: 6, company: 'CRED', abbr: 'CR', role: 'Frontend Developer', salary: '10 LPA', location: 'Bangalore', deadline: 'May 3', daysLeft: 15, type: 'Full Time', skills: ['React', 'TypeScript', 'CSS'], cgpa: 7.0, color: 'bg-purple-500', eligible: true },
  { id: 7, company: 'Razorpay', abbr: 'RP', role: 'Full Stack Dev', salary: '15 LPA', location: 'Bangalore', deadline: 'May 5', daysLeft: 17, type: 'Full Time', skills: ['React', 'Node.js', 'PostgreSQL'], cgpa: 7.5, color: 'bg-blue-600', eligible: true },
  { id: 8, company: 'Infosys', abbr: 'IN', role: 'Systems Engineer', salary: '4.5 LPA', location: 'Pune', deadline: 'May 8', daysLeft: 20, type: 'Full Time', skills: ['Java', 'SQL', 'Spring'], cgpa: 6.0, color: 'bg-teal-600', eligible: true },
];

const locations = ['All Locations', 'Bangalore', 'Hyderabad', 'Chennai', 'Noida', 'Pune'];
const types = ['All Types', 'Full Time', 'Internship'];
const salaryRanges = ['All Salaries', 'Under 6 LPA', '6-10 LPA', '10-15 LPA', '15+ LPA'];

const DriveList = () => {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All Locations');
  const [type, setType] = useState('All Types');
  const [salary, setSalary] = useState('All Salaries');
  const [showFilters, setShowFilters] = useState(false);
  const [activeChips, setActiveChips] = useState([]);

  const toggleChip = (chip) => {
    setActiveChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  };

  const clearFilters = () => {
    setSearch('');
    setLocation('All Locations');
    setType('All Types');
    setSalary('All Salaries');
    setActiveChips([]);
  };

  const filtered = allDrives.filter((d) => {
    const matchSearch =
      d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.role.toLowerCase().includes(search.toLowerCase());
    const matchLocation = location === 'All Locations' || d.location === location;
    const matchType = type === 'All Types' || d.type === type;
    const matchChips = activeChips.length === 0 || activeChips.some((c) => d.skills.includes(c));
    const matchSalary = (() => {
      const val = parseFloat(d.salary);
      if (salary === 'All Salaries') return true;
      if (salary === 'Under 6 LPA') return val < 6;
      if (salary === '6-10 LPA') return val >= 6 && val <= 10;
      if (salary === '10-15 LPA') return val > 10 && val <= 15;
      if (salary === '15+ LPA') return val > 15;
      return true;
    })();
    return matchSearch && matchLocation && matchType && matchChips && matchSalary;
  });

  const allSkills = [...new Set(allDrives.flatMap((d) => d.skills))];
  const hasFilters = search || location !== 'All Locations' || type !== 'All Types' || salary !== 'All Salaries' || activeChips.length > 0;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Placement Drives</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            {filtered.length} drives available — apply before deadlines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#6B7280] bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] px-3 py-1.5 rounded-lg">
            {allDrives.filter((d) => d.eligible).length} eligible for you
          </span>
        </div>
      </motion.div>

      {/* Search + Filter Bar */}
      <motion.div variants={itemVariants} className="space-y-3">
        <div className="flex gap-3">
          {/* Search */}
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-2.5 focus-within:border-[#004643] focus-within:ring-2 focus-within:ring-[#004643]/15 transition-all">
            <Search size={15} className="text-[#6B7280] flex-shrink-0" />
            <input
              type="text"
              placeholder="Search companies or roles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1]">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              showFilters
                ? 'bg-[#004643] text-white border-[#004643]'
                : 'bg-white dark:bg-[#143C3A] border-[#E5E7EB] dark:border-[#1F4D4A] text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643]'
            }`}
          >
            <SlidersHorizontal size={14} />
            Filters
            {hasFilters && (
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            )}
          </button>

          {hasFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm text-[#6B7280] hover:text-red-500 hover:border-red-300 transition-all bg-white dark:bg-[#143C3A]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {[
                  { label: 'Location', value: location, setter: setLocation, options: locations },
                  { label: 'Job Type', value: type, setter: setType, options: types },
                  { label: 'Salary', value: salary, setter: setSalary, options: salaryRanges },
                ].map((filter) => (
                  <div key={filter.label} className="relative">
                    <select
                      value={filter.value}
                      onChange={(e) => filter.setter(e.target.value)}
                      className="w-full appearance-none bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-2.5 text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all cursor-pointer pr-8"
                    >
                      {filter.options.map((o) => (
                        <option key={o} value={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skill Chips */}
        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill) => (
            <button
              key={skill}
              onClick={() => toggleChip(skill)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                activeChips.includes(skill)
                  ? 'bg-[#004643] text-white border-[#004643]'
                  : 'bg-white dark:bg-[#143C3A] text-[#6B7280] border-[#E5E7EB] dark:border-[#1F4D4A] hover:border-[#004643] hover:text-[#004643] dark:hover:text-[#E6F4F1]'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Drive Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-16 h-16 bg-[#004643]/10 dark:bg-[#004643]/20 rounded-2xl flex items-center justify-center mb-4">
                <BriefcaseBusiness size={28} className="text-[#004643]" />
              </div>
              <p className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">No drives found</p>
              <p className="text-sm text-[#6B7280] mt-1">Try adjusting your filters</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-4 py-2 bg-[#004643] text-white rounded-xl text-sm font-medium hover:bg-[#036b64] transition-all"
              >
                Clear filters
              </button>
            </motion.div>
          ) : (
            filtered.map((drive) => (
              <motion.div
                key={drive.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,70,67,0.1)' }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-4 group"
              >
                {/* Card Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 ${drive.color} rounded-xl flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}>
                      {drive.abbr}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
                      <p className="text-xs text-[#6B7280]">{drive.role}</p>
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    drive.type === 'Internship'
                      ? 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400'
                      : 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                  }`}>
                    {drive.type}
                  </span>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} />
                    {drive.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    <span className={drive.daysLeft <= 3 ? 'text-red-500 font-semibold' : ''}>
                      {drive.daysLeft}d left
                    </span>
                  </span>
                  <span className="text-[#004643] dark:text-[#0F766E] font-bold">
                    {drive.salary}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {drive.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-0.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-md text-xs text-[#6B7280]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] dark:border-[#1F4D4A]">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${drive.eligible ? 'bg-emerald-500' : 'bg-red-400'}`} />
                    <span className={`text-xs font-medium ${drive.eligible ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'}`}>
                      {drive.eligible ? 'Eligible' : 'Not eligible'}
                    </span>
                    <span className="text-xs text-[#6B7280]">· CGPA {drive.cgpa}+</span>
                  </div>

                  <Link
                    to={`/student/drives/${drive.id}`}
                    className="flex items-center gap-1 text-xs font-semibold text-[#004643] dark:text-[#0F766E] hover:underline group-hover:gap-2 transition-all"
                  >
                    View Details
                    <ArrowUpRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default DriveList;