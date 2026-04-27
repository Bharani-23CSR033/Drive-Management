// src/pages/shared/Calendar.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, X,
  Clock, MapPin, Users, BriefcaseBusiness,
} from 'lucide-react';
import Modal from '../../components/common/Modal';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const events = [
  { id: 1, day: 18, month: 3, title: 'Google — OA Round', type: 'assessment', company: 'Google', time: '10:00 AM', location: 'Online', color: 'bg-blue-500' },
  { id: 2, day: 20, month: 3, title: 'Amazon Drive Deadline', type: 'deadline', company: 'Amazon', time: '11:59 PM', location: '-', color: 'bg-red-500' },
  { id: 3, day: 22, month: 3, title: 'Microsoft — Technical Round', type: 'interview', company: 'Microsoft', time: '2:00 PM', location: 'Zoom', color: 'bg-blue-700' },
  { id: 4, day: 25, month: 3, title: 'Zoho Drive Opens', type: 'drive', company: 'Zoho', time: '9:00 AM', location: 'Campus', color: 'bg-red-600' },
  { id: 5, day: 27, month: 3, title: 'CRED — HR Round', type: 'interview', company: 'CRED', time: '3:00 PM', location: 'Google Meet', color: 'bg-purple-500' },
  { id: 6, day: 28, month: 3, title: 'Razorpay Drive Deadline', type: 'deadline', company: 'Razorpay', time: '11:59 PM', location: '-', color: 'bg-blue-600' },
  { id: 7, day: 5, month: 4, title: 'Swiggy — Online Assessment', type: 'assessment', company: 'Swiggy', time: '11:00 AM', location: 'Online', color: 'bg-orange-500' },
];

const typeConfig = {
  assessment: { label: 'Assessment', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  deadline: { label: 'Deadline', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
  interview: { label: 'Interview', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  drive: { label: 'Drive', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const prevMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(y => y - 1); }
    else setCurrentMonth(m => m - 1);
  };

  const nextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(y => y + 1); }
    else setCurrentMonth(m => m + 1);
  };

  const getEventsForDay = (day) => events.filter((e) =>
    e.day === day && e.month === currentMonth
  );

  const upcomingEvents = events
    .filter((e) => {
      const eDate = new Date(currentYear, e.month, e.day);
      return eDate >= today;
    })
    .sort((a, b) => {
      const dateA = new Date(currentYear, a.month, a.day);
      const dateB = new Date(currentYear, b.month, b.day);
      return dateA - dateB;
    })
    .slice(0, 5);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >

      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Calendar</h1>
        <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
          Track drive deadlines, interviews, and assessments
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Calendar Grid */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">

          {/* Month Nav */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
            <button
              onClick={prevMonth}
              className="p-2 rounded-xl text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
            >
              <ChevronLeft size={16} />
            </button>
            <p className="text-base font-bold text-[#111827] dark:text-[#E6F4F1]">
              {MONTHS[currentMonth]} {currentYear}
            </p>
            <button
              onClick={nextMonth}
              className="p-2 rounded-xl text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
            {DAYS.map((day) => (
              <div key={day} className="py-3 text-center">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide">{day}</p>
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDay }).map((_, i) => (
              <div key={`empty-${i}`} className="h-20 border-b border-r border-[#E5E7EB] dark:border-[#1F4D4A]" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
              const isSelected = selectedDay === day;

              return (
                <motion.div
                  key={day}
                  whileHover={{ backgroundColor: 'rgba(0,70,67,0.04)' }}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`h-20 border-b border-r border-[#E5E7EB] dark:border-[#1F4D4A] p-1.5 cursor-pointer transition-colors ${
                    isSelected ? 'bg-[#004643]/5 dark:bg-[#004643]/15' : ''
                  }`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-xs font-bold mb-1 ${
                    isToday
                      ? 'bg-[#004643] text-white'
                      : 'text-[#111827] dark:text-[#E6F4F1]'
                  }`}>
                    {day}
                  </div>
                  <div className="space-y-0.5">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                        className={`${event.color} text-white text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        {event.title.split('—')[0].trim()}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <p className="text-xs text-[#6B7280] pl-1">+{dayEvents.length - 2} more</p>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div variants={itemVariants} className="space-y-4">

          {/* Legend */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Event Types</p>
            {Object.entries(typeConfig).map(([type, config]) => (
              <div key={type} className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
                  {config.label}
                </span>
              </div>
            ))}
          </div>

          {/* Upcoming Events */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-4">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Upcoming Events</p>

            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-[#6B7280] text-center py-4">No upcoming events</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => (
                  <motion.div
                    key={event.id}
                    whileHover={{ x: 2 }}
                    onClick={() => setSelectedEvent(event)}
                    className="flex items-start gap-3 cursor-pointer group"
                  >
                    <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${event.color}`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#111827] dark:text-[#E6F4F1] group-hover:text-[#004643] dark:group-hover:text-[#0F766E] transition-colors truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-[#6B7280] mt-0.5">
                        {MONTHS[event.month].slice(0, 3)} {event.day} · {event.time}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${typeConfig[event.type]?.color}`}>
                      {typeConfig[event.type]?.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
        size="sm"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className={`${selectedEvent.color} rounded-xl p-4 text-white`}>
              <p className="text-white/70 text-xs">{selectedEvent.company}</p>
              <p className="text-lg font-bold mt-0.5">{selectedEvent.title}</p>
              <span className="inline-block mt-2 text-xs bg-white/20 px-2.5 py-0.5 rounded-full capitalize">
                {selectedEvent.type}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { icon: Clock, label: 'Time', value: selectedEvent.time },
                { icon: MapPin, label: 'Location', value: selectedEvent.location },
                { icon: BriefcaseBusiness, label: 'Company', value: selectedEvent.company },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                    <Icon size={14} className="text-[#6B7280] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B7280]">{item.label}</p>
                      <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setSelectedEvent(null)}
              className="w-full py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
            >
              Close
            </button>
          </div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Calendar;