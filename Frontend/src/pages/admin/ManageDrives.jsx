// src/pages/admin/ManageDrives.jsx

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Edit3, Trash2, X,
  ChevronDown, MoreHorizontal, CheckCircle,
  Users, Clock, MapPin,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const initialDrives = [
  { id: 1, company: 'Google', abbr: 'G', color: 'bg-blue-500', role: 'Software Engineer Intern', salary: '8 LPA', location: 'Bangalore', deadline: 'Apr 20', applicants: 45, status: 'Active', type: 'Internship', cgpa: 7.5 },
  { id: 2, company: 'Amazon', abbr: 'A', color: 'bg-amber-500', role: 'Backend Developer', salary: '12 LPA', location: 'Hyderabad', deadline: 'Apr 22', applicants: 62, status: 'Active', type: 'Full Time', cgpa: 7.0 },
  { id: 3, company: 'Microsoft', abbr: 'MS', color: 'bg-blue-700', role: 'SDE Intern', salary: '9 LPA', location: 'Noida', deadline: 'Apr 10', applicants: 38, status: 'Closed', type: 'Internship', cgpa: 8.0 },
  { id: 4, company: 'Zoho', abbr: 'Z', color: 'bg-red-500', role: 'Full Stack Developer', salary: '6 LPA', location: 'Chennai', deadline: 'Apr 28', applicants: 91, status: 'Active', type: 'Full Time', cgpa: 6.5 },
  { id: 5, company: 'CRED', abbr: 'CR', color: 'bg-purple-500', role: 'Frontend Developer', salary: '10 LPA', location: 'Bangalore', deadline: 'May 3', applicants: 28, status: 'Active', type: 'Full Time', cgpa: 7.0 },
];

const emptyForm = {
  company: '', role: '', salary: '', location: '',
  deadline: '', type: 'Full Time', cgpa: '', status: 'Active',
};

