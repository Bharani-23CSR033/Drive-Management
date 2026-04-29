// src/components/company/DriveForm.jsx

import { motion } from 'framer-motion';
import { ChevronDown, Plus, X } from 'lucide-react';

const allBranches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'];

const DriveForm = ({ form, onChange, onSkillAdd, onSkillRemove, onBranchToggle, newSkill, setNewSkill }) => {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          { label: 'Role / Job Title *', key: 'role', placeholder: 'e.g. Software Engineer' },
          { label: 'Salary / Package *', key: 'salary', placeholder: 'e.g. 8 LPA' },
          { label: 'Location *', key: 'location', placeholder: 'e.g. Bangalore' },
          { label: 'Application Deadline *', key: 'deadline', placeholder: 'e.g. May 10' },
          { label: 'Number of Openings', key: 'openings', placeholder: 'e.g. 15' },
          { label: 'Min CGPA', key: 'cgpa', placeholder: 'e.g. 7.5' },
        ].map((field) => (
          <div key={field.key} className="space-y-1.5">
            <label className="text-xs font-medium text-[#6B7280]">{field.label}</label>
            <input
              type="text"
              placeholder={field.placeholder}
              value={form[field.key] || ''}
              onChange={(e) => onChange(field.key, e.target.value)}
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
              type="button"
              onClick={() => onChange('type', t)}
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

      <div className="space-y-2">
        <label className="text-xs font-medium text-[#6B7280]">Eligible Branches</label>
        <div className="flex flex-wrap gap-2">
          {allBranches.map((branch) => (
            <button
              key={branch}
              type="button"
              onClick={() => onBranchToggle(branch)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                form.branches?.includes(branch)
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
        <div className="flex flex-wrap gap-2 mb-2">
          {form.skills?.map((skill) => (
            <span
              key={skill}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-lg text-xs font-medium"
            >
              {skill}
              <button onClick={() => onSkillRemove(skill)} className="hover:text-red-500 transition-colors">
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Add a skill..."
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSkillAdd()}
            className="flex-1 px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] transition-all"
          />
          <button
            type="button"
            onClick={onSkillAdd}
            className="px-4 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-medium hover:bg-[#036b64] transition-all"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-medium text-[#6B7280]">Job Description</label>
        <textarea
          rows={4}
          placeholder="Describe the role and responsibilities..."
          value={form.description || ''}
          onChange={(e) => onChange('description', e.target.value)}
          className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all resize-none"
        />
      </div>
    </div>
  );
};

export default DriveForm;