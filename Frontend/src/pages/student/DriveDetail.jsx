// src/pages/student/DriveDetail.jsx

import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Clock, Users,
  CheckCircle, ChevronRight, AlertCircle,
  CalendarDays, Building2, BriefcaseBusiness,
} from 'lucide-react';
import Modal from '../../components/common/Modal';
import driveApi from '../../api/driveApi';
import studentApi from '../../api/studentApi';
import toast from 'react-hot-toast';

const colors = ['bg-blue-500', 'bg-amber-500', 'bg-blue-700', 'bg-red-500', 'bg-orange-500', 'bg-purple-500', 'bg-blue-600', 'bg-teal-600'];

const formatSalary = (salary) => {
  const numericSalary = Number(salary) || 0;
  const lpa = numericSalary / 100000;
  return `${Number.isInteger(lpa) ? lpa : lpa.toFixed(1)} LPA`;
};

const formatDateLabel = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value ? String(value) : '-';
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const getDaysLeft = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 0;
  return Math.max(0, Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
};

const getCompanyName = (company) => {
  if (!company) return 'Company';
  if (typeof company === 'string') return company;
  return company.name || company.email || 'Company';
};

const getAbbr = (company) => {
  const name = getCompanyName(company);
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part.charAt(0).toUpperCase()).join('') || 'D';
};

const getColor = (name) => colors[Math.abs((name || '').split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)) % colors.length];

const mapDrive = (drive) => ({
  id: drive.id,
  company: getCompanyName(drive.company),
  abbr: getAbbr(drive.company),
  color: getColor(getCompanyName(drive.company)),
  role: drive.role || drive.title || 'Drive',
  salary: formatSalary(drive.salary),
  salaryBreakdown: drive.salary ? `${Math.round((Number(drive.salary) || 0) / 1000).toLocaleString()}/month` : '-',
  location: drive.location || '-',
  deadline: formatDateLabel(drive.deadline),
  daysLeft: getDaysLeft(drive.deadline),
  type: drive.type || 'Full Time',
  duration: drive.duration || `${Array.isArray(drive.selectionProcess) ? drive.selectionProcess.length : 0} rounds`,
  openings: drive.openings || drive.applicants || 0,
  cgpa: drive.cgpa ?? drive.eligibility?.cgpa ?? 0,
  skills: Array.isArray(drive.skills) ? drive.skills : drive.eligibility?.skills || [],
  about: drive.about || drive.description || '',
  overview: drive.overview || drive.description || '',
  eligibility: Array.isArray(drive.eligibility)
    ? drive.eligibility
    : [
        drive.eligibility?.cgpa ? `Minimum CGPA of ${drive.eligibility.cgpa}` : null,
        drive.eligibility?.batch ? `${drive.eligibility.batch} graduating batch only` : null,
        ...(drive.eligibility?.skills?.length ? [`Strong fundamentals in ${drive.eligibility.skills.join(', ')}`] : []),
      ].filter(Boolean),
  selectionProcess: Array.isArray(drive.selectionProcess)
    ? drive.selectionProcess.map((step) => (typeof step === 'string' ? { round: step, desc: '', duration: '' } : step))
    : [],
  benefits: Array.isArray(drive.benefits)
    ? drive.benefits
    : ['Competitive stipend', 'Return offer possibility', 'Mentorship from senior engineers'],
});

const DriveDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [applied, setApplied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [drive, setDrive] = useState(null);
  const [relatedDrives, setRelatedDrives] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDrive = async () => {
      setLoading(true);
      try {
        const [driveResponse, drivesResponse, applicationsResponse] = await Promise.all([
          driveApi.getById(id),
          driveApi.getAll(),
          studentApi.getApplications(),
        ]);

        const currentDrive = driveResponse?.data?.drive;
        const mappedDrive = currentDrive ? mapDrive(currentDrive) : null;
        setDrive(mappedDrive);

        const list = drivesResponse?.data?.drives || [];
        setRelatedDrives(list
          .filter((item) => String(item.id) !== String(id))
          .slice(0, 2)
          .map((item) => ({
            id: item.id,
            company: getCompanyName(item.company),
            role: item.role || item.title || 'Drive',
          })));

        const applications = applicationsResponse?.data?.applications || [];
        setApplied(applications.some((application) => String(application.driveId || application.drive?.id || application.drive) === String(id)));
      } catch (error) {
        toast.error(error?.message || 'Failed to load drive details');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDrive();
    }
  }, [id]);

  const handleApply = async () => {
    try {
      await studentApi.apply({ driveId: id });
      setApplied(true);
      setShowModal(false);
      toast.success('Application submitted');
    } catch (error) {
      toast.error(error?.message || 'Failed to apply');
    }
  };

  const tabs = ['overview', 'eligibility', 'process', 'benefits'];

  if (loading || !drive) {
    return (
      <div className="py-20 text-center text-[#6B7280] dark:text-[#E6F4F1]/60">
        Loading drive details...
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-5 max-w-5xl"
    >

      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-colors"
      >
        <ArrowLeft size={14} />
        Back to Drives
      </button>

      {/* Hero Card */}
      <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl overflow-hidden">

        {/* Top Banner */}
        <div className="bg-[#004643] px-6 py-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-16 h-16 ${drive.color} rounded-2xl flex items-center justify-center text-white text-xl font-bold ring-4 ring-white/20`}>
                {drive.abbr}
              </div>
              <div>
                <p className="text-white/70 text-sm">{drive.company}</p>
                <h1 className="text-2xl font-bold text-white mt-0.5">{drive.role}</h1>
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  <span className="text-xs bg-white/15 text-white px-2.5 py-1 rounded-full">{drive.type}</span>
                  <span className="text-xs bg-white/15 text-white px-2.5 py-1 rounded-full">{drive.duration}</span>
                </div>
              </div>
            </div>

            {!applied ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(true)}
                className="px-6 py-3 bg-white text-[#004643] rounded-xl font-semibold text-sm hover:bg-white/90 transition-all shadow-lg flex-shrink-0"
              >
                Apply Now
              </motion.button>
            ) : (
              <div className="flex items-center gap-2 px-5 py-3 bg-emerald-500/20 border border-emerald-400/30 rounded-xl">
                <CheckCircle size={16} className="text-emerald-400" />
                <span className="text-sm font-medium text-emerald-300">Applied</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Facts */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-[#E5E7EB] dark:divide-[#1F4D4A] border-t border-[#E5E7EB] dark:border-[#1F4D4A]">
          {[
            { icon: Building2, label: 'Salary', value: drive.salary, sub: drive.salaryBreakdown },
            { icon: MapPin, label: 'Location', value: drive.location, sub: 'On-site' },
            { icon: CalendarDays, label: 'Deadline', value: drive.deadline, sub: `${drive.daysLeft} days left` },
            { icon: Users, label: 'Openings', value: `${drive.openings} seats`, sub: 'Limited spots' },
          ].map((fact, i) => {
            const Icon = fact.icon;
            return (
              <div key={i} className="flex items-center gap-3 px-5 py-4">
                <div className="w-8 h-8 bg-[#004643]/10 dark:bg-[#004643]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-[#004643] dark:text-[#0F766E]" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280]">{fact.label}</p>
                  <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{fact.value}</p>
                  <p className="text-xs text-[#6B7280]">{fact.sub}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Content + Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4">

          {/* Tabs */}
          <div className="flex gap-1 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl p-1">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium capitalize transition-all ${
                  activeTab === tab
                    ? 'bg-[#004643] text-white shadow-sm'
                    : 'text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6">

            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-2">About {drive.company}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{drive.about}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-2">Role Overview</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{drive.overview}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1] mb-3">Required Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {drive.skills.map((skill) => (
                      <span key={skill} className="px-3 py-1 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-lg text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'eligibility' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Eligibility Criteria</h3>
                {drive.eligibility.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#6B7280]">{item}</p>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'process' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <h3 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Selection Process</h3>
                {drive.selectionProcess.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-[#004643] rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      {i < drive.selectionProcess.length - 1 && (
                        <div className="w-px flex-1 min-h-[24px] bg-[#E5E7EB] dark:bg-[#1F4D4A] my-1" />
                      )}
                    </div>
                    <div className="pb-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{step.round}</p>
                        <span className="text-xs text-[#6B7280] bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] px-2 py-0.5 rounded-md">
                          {step.duration || '-'}
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] mt-1">{step.desc || 'Details available after application review'}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'benefits' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <h3 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Perks and Benefits</h3>
                {drive.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#004643] flex-shrink-0" />
                    <p className="text-sm text-[#6B7280]">{benefit}</p>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">

          {/* Deadline Countdown */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-4">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Application Deadline</p>
            <div className={`rounded-xl p-4 text-center ${drive.daysLeft <= 3 ? 'bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30' : 'bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30'}`}>
              <p className={`text-4xl font-bold ${drive.daysLeft <= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                {drive.daysLeft}
              </p>
              <p className={`text-xs font-medium mt-1 ${drive.daysLeft <= 3 ? 'text-red-500' : 'text-amber-500'}`}>
                days remaining
              </p>
              <p className="text-xs text-[#6B7280] mt-2">{drive.deadline}</p>
            </div>

            {drive.daysLeft <= 3 && (
              <div className="flex items-center gap-2 text-xs text-red-500">
                <AlertCircle size={12} />
                Closing very soon — apply immediately
              </div>
            )}

            {!applied ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowModal(true)}
                className="w-full py-3 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all shadow-lg shadow-[#004643]/20"
              >
                Apply Now
              </motion.button>
            ) : (
              <div className="w-full py-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl text-center">
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Application Submitted</p>
              </div>
            )}
          </div>

          {/* Quick Info */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Quick Facts</p>
            {[
              { label: 'Min CGPA', value: drive.cgpa },
              { label: 'Openings', value: drive.openings },
              { label: 'Duration', value: drive.duration },
              { label: 'Type', value: drive.type },
            ].map((fact, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0">
                <p className="text-xs text-[#6B7280]">{fact.label}</p>
                <p className="text-xs font-semibold text-[#111827] dark:text-[#E6F4F1]">{fact.value}</p>
              </div>
            ))}
          </div>

          {/* Other Drives */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Similar Drives</p>
            {(relatedDrives.length > 0 ? relatedDrives : [
              { company: 'Microsoft', role: 'SDE Intern', id: 3 },
              { company: 'Amazon', role: 'Backend Dev', id: 2 },
            ]).map((d, i) => (
              <Link
                key={i}
                to={`/student/drives/${d.id}`}
                className="flex items-center justify-between group hover:bg-[#FAFAFA] dark:hover:bg-[#0F2F2C] -mx-2 px-2 py-2 rounded-lg transition-colors"
              >
                <div>
                  <p className="text-sm font-medium text-[#111827] dark:text-[#E6F4F1]">{d.company}</p>
                  <p className="text-xs text-[#6B7280]">{d.role}</p>
                </div>
                <ChevronRight size={14} className="text-[#6B7280] group-hover:text-[#004643] transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Confirm Application" size="sm">
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
            <div className={`w-10 h-10 ${drive.color} rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
              {drive.abbr}
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">{drive.company}</p>
              <p className="text-xs text-[#6B7280]">{drive.role}</p>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { label: 'Salary', value: drive.salary },
              { label: 'Location', value: drive.location },
              { label: 'Deadline', value: drive.deadline },
            ].map((item, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-[#6B7280]">{item.label}</span>
                <span className="font-medium text-[#111827] dark:text-[#E6F4F1]">{item.value}</span>
              </div>
            ))}
          </div>

          <p className="text-xs text-[#6B7280] bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-lg p-3">
            By applying, you confirm that you meet all eligibility criteria and your profile is up to date.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] transition-all"
            >
              Cancel
            </button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleApply}
              className="flex-1 py-2.5 bg-[#004643] text-white rounded-xl text-sm font-semibold hover:bg-[#036b64] transition-all"
            >
              Confirm Apply
            </motion.button>
          </div>
        </div>
      </Modal>

    </motion.div>
  );
};

export default DriveDetail;