const ManageDrives = () => {
  const [drives, setDrives] = useState(initialDrives);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(null);
  const [editingDrive, setEditingDrive] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [openMenu, setOpenMenu] = useState(null);

  const filtered = drives.filter((d) => {
    const matchSearch = d.company.toLowerCase().includes(search.toLowerCase()) ||
      d.role.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openCreate = () => {
    setEditingDrive(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (drive) => {
    setEditingDrive(drive);
    setForm({ ...drive });
    setShowModal(true);
    setOpenMenu(null);
  };

  const handleSave = () => {
    if (!form.company || !form.role || !form.salary) {
      toast.error('Please fill all required fields');
      return;
    }
    if (editingDrive) {
      setDrives((prev) => prev.map((d) => d.id === editingDrive.id ? { ...d, ...form } : d));
      toast.success('Drive updated');
    } else {
      const newDrive = {
        ...form,
        id: Date.now(),
        abbr: form.company.slice(0, 2).toUpperCase(),
        color: 'bg-[#004643]',
        applicants: 0,
      };
      setDrives((prev) => [newDrive, ...prev]);
      toast.success('Drive created');
    }
    setShowModal(false);
  };

  const handleDelete = (id) => {
    setDrives((prev) => prev.filter((d) => d.id !== id));
    setDeleteModal(null);
    toast.success('Drive deleted');
  };

  const toggleStatus = (id) => {
    setDrives((prev) => prev.map((d) =>
      d.id === id ? { ...d, status: d.status === 'Active' ? 'Closed' : 'Active' } : d
    ));
    setOpenMenu(null);
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
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">Manage Drives</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            {drives.filter((d) => d.status === 'Active').length} active · {drives.length} total drives
          </p>
        </div>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
        >
          <Plus size={15} />
          Create Drive
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl px-4 py-2.5 focus-within:border-[#004643] focus-within:ring-2 focus-within:ring-[#004643]/15 transition-all">
          <Search size={14} className="text-[#6B7280] flex-shrink-0" />
          <input
            type="text"
            placeholder="Search drives..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none"
          />
        </div>
        <div className="flex gap-2">
          {['All', 'Active', 'Closed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                statusFilter === s
                  ? 'bg-[#004643] text-white'
                  : 'bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] text-[#6B7280] hover:border-[#004643] hover:text-[#004643] dark:hover:text-[#E6F4F1]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Table */}
      <motion.div variants={itemVariants} className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">
        <div className="grid grid-cols-6 px-6 py-3 bg-[#FAFAFA] dark:bg-[#0F2F2C]/60 border-b border-[#E5E7EB] dark:border-[#1F4D4A]">
          {['Company', 'Role', 'Applicants', 'Deadline', 'Status', 'Actions'].map((h) => (
            <p key={h} className="text-xs font-medium text-[#6B7280] uppercase tracking-wide">{h}</p>
          ))}
        </div>

        <AnimatePresence>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-sm text-[#6B7280]">No drives found</p>
            </div>
          ) : (
            filtered.map((drive, i) => (
              <motion.div
                key={drive.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: i * 0.04 }}
                className="grid grid-cols-6 items-center px-6 py-4 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0 hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C]/40 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 ${drive.color} rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>
                    {drive.abbr}
                  </div>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
                </div>

                <div>
                  <p className="text-sm text-[#111827] dark:text-[#E6F4F1]">{drive.role}</p>
                  <p className="text-xs text-[#6B7280]">{drive.type}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Users size={13} className="text-[#6B7280]" />
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.applicants}</p>
                </div>

                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#6B7280]" />
                  <p className="text-sm text-[#111827] dark:text-[#E6F4F1]">{drive.deadline}</p>
                </div>

                <span className={`inline-flex w-fit items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                  drive.status === 'Active'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-gray-100 text-gray-600 dark:bg-gray-800/40 dark:text-gray-400'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${drive.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  {drive.status}
                </span>

                <div className="relative flex items-center gap-2">
                  <button
                    onClick={() => openEdit(drive)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    onClick={() => setDeleteModal(drive)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                  <button
                    onClick={() => setOpenMenu(openMenu === drive.id ? null : drive.id)}
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
                  >
                    <MoreHorizontal size={14} />
                  </button>

                  <AnimatePresence>
                    {openMenu === drive.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -5 }}
                        className="absolute right-0 top-8 z-20 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl shadow-lg py-1 w-40"
                      >
                        <button
                          onClick={() => toggleStatus(drive.id)}
                          className="w-full text-left px-4 py-2 text-xs text-[#111827] dark:text-[#E6F4F1] hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C] transition-colors"
                        >
                          {drive.status === 'Active' ? 'Close Drive' : 'Reopen Drive'}
                        </button>
                        <button
                          onClick={() => { setOpenMenu(null); }}
                          className="w-full text-left px-4 py-2 text-xs text-[#111827] dark:text-[#E6F4F1] hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C] transition-colors"
                        >
                          View Applicants
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingDrive ? 'Edit Drive' : 'Create New Drive'}
        size="md"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Company Name *', key: 'company', placeholder: 'e.g. Google' },
              { label: 'Role *', key: 'role', placeholder: 'e.g. Software Engineer' },
              { label: 'Salary', key: 'salary', placeholder: 'e.g. 8 LPA' },
              { label: 'Location', key: 'location', placeholder: 'e.g. Bangalore' },
              { label: 'Deadline', key: 'deadline', placeholder: 'e.g. Apr 30' },
              { label: 'Min CGPA', key: 'cgpa', placeholder: 'e.g. 7.5' },
            ].map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-xs font-medium text-[#6B7280]">{field.label}</label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  value={form[field.key]}
                  onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                  className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] placeholder-[#6B7280] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all"
                />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Job Type', key: 'type', options: ['Full Time', 'Internship'] },
              { label: 'Status', key: 'status', options: ['Active', 'Closed'] },
            ].map((field) => (
              <div key={field.key} className="space-y-1.5">
                <label className="text-xs font-medium text-[#6B7280]">{field.label}</label>
                <div className="relative">
                  <select
                    value={form[field.key]}
                    onChange={(e) => setForm((f) => ({ ...f, [field.key]: e.target.value }))}
                    className="w-full appearance-none px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] transition-all pr-8 cursor-pointer"
                  >
                    {field.options.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] pointer-events-none" />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] transition-all"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleSave}
              className="flex-1 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
            >
              {editingDrive ? 'Save Changes' : 'Create Drive'}
            </motion.button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        title="Delete Drive"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-[#6B7280]">
            Are you sure you want to delete the drive for{' '}
            <span className="font-semibold text-[#111827] dark:text-[#E6F4F1]">
              {deleteModal?.company} — {deleteModal?.role}
            </span>?
            This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setDeleteModal(null)}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] transition-all"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(deleteModal?.id)}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-all"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
};

export default ManageDrives;