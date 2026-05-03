// src/pages/company/PostDrive.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, Plus,
  X, ChevronRight, BriefcaseBusiness,
  MapPin, Clock, Users, Award,
} from 'lucide-react';
import toast from 'react-hot-toast';
import companyApi from '../../api/companyApi';

const steps = ['Basic Info', 'Requirements', 'Process', 'Review'];

const emptyForm = {
  role: '',
  type: 'Full Time',
  salary: '',
  location: '',
  deadline: '',
  openings: '',
  cgpa: '',
  batch: '2026',
  branches: [],
  skills: [],
  description: '',
  rounds: [{ name: 'Online Assessment', duration: '90 min', desc: '' }],
};

const allBranches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

const PostDrive = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [newSkill, setNewSkill] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleBranch = (branch) => {
    setForm((f) => ({
      ...f,
      branches: f.branches.includes(branch)
        ? f.branches.filter((b) => b !== branch)
        : [...f.branches, branch],
    }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !form.skills.includes(newSkill.trim())) {
      update('skills', [...form.skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const addRound = () => {
    update('rounds', [...form.rounds, { name: '', duration: '', desc: '' }]);
  };

  const updateRound = (i, key, value) => {
    const rounds = [...form.rounds];
    rounds[i] = { ...rounds[i], [key]: value };
    update('rounds', rounds);
  };

  const removeRound = (i) => {
    update('rounds', form.rounds.filter((_, idx) => idx !== i));
  };

  const handleSubmit = async () => {
    if (!form.role.trim() || !form.salary.trim() || !form.location.trim() || !form.deadline.trim()) {
      toast.error('Please fill the required fields');
      return;
    }

    try {
      setLoading(true);
      await companyApi.postDrive({
        title: form.role,
        role: form.role,
        type: form.type,
        salary: form.salary,
        location: form.location,
        deadline: form.deadline,
        openings: form.openings,
        cgpa: form.cgpa,
        batch: form.batch,
        branches: form.branches,
        skills: form.skills,
        description: form.description,
        selectionProcess: form.rounds,
      });
      setSubmitted(true);
      toast.success('Drive posted successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to post drive');
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
            <h2 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Drive Posted</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed">
              Your drive for <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">{form.role}</span> is now live and visible to eligible students.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => { setForm(emptyForm); setCurrentStep(0); setSubmitted(false); }}
              className="flex-1 py-2.5 border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm font-medium text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] transition-all"
            >
              Post Another
            </button>
            <button
              onClick={() => navigate('/company/dashboard')}
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
        Back
      </button>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Post a Drive</h1>
        <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
          Fill in the details to create a new placement drive
        </p>
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
              <p className={`text-xs font-medium whitespace-nowrap hidden sm:block ${
                i === currentStep ? 'text-[#004643] dark:text-[#E6F4F1]' : 'text-[#6B7280]'
              }`}>
                {step}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">

        {/* Step 0 — Basic Info */}
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
              <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Basic Information</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Core details about the role</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Role / Job Title *', key: 'role', placeholder: 'e.g. Software Engineer' },
                { label: 'Salary / Package *', key: 'salary', placeholder: 'e.g. 8 LPA' },
                { label: 'Location *', key: 'location', placeholder: 'e.g. Bangalore' },
                { label: 'Application Deadline *', key: 'deadline', placeholder: 'e.g. May 10' },
                { label: 'Number of Openings', key: 'openings', placeholder: 'e.g. 15' },
                { label: 'Target Batch', key: 'batch', placeholder: 'e.g. 2026' },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-medium text-[#6B7280]">{field.label}</label>
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={form[field.key]}
                    onChange={(e) => update(field.key, e.target.value)}
                    className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6B7280]">Job Type</label>
              <div className="flex gap-2">
                {['Full Time', 'Internship', 'Contract'].map((t) => (
                  <button
                    key={t}
                    onClick={() => update('type', t)}
                    className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${
                      form.type === t
                        ? 'bg-[#004643] text-white border-[#004643]'
                        : 'bg-white dark:bg-[#0F2F2C] border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280] hover:border-[#004643]'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6B7280]">Job Description</label>
              <textarea
                rows={4}
                placeholder="Describe the role, responsibilities, and what you are looking for..."
                value={form.description}
                onChange={(e) => update('description', e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all resize-none"
              />
            </div>
          </motion.div>
        )}

        {/* Step 1 — Requirements */}
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
              <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Eligibility Requirements</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Set criteria for eligible students</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6B7280]">Minimum CGPA</label>
              <input
                type="text"
                placeholder="e.g. 7.5"
                value={form.cgpa}
                onChange={(e) => update('cgpa', e.target.value)}
                className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#6B7280]">Eligible Branches</label>
              <div className="flex flex-wrap gap-2">
                {allBranches.map((branch) => (
                  <button
                    key={branch}
                    onClick={() => toggleBranch(branch)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      form.branches.includes(branch)
                        ? 'bg-[#004643] text-white border-[#004643]'
                        : 'bg-white dark:bg-[#0F2F2C] border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280] hover:border-[#004643]'
                    }`}
                  >
                    {branch}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-[#6B7280]">Required Skills</label>
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {form.skills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-lg text-xs font-medium"
                    >
                      {skill}
                      <button
                        onClick={() => update('skills', form.skills.filter((s) => s !== skill))}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={11} />
                      </button>
                    </motion.span>
                  ))}
                </AnimatePresence>
              </div>
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  placeholder="Add a skill..."
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] transition-all"
                />
                <button
                  onClick={addSkill}
                  className="px-4 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-medium hover:bg-[#036b64] transition-all"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2 — Process */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-5"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Selection Process</h2>
                <p className="text-sm text-[#6B7280] mt-0.5">Define the hiring rounds</p>
              </div>
              <button
                onClick={addRound}
                className="flex items-center gap-1.5 px-3 py-2 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-xl text-xs font-medium hover:bg-[#004643]/20 transition-all"
              >
                <Plus size={12} />
                Add Round
              </button>
            </div>

            <div className="space-y-3">
              {form.rounds.map((round, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 bg-[#004643] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    {i < form.rounds.length - 1 && (
                      <div className="w-px flex-1 min-h-[24px] bg-[#E5E7EB] dark:bg-[#1F4D4A] my-1" />
                    )}
                  </div>
                  <div className="flex-1 pb-4 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Round name"
                        value={round.name}
                        onChange={(e) => updateRound(i, 'name', e.target.value)}
                        className="px-3 py-2 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] transition-all"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Duration"
                          value={round.duration}
                          onChange={(e) => updateRound(i, 'duration', e.target.value)}
                          className="flex-1 px-3 py-2 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] transition-all"
                        />
                        {form.rounds.length > 1 && (
                          <button
                            onClick={() => removeRound(i)}
                            className="p-2 text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-all"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="Description (optional)"
                      value={round.desc}
                      onChange={(e) => updateRound(i, 'desc', e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3 — Review */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-5"
          >
            <div>
              <h2 className="text-base font-semibold text-[#111827] dark:text-[#E6F4F1]">Review Drive</h2>
              <p className="text-sm text-[#6B7280] mt-0.5">Confirm all details before posting</p>
            </div>

            <div className="bg-[#004643] rounded-xl p-5 space-y-1">
              <p className="text-white/70 text-xs">Role</p>
              <p className="text-white text-lg font-bold">{form.role || 'Not specified'}</p>
              <span className="inline-block text-xs bg-white/20 text-white px-2.5 py-0.5 rounded-full">{form.type}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: BriefcaseBusiness, label: 'Salary', value: form.salary || '-' },
                { icon: MapPin, label: 'Location', value: form.location || '-' },
                { icon: Clock, label: 'Deadline', value: form.deadline || '-' },
                { icon: Users, label: 'Openings', value: form.openings || '-' },
                { icon: Award, label: 'Min CGPA', value: form.cgpa || '-' },
                { icon: Users, label: 'Batch', value: form.batch || '-' },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex items-center gap-2.5 p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                    <Icon size={13} className="text-[#6B7280] flex-shrink-0" />
                    <div>
                      <p className="text-xs text-[#6B7280]">{item.label}</p>
                      <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {form.skills.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#6B7280]">Required Skills</p>
                <div className="flex flex-wrap gap-2">
                  {form.skills.map((skill) => (
                    <span key={skill} className="px-3 py-1 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-lg text-xs font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-xs font-medium text-[#6B7280]">Selection Process</p>
              <div className="space-y-2">
                {form.rounds.map((round, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                    <div className="w-6 h-6 bg-[#004643] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1]">{round.name || 'Unnamed Round'}</p>
                      {round.duration && <p className="text-xs text-[#6B7280]">{round.duration}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
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
            className="flex items-center gap-2 px-6 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
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
                Post Drive
              </>
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default PostDrive;