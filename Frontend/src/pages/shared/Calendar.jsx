// src/pages/shared/Calendar.jsx

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, X,
  Clock, MapPin, Users, BriefcaseBusiness,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import driveApi from '../../api/driveApi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const typeConfig = {
  assessment: { label: 'Assessment', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400' },
  deadline: { label: 'Deadline', color: 'bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-400' },
  interview: { label: 'Interview', color: 'bg-purple-50 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400' },
  drive: { label: 'Drive', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' },
};

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const getEventColor = (status) => {
  const colorMap = {
    'Open': 'bg-blue-500',
    'Active': 'bg-emerald-500',
    'Closed': 'bg-red-500',
    'draft': 'bg-gray-500',
  };
  return colorMap[status] || 'bg-blue-500';
};

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  useEffect(() => {
    const fetchCalendarEvents = async () => {
      try {
        setLoading(true);
        const data = await driveApi.getCalendarEvents();
        setEvents(data.events || []);
        setError(null);
      } catch (err) {
        setError('Failed to load calendar events');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarEvents();
  }, []);

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

  const getEventsForDay = (day) => {
    if (loading) return [];
    return events.filter((e) => {
      const eventDate = new Date(e.date);
      return eventDate.getDate() === day && eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear;
    });
  };

  const upcomingEvents = events
    .filter((e) => {
      const eDate = new Date(e.date);
      return eDate >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004643]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

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
                        className={`${getEventColor(event.status)} text-white text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-90 transition-opacity`}
                      >
                        {event.title.split('—')[0].trim().substring(0, 12)}
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
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Upcoming Drives</p>

            {upcomingEvents.length === 0 ? (
              <p className="text-xs text-[#6B7280] text-center py-4">No upcoming drives</p>
            ) : (
              <div className="space-y-3">
                {upcomingEvents.map((event) => {
                  const eventDate = new Date(event.date);
                  return (
                    <motion.div
                      key={event.id}
                      whileHover={{ x: 2 }}
                      onClick={() => setSelectedEvent(event)}
                      className="flex items-start gap-3 cursor-pointer group"
                    >
                      <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${getEventColor(event.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#111827] dark:text-[#E6F4F1] group-hover:text-[#004643] dark:group-hover:text-[#0F766E] transition-colors truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-[#6B7280] mt-0.5">
                          {MONTHS[eventDate.getMonth()].slice(0, 3)} {eventDate.getDate()} {eventDate.getFullYear()}
                        </p>
                      </div>
                      <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0 bg-[#004643]/10 text-[#004643] dark:text-[#0F766E]">
                        {event.status}
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Event Detail Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="Drive Details"
        size="sm"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div className={`${getEventColor(selectedEvent.status)} rounded-xl p-4 text-white`}>
              <p className="text-white/70 text-xs">Drive Deadline</p>
              <p className="text-lg font-bold mt-0.5">{selectedEvent.title}</p>
              <span className="inline-block mt-2 text-xs bg-white/20 px-2.5 py-0.5 rounded-full capitalize">
                {selectedEvent.status}
              </span>
            </div>

            <div className="space-y-3">
              {[
                { icon: Clock, label: 'Deadline', value: new Date(selectedEvent.date).toLocaleDateString() },
                { icon: MapPin, label: 'Location', value: selectedEvent.location || 'N/A' },
                { icon: BriefcaseBusiness, label: 'Status', value: selectedEvent.status },
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