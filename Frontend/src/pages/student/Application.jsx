// src/pages/student/Application.jsx

import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Upload,
  FileText, AlertCircle, User,
  BriefcaseBusiness, ChevronRight,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';

const steps = ['Review Profile', 'Upload Resume', 'Confirm & Apply'];

const Application = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const drive = {
    company: 'Google',
    abbr: 'G',
    color: 'bg-blue-500',
    role: 'Software Engineer Intern',
    salary: '8 LPA',
    deadline: 'April 20, 2026',
  };

  const profileData = {
    name: user?.name || 'Bhagath K',
    email: user?.email || 'bhagath@example.com',
    cgpa: '8.2',
    college: 'Kongu Engineering College',
    branch: 'Computer Science Engineering',
    year: '4th Year',
    skills: ['React', 'Node.js', 'Python', 'DSA'],
  };

  const handleFileUpload = (file) => {
    if (file && file.type === 'application/pdf') {
      setResumeFile(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    handleFileUpload(file);
  };

  const handleSubmit = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
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
            <h2 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">
              Application Submitted
            </h2>
            <p className="text-[#6B7280] dark:text-[#E6F4F1]/60 text-sm leading-relaxed">
              Your application to <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</span> for{' '}
              <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.role}</span> has been successfully submitted.
            </p>
          </div>

          <div className="bg-[#FAFAFA] dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3 text-left">
            {[
              { label: 'Application ID', value: `APP-${Date.now().toString().slice(-6)}` },
              { label: 'Company', value: drive.company },
              { label: 'Role', value: drive.role },
              { label: 'Status', value: 'Under Review' },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#6B7280]">{item.label}</span>
                <span className={`font-semibold ${item.label === 'Status' ? 'text-amber-600' : 'text-[#111827] dark:text-[#E6F4F1]'}`}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/student/drives')}
              className="flex-1 py-2.5 border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] transition-all"
            >
              Browse More Drives
            </button>
            <button
              onClick={() => navigate('/student/dashboard')}
              className="flex-1 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl space-y-5"
    >
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Drive
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 ${drive.color} rounded-xl flex items-center justify-center text-white font-bold`}>
            {drive.abbr}
          </div>
          <div>
            <p className="text-xs text-[#6B7280]">Applying to</p>
            <p className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">
              {drive.company} — {drive.role}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-[#6B7280]">Deadline</p>
            <p className="text-sm font-semibold text-red-500">{drive.deadline}</p>
          </div>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 right-0 top-4 h-px bg-[#E5E7EB] dark:bg-[#1F4D4A] z-0 mx-8" />
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center gap-2 relative z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i < currentStep
                  ? 'bg-emerald-500 text-white'
                  : i === currentStep
                  ? 'bg-[#004643] text-white ring-4 ring-[#004643]/20'
                  : 'bg-white dark:bg-[#143C3A] border-2 border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280]'
              }`}>
                {i < currentStep ? <CheckCircle size={14} /> : i + 1}
              </div>
              <p className={`text-xs font-medium whitespace-nowrap ${
                i === currentStep
                  ? 'text-[#004643] dark:text-[#E6F4F1]'
                  : 'text-[#6B7280]'
              }`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">

        {/* Step 0 — Review Profile */}
        {currentStep === 0 && (
          <motion.div
            key="step0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-5"
          >
            <div>
              <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Review Your Profile</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Make sure your details are up to date before applying</p>
            </div>

            <div className="flex items-center gap-4 p-4 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
              <div className="w-14 h-14 bg-[#004643] rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                {profileData.name.charAt(0)}
              </div>
              <div>
                <p className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">{profileData.name}</p>
                <p className="text-sm text-[#6B7280]">{profileData.email}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{profileData.college}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Branch', value: profileData.branch },
                { label: 'Year', value: profileData.year },
                { label: 'CGPA', value: profileData.cgpa },
                { label: 'Status', value: 'Eligible' },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                  <p className="text-xs text-[#6B7280]">{item.label}</p>
                  <p className={`text-sm font-semibold mt-0.5 ${item.label === 'Status' ? 'text-emerald-600 dark:text-emerald-400' : 'text-[#111827] dark:text-[#E6F4F1]'}`}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {profileData.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
              <AlertCircle size={14} className="text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Profile not up to date?{' '}
                <button onClick={() => navigate('/student/profile')} className="font-semibold underline">
                  Update it here
                </button>{' '}
                before applying.
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 1 — Upload Resume */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-5"
          >
            <div>
              <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Upload Resume</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Upload your latest resume in PDF format</p>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-all ${
                dragging
                  ? 'border-[#004643] bg-[#004643]/5'
                  : resumeFile
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                  : 'border-[#E5E7EB] dark:border-[#1F4D4A] hover:border-[#004643]/50'
              }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileUpload(e.target.files[0])}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />

              {resumeFile ? (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mx-auto">
                    <FileText size={24} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-400">{resumeFile.name}</p>
                    <p className="text-xs text-[#6B7280] mt-0.5">
                      {(resumeFile.size / 1024).toFixed(1)} KB — PDF
                    </p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                    className="text-xs text-red-500 hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-14 h-14 bg-[#004643]/10 dark:bg-[#004643]/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload size={24} className="text-[#004643] dark:text-[#0F766E]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">
                      Drag and drop your resume
                    </p>
                    <p className="text-xs text-[#6B7280] mt-1">or click to browse — PDF only, max 5MB</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl">
              <AlertCircle size={14} className="text-blue-600 flex-shrink-0" />
              <p className="text-xs text-blue-700 dark:text-blue-400">
                Ensure your resume is updated with latest projects, internships, and skills.
              </p>
            </div>
          </motion.div>
        )}

        {/* Step 2 — Confirm */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-5"
          >
            <div>
              <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Confirm Application</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Review everything before submitting</p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                <div className={`w-10 h-10 ${drive.color} rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0`}>
                  {drive.abbr}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
                  <p className="text-xs text-[#6B7280]">{drive.role} · {drive.salary}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                  <div className="flex items-center gap-2 mb-1">
                    <User size={12} className="text-[#6B7280]" />
                    <p className="text-xs text-[#6B7280]">Applicant</p>
                  </div>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{profileData.name}</p>
                  <p className="text-xs text-[#6B7280]">CGPA {profileData.cgpa}</p>
                </div>

                <div className="p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText size={12} className="text-[#6B7280]" />
                    <p className="text-xs text-[#6B7280]">Resume</p>
                  </div>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">
                    {resumeFile ? resumeFile.name : 'Using saved resume'}
                  </p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400">Ready</p>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-[#004643]/5 dark:bg-[#004643]/15 border border-[#004643]/20 rounded-xl">
              <CheckCircle size={14} className="text-[#004643] dark:text-[#0F766E] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#004643] dark:text-[#E6F4F1]/80 leading-relaxed">
                By submitting, you confirm you meet the eligibility criteria, your information is accurate, and you consent to sharing your profile with {drive.company}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => currentStep > 0 ? setCurrentStep(currentStep - 1) : navigate(-1)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] hover:border-[#004643] transition-all"
        >
          <ArrowLeft size={14} />
          {currentStep === 0 ? 'Cancel' : 'Back'}
        </button>

        {currentStep < steps.length - 1 ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 1 && !resumeFile}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
            <ChevronRight size={14} />
          </motion.button>
        ) : (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all disabled:opacity-60"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <BriefcaseBusiness size={14} />
                Submit Application
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Application;