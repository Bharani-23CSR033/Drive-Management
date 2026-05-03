// src/pages/company/Applicants.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Search, Filter, Download,
  ChevronDown, Eye, CheckCircle, XCircle,
  Clock, Mail, Phone, Award, Users,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import companyApi from '../../api/companyApi';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const statusConfig = {
  Applied: { text: 'text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400', icon: Clock },
  Shortlisted: { text: 'text-blue-700 bg-blue-50 dark:bg-blue-900/20 dark:text-blue-400', icon: Clock },
  Selected: { text: 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400', icon: CheckCircle },
  Rejected: { text: 'text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400', icon: XCircle },
};

const Applicants = () => {
  const { driveId } = useParams();
  const navigate = useNavigate();
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        const response = await companyApi.getApplicants(driveId);
        const list = response?.data?.applications || [];
        setApplicants(list);
      } catch (error) {
        toast.error(error?.message || 'Failed to load applicants');
      } finally {
        setLoading(false);
      }
    };

    if (driveId) {
      fetchApplicants();
    }
  }, [driveId]);

  const filtered = applicants.filter((a) => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.college.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const updateStatus = (id, status) => {
    const normalizedStatus = status.toLowerCase();

    companyApi.updateApplicant(id, { status: normalizedStatus })
      .then((response) => {
        const updated = response?.data?.application;
        if (updated) {
          setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: updated.status } : a));
          setSelectedApplicant((prev) => (prev ? { ...prev, status: updated.status } : null));
        } else {
          setApplicants((prev) => prev.map((a) => a.id === id ? { ...a, status: status } : a));
          setSelectedApplicant((prev) => (prev ? { ...prev, status } : null));
        }
        toast.success(`Candidate ${normalizedStatus}`);
      })
      .catch((error) => {
        toast.error(error?.message || 'Failed to update status');
      });
  };

  const toggleSelect = (id) => {
    setSelected((prev) => prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]);
  };

  const bulkUpdate = (status) => {
    Promise.all(selected.map((id) => companyApi.updateApplicant(id, { status: status.toLowerCase() })))
      .then(() => {
        setApplicants((prev) => prev.map((a) => selected.includes(a.id) ? { ...a, status } : a));
        setSelected([]);
        toast.success(`${selected.length} candidates ${status.toLowerCase()}`);
      })
      .catch((error) => {
        toast.error(error?.message || 'Failed to update selected applicants');
      });
  };

  const counts = {
    All: applicants.length,
    Applied: applicants.filter((a) => a.status === 'Applied').length,
    Shortlisted: applicants.filter((a) => a.status === 'Shortlisted').length,
    Selected: applicants.filter((a) => a.status === 'Selected').length,
    Rejected: applicants.filter((a) => a.status === 'Rejected').length,
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5"
    >

      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280] hover:text-[#004643] hover:border-[#004643] transition-all"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Applicants</h1>
            <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
              Drive #{driveId} · {applicants.length} total applicants
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selected.length > 0 && (
            <>
              <button
                onClick={() => bulkUpdate('Shortlisted')}
                className="px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30 rounded-xl text-xs font-medium hover:bg-blue-100 transition-all"
              >
                Shortlist ({selected.length})
              </button>
              <button
                onClick={() => bulkUpdate('Rejected')}
                className="px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30 rounded-xl text-xs font-medium hover:bg-red-100 transition-all"
              >
                Reject ({selected.length})
              </button>
            </>
          )}
          <button className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-xs font-medium text-[#6B7280] hover:border-[#004643] transition-all">
            <Download size={13} />
            Export
          </button>
        </div>
      </motion.div>

      {/* Status Tabs */}
      <motion.div variants={itemVariants} className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(counts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium border flex-shrink-0 transition-all ${
              statusFilter === status
                ? 'bg-[#004643] text-white border-[#004643]'
                : 'bg-white dark:bg-[#143C3A] border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280] hover:border-[#004643] dark:hover:text-[#E6F4F1]'
            }`}
          >
            {status}
            <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${
              statusFilter === status ? 'bg-white/20 text-white' : 'bg-[#E5E7EB] dark:bg-[#1F4D4A] text-[#6B7280]'
            }`}>
              {count}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={itemVariants} className="flex items-center gap-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-2.5 focus-within:border-[#004643] focus-within:ring-2 focus-within:ring-[#004643]/15 transition-all">
        <Search size={14} className="text-[#6B7280] flex-shrink-0" />
        <input
          type="text"
          placeholder="Search applicants..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none"
        />
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">

        <div className="grid grid-cols-6 items-center px-6 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
          <div className="col-span-2 flex items-center gap-3">
            <input
              type="checkbox"
              checked={selected.length === filtered.length && filtered.length > 0}
              onChange={() => setSelected(selected.length === filtered.length ? [] : filtered.map((a) => a.id))}
              className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
            />
            <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">Applicant</p>
          </div>
          {['College', 'CGPA', 'Status', 'Actions'].map((h) => (
            <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
          ))}
        </div>

        <AnimatePresence>
          {loading ? (
            <div className="px-6 py-10 text-center text-sm text-[#6B7280]">Loading applicants...</div>
          ) : filtered.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-[#6B7280]">No applicants found.</div>
          ) : filtered.map((applicant, i) => {
            const StatusIcon = statusConfig[applicant.status]?.icon || Clock;
            return (
              <motion.div
                key={applicant.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.03 }}
                className="grid grid-cols-6 items-center px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
              >
                <div className="col-span-2 flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selected.includes(applicant.id)}
                    onChange={() => toggleSelect(applicant.id)}
                    className="w-4 h-4 rounded border-[#E5E7EB] text-[#004643] focus:ring-[#004643]"
                  />
                  <div className="w-8 h-8 bg-[#004643] rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {applicant.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{applicant.name}</p>
                    <p className="text-xs text-[#6B7280]">{applicant.branch} · {applicant.appliedDate}</p>
                  </div>
                </div>

                <p className="text-xs text-[#6B7280] truncate pr-2">{applicant.college}</p>

                <div>
                  <p className="text-sm font-bold text-[#111827] dark:text-[#E6F4F1]">{applicant.cgpa}</p>
                  <div className="w-12 h-1 bg-[#E5E7EB] dark:bg-[#1F4D4A] rounded-full mt-1 overflow-hidden">
                    <div
                      className="h-full bg-[#004643] rounded-full"
                      style={{ width: `${(applicant.cgpa / 10) * 100}%` }}
                    />
                  </div>
                </div>

                <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[applicant.status]?.text}`}>
                  <StatusIcon size={10} />
                  {applicant.status}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedApplicant(applicant)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
                  >
                    <Eye size={14} />
                  </button>
                  <button
                    onClick={() => updateStatus(applicant.id, 'Shortlisted')}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
                    title="Shortlist"
                  >
                    <CheckCircle size={14} />
                  </button>
                  <button
                    onClick={() => updateStatus(applicant.id, 'Rejected')}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                    title="Reject"
                  >
                    <XCircle size={14} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Detail Modal */}
      <Modal
        isOpen={!!selectedApplicant}
        onClose={() => setSelectedApplicant(null)}
        title="Applicant Profile"
        size="md"
      >
        {selectedApplicant && (
          <div className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-[#004643] rounded-2xl flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
                {selectedApplicant.name.charAt(0)}
              </div>
              <div>
                <p className="text-base font-bold text-[#111827] dark:text-[#E6F4F1]">{selectedApplicant.name}</p>
                <p className="text-sm text-[#6B7280]">{selectedApplicant.branch} · {selectedApplicant.year} Year</p>
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${statusConfig[selectedApplicant.status]?.text}`}>
                  {selectedApplicant.status}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Email', value: selectedApplicant.email },
                { label: 'Phone', value: selectedApplicant.phone },
                { label: 'College', value: selectedApplicant.college },
                { label: 'CGPA', value: selectedApplicant.cgpa },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                  <p className="text-xs text-[#6B7280]">{item.label}</p>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mt-0.5">{item.value}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs font-medium text-[#6B7280] mb-2">Skills</p>
              <div className="flex flex-wrap gap-2">
                {selectedApplicant.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-lg text-xs font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => updateStatus(selectedApplicant.id, 'Shortlisted')}
                className="py-2.5 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl text-xs font-semibold hover:bg-blue-100 transition-all"
              >
                Shortlist
              </button>
              <button
                onClick={() => updateStatus(selectedApplicant.id, 'Selected')}
                className="py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-xs font-semibold hover:bg-emerald-100 transition-all"
              >
                Select
              </button>
              <button
                onClick={() => updateStatus(selectedApplicant.id, 'Rejected')}
                className="py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-xs font-semibold hover:bg-red-100 transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        )}
      </Modal>

    </motion.div>
  );
};

export default Applicants;