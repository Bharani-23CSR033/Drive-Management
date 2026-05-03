// src/pages/student/Feedback.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Send, CheckCircle, MessageSquare,
} from 'lucide-react';
import toast from 'react-hot-toast';
import feedbackApi from '../../api/feedbackApi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const drives = [
  { id: 1, company: 'Google', role: 'Software Engineer Intern', date: 'Apr 15', abbr: 'G', color: 'bg-blue-500' },
  { id: 2, company: 'Amazon', role: 'Backend Developer', date: 'Apr 14', abbr: 'A', color: 'bg-amber-500' },
  { id: 3, company: 'Zoho', role: 'Full Stack Developer', date: 'Apr 13', abbr: 'Z', color: 'bg-red-500' },
];

const categories = ['Overall Experience', 'Interview Process', 'Company Culture', 'Communication'];

const StarRating = ({ value, onChange, size = 20 }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <motion.button
        key={star}
        type="button"
        whileHover={{ scale: 1.2 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onChange(star)}
        className="focus:outline-none"
      >
        <Star
          size={size}
          className={star <= value ? 'text-amber-400 fill-amber-400' : 'text-[#E5E7EB] dark:text-[#1F4D4A]'}
        />
      </motion.button>
    ))}
  </div>
);

const Feedback = () => {
  const [selectedDrive, setSelectedDrive] = useState(drives[0]);
  const [ratings, setRatings] = useState({ 'Overall Experience': 0, 'Interview Process': 0, 'Company Culture': 0, 'Communication': 0 });
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const avgRating = Object.values(ratings).reduce((a, b) => a + b, 0) / categories.length;

  const handleSubmit = async () => {
    if (Object.values(ratings).some((r) => r === 0)) {
      toast.error('Please rate all categories');
      return;
    }
    if (!feedback.trim()) {
      toast.error('Please write your feedback');
      return;
    }

    try {
      setLoading(true);
      await feedbackApi.submit({
        driveId: selectedDrive.id,
        rating: Math.round(avgRating),
        text: feedback,
      });
      setSubmitted(true);
      toast.success('Feedback submitted successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 max-w-md"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto"
          >
            <CheckCircle size={48} className="text-emerald-600 dark:text-emerald-400" />
          </motion.div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Feedback Submitted</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Thank you for sharing your experience with{' '}
              <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">{selectedDrive.company}</span>.
              Your feedback helps improve the placement process.
            </p>
          </div>
          <div className="flex items-center justify-center gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={24}
                className={s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-[#E5E7EB]'}
              />
            ))}
            <span className="ml-2 text-sm font-bold text-[#111827] dark:text-[#E6F4F1]">
              {avgRating.toFixed(1)}
            </span>
          </div>
          <button
            onClick={() => { setSubmitted(false); setRatings({ 'Overall Experience': 0, 'Interview Process': 0, 'Company Culture': 0, 'Communication': 0 }); setFeedback(''); }}
            className="px-6 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
          >
            Submit Another
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 max-w-2xl"
    >

      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Interview Feedback</h1>
        <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
          Share your experience to help future students
        </p>
      </motion.div>

      {/* Drive Selector */}
      <motion.div variants={itemVariants} className="space-y-2">
        <p className="text-xs font-medium text-[#6B7280]">Select Drive</p>
        <div className="space-y-2">
          {drives.map((drive) => (
            <button
              key={drive.id}
              onClick={() => setSelectedDrive(drive)}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                selectedDrive.id === drive.id
                  ? 'border-[#004643] bg-[#004643]/5 dark:bg-[#004643]/10'
                  : 'border-[#E5E7EB] dark:border-[#1F4D4A] bg-white dark:bg-[#143C3A] hover:border-[#004643]/50'
              }`}
            >
              <div className={`w-10 h-10 ${drive.color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {drive.abbr}
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
                <p className="text-xs text-[#6B7280]">{drive.role} · {drive.date}</p>
              </div>
              {selectedDrive.id === drive.id && (
                <div className="ml-auto w-5 h-5 bg-[#004643] rounded-full flex items-center justify-center">
                  <CheckCircle size={12} className="text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Ratings */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-5">
        <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Rate Your Experience</p>
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center justify-between gap-4">
              <p className="text-sm text-[#6B7280] flex-shrink-0 w-40">{category}</p>
              <div className="flex items-center gap-3">
                <StarRating
                  value={ratings[category]}
                  onChange={(val) => setRatings((r) => ({ ...r, [category]: val }))}
                />
                {ratings[category] > 0 && (
                  <span className="text-xs font-bold text-amber-500 w-4">{ratings[category]}</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Average */}
        {Object.values(ratings).some((r) => r > 0) && (
          <div className="flex items-center gap-3 pt-3 border-t border-[#E5E7EB] dark:border-[#1F4D4A]">
            <p className="text-xs text-[#6B7280]">Average Rating</p>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={14}
                  className={s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-[#E5E7EB]'}
                />
              ))}
              <span className="text-xs font-bold text-[#111827] dark:text-[#E6F4F1] ml-1">
                {avgRating.toFixed(1)}
              </span>
            </div>
          </div>
        )}
      </motion.div>

      {/* Text Feedback */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-[#6B7280]" />
          <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Detailed Feedback</p>
        </div>
        <textarea
          rows={5}
          placeholder={`Describe your experience with ${selectedDrive.company}. What went well? What could be improved? Any advice for future students?`}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          className="w-full px-4 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all resize-none leading-relaxed"
        />
        <div className="flex justify-between">
          <p className="text-xs text-[#6B7280]">Minimum 50 characters recommended</p>
          <p className={`text-xs font-medium ${feedback.length >= 50 ? 'text-emerald-600' : 'text-[#6B7280]'}`}>
            {feedback.length} chars
          </p>
        </div>
      </motion.div>

      {/* Submit */}
      <motion.div variants={itemVariants}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all shadow-lg shadow-[#004643]/20 disabled:opacity-60"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send size={15} />
              Submit Feedback
            </>
          )}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default Feedback;