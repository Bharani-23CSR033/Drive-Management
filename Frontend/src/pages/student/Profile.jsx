// src/pages/student/Profile.jsx

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Mail, Phone, MapPin, BookOpen,
  Edit3, Save, X, Upload, Plus,
  CheckCircle, FileText, Award, Trash2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import studentApi from '../../api/studentApi';
import useAuthStore from '../../store/authStore';
import Avatar from '../../components/common/Avatar';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const buildEmptyProfile = (user) => ({
  name: user?.name || '',
  email: user?.email || '',
  phone: user?.phone || '',
  location: user?.location || '',
  college: user?.college || '',
  branch: user?.branch || '',
  year: user?.year || '',
  cgpa: user?.cgpa ?? user?.CGPA ?? '',
  batch: user?.batch || '',
  bio: user?.bio || '',
  skills: Array.isArray(user?.skills) ? user.skills : [],
  achievements: Array.isArray(user?.achievements) ? user.achievements : [],
  resumeUrl: user?.resumeUrl || '',
  profilePic: user?.profilePic || '',
});

const Profile = () => {
  const { user, setUser } = useAuthStore();
  const [editMode, setEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [showAchievementInput, setShowAchievementInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profile, setProfile] = useState(() => buildEmptyProfile(user));

  const [tempProfile, setTempProfile] = useState({ ...profile });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?._id) return;

      try {
        setLoading(true);
        const [profileResponse, dashboardResponse] = await Promise.all([
          studentApi.getProfile(user._id),
          studentApi.getDashboard(),
        ]);

        const student = profileResponse?.data?.student;
        if (student) {
          const mappedProfile = {
            name: student.name || user?.name || '',
            email: student.email || user?.email || '',
            phone: student.phone || '',
            location: student.location || '',
            college: student.college || '',
            branch: student.branch || '',
            year: student.year || '',
            cgpa: student.CGPA ?? student.cgpa ?? '',
            batch: student.batch || '',
            bio: student.bio || '',
            skills: Array.isArray(student.skills) ? student.skills : [],
            achievements: Array.isArray(student.achievements) ? student.achievements : [],
            resumeUrl: student.resumeUrl || '',
            profilePic: student.profilePic || '',
          };

          setProfile(mappedProfile);
          setTempProfile(mappedProfile);
        }

        const stats = dashboardResponse?.data?.stats;
        if (stats?.appliedCount !== undefined) {
          setProfile((current) => ({ ...current }));
          setTempProfile((current) => ({ ...current }));
        }
      } catch {
        setProfile((current) => ({ ...current }));
        setTempProfile((current) => ({ ...current }));
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user?._id) {
      toast.error('Unable to update profile');
      return;
    }

    try {
      setLoading(true);
      const response = await studentApi.updateProfile(user._id, {
        name: tempProfile.name,
        phone: tempProfile.phone,
        location: tempProfile.location,
        college: tempProfile.college,
        branch: tempProfile.branch,
        year: tempProfile.year,
        batch: tempProfile.batch,
        CGPA: tempProfile.cgpa,
        skills: tempProfile.skills,
        bio: tempProfile.bio,
        achievements: tempProfile.achievements,
      });
      const student = response?.data?.student;
      const savedProfile = student
        ? {
            ...tempProfile,
            name: student.name || tempProfile.name,
            email: student.email || tempProfile.email,
            phone: student.phone || tempProfile.phone,
            location: student.location || tempProfile.location,
            college: student.college || tempProfile.college,
            branch: student.branch || tempProfile.branch,
            year: student.year || tempProfile.year,
            batch: student.batch || tempProfile.batch,
            cgpa: student.CGPA ?? student.cgpa ?? tempProfile.cgpa,
            skills: Array.isArray(student.skills) ? student.skills : tempProfile.skills,
            bio: student.bio || tempProfile.bio,
            achievements: Array.isArray(student.achievements) ? student.achievements : tempProfile.achievements,
            resumeUrl: student.resumeUrl || tempProfile.resumeUrl,
          }
        : { ...tempProfile };

      setProfile(savedProfile);
      setTempProfile(savedProfile);
      setUser({ ...(user || {}), ...savedProfile });
      setEditMode(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setTempProfile({ ...profile });
    setEditMode(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && !tempProfile.skills.includes(newSkill.trim())) {
      setTempProfile((p) => ({ ...p, skills: [...p.skills, newSkill.trim()] }));
      setNewSkill('');
      setShowSkillInput(false);
    }
  };

  const addAchievement = () => {
    if (newAchievement.trim() && !tempProfile.achievements.includes(newAchievement.trim())) {
      setTempProfile((p) => ({ ...p, achievements: [...p.achievements, newAchievement.trim()] }));
      setNewAchievement('');
      setShowAchievementInput(false);
    }
  };

  const removeSkill = (skill) => {
    setTempProfile((p) => ({ ...p, skills: p.skills.filter((s) => s !== skill) }));
  };

  const removeAchievement = (index) => {
    setTempProfile((p) => ({ ...p, achievements: p.achievements.filter((_, idx) => idx !== index) }));
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('resume', file);

      const response = await studentApi.uploadResume(formData);
      const resumeUrl = response?.data?.resumeUrl || '';
      const student = response?.data?.student;

      setProfile((current) => ({
        ...current,
        resumeUrl: student?.resumeUrl || resumeUrl || current.resumeUrl,
      }));
      setTempProfile((current) => ({
        ...current,
        resumeUrl: student?.resumeUrl || resumeUrl || current.resumeUrl,
      }));
      toast.success('Resume uploaded successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to upload resume');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const handleProfilePicUpload = async (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('profilePic', file);

      const response = await studentApi.uploadProfilePicture(formData);
      const profilePic = response?.data?.profilePic || '';
      const student = response?.data?.student;
      const nextProfilePic = student?.profilePic || profilePic;

      setProfile((current) => ({
        ...current,
        profilePic: nextProfilePic || current.profilePic,
      }));
      setTempProfile((current) => ({
        ...current,
        profilePic: nextProfilePic || current.profilePic,
      }));
      setUser({ ...(user || {}), profilePic: nextProfilePic || '' });

      toast.success('Profile picture uploaded successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to upload profile picture');
    } finally {
      setLoading(false);
      event.target.value = '';
    }
  };

  const displayProfile = editMode ? tempProfile : profile;

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-5 max-w-5xl"
    >

      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#111827] dark:text-[#E6F4F1]">My Profile</h1>
          <p className="text-sm text-[#6B7280] dark:text-[#E6F4F1]/50 mt-0.5">
            Manage your personal and academic information
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editMode ? (
            <>
              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] text-sm font-medium text-[#6B7280] hover:text-[#111827] dark:hover:text-[#E6F4F1] transition-all"
              >
                <X size={14} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004643] text-white text-sm font-semibold hover:bg-[#036b64] transition-all"
              >
                <Save size={14} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditMode(true)}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] bg-white dark:bg-[#143C3A] text-sm font-medium text-[#111827] dark:text-[#E6F4F1] hover:border-[#004643] transition-all"
            >
              <Edit3 size={14} />
              Edit Profile
            </button>
          )}
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Left — Profile Card */}
        <motion.div variants={itemVariants} className="space-y-4">

          {/* Avatar Card */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 text-center space-y-4">
            <div className="relative inline-block">
              <Avatar
                name={displayProfile.name || 'Student'}
                src={displayProfile.profilePic || ''}
                size="xl"
                className="mx-auto rounded-2xl"
              />
              {editMode && (
                <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl flex items-center justify-center shadow-sm hover:border-[#004643] transition-all cursor-pointer">
                  <Upload size={13} className="text-[#6B7280]" />
                  <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicUpload} />
                </label>
              )}
            </div>

            <div>
              <p className="text-base font-bold text-[#111827] dark:text-[#E6F4F1]">{displayProfile.name}</p>
              <p className="text-sm text-[#6B7280] mt-0.5">{displayProfile.branch}</p>
              <p className="text-xs text-[#6B7280]">{displayProfile.college}</p>
            </div>

            <div className="flex items-center justify-center gap-2 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Profile Active</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Quick Stats</p>
            {[
              { label: 'CGPA', value: displayProfile.cgpa, icon: Award },
              { label: 'Batch', value: displayProfile.batch, icon: BookOpen },
              { label: 'Year', value: displayProfile.year, icon: BookOpen },
              { label: 'Applications', value: '12', icon: FileText },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="flex items-center justify-between py-2 border-b border-[#E5E7EB] dark:border-[#1F4D4A] last:border-0">
                  <div className="flex items-center gap-2">
                    <Icon size={13} className="text-[#6B7280]" />
                    <p className="text-xs text-[#6B7280]">{stat.label}</p>
                  </div>
                  <p className="text-xs font-bold text-[#111827] dark:text-[#E6F4F1]">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Resume Upload */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-5 space-y-3">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Resume</p>
            <div className="flex items-center gap-3 p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
              <div className="w-9 h-9 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText size={16} className="text-red-600 dark:text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-[#111827] dark:text-[#E6F4F1] truncate">
                  {displayProfile.resumeUrl ? 'Uploaded resume' : 'No resume uploaded yet'}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {displayProfile.resumeUrl ? 'Resume available' : 'Upload a PDF resume'}
                </p>
              </div>
              <div className="w-2 h-2 bg-emerald-500 rounded-full flex-shrink-0" />
            </div>
            <label className="w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-xs font-medium text-[#6B7280] hover:border-[#004643] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-all cursor-pointer">
              <Upload size={13} />
              {loading ? 'Uploading...' : 'Upload New Resume'}
              <input type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
            </label>
          </div>
        </motion.div>

        {/* Right — Details */}
        <motion.div variants={itemVariants} className="lg:col-span-2 space-y-4">

          {/* Personal Info */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-5">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Personal Information</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'Full Name', key: 'name', icon: User },
                { label: 'Email Address', key: 'email', icon: Mail },
                { label: 'Phone Number', key: 'phone', icon: Phone },
                { label: 'Location', key: 'location', icon: MapPin },
              ].map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-[#6B7280] flex items-center gap-1.5">
                      <Icon size={11} />
                      {field.label}
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={tempProfile[field.key]}
                        onChange={(e) => setTempProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                        className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all"
                      />
                    ) : (
                      <p className="text-sm text-[#111827] dark:text-[#E6F4F1] px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                        {displayProfile[field.key]}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[#6B7280]">Bio</label>
              {editMode ? (
                <textarea
                  value={tempProfile.bio}
                  onChange={(e) => setTempProfile((p) => ({ ...p, bio: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all resize-none"
                />
              ) : (
                <p className="text-sm text-[#6B7280] px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A] leading-relaxed">
                  {displayProfile.bio}
                </p>
              )}
            </div>
          </div>

          {/* Academic Info */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-4">
            <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Academic Information</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'College', key: 'college' },
                { label: 'Branch', key: 'branch' },
                { label: 'Year', key: 'year' },
                { label: 'CGPA', key: 'cgpa' },
                { label: 'Batch', key: 'batch' },
              ].map((field) => (
                <div key={field.key} className="space-y-1.5">
                  <label className="text-xs font-medium text-[#6B7280]">{field.label}</label>
                  {editMode && field.key === 'year' ? (
                    <select
                      value={tempProfile.year}
                      onChange={(e) => setTempProfile((p) => ({ ...p, year: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all"
                    >
                      <option value="">Select year</option>
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  ) : editMode ? (
                    <input
                      type="text"
                      value={tempProfile[field.key]}
                      onChange={(e) => setTempProfile((p) => ({ ...p, [field.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-xl text-sm text-[#111827] dark:text-[#E6F4F1] focus:outline-none focus:border-[#004643] focus:ring-2 focus:ring-[#004643]/15 transition-all"
                    />
                  ) : (
                    <p className="text-sm text-[#111827] dark:text-[#E6F4F1] px-3 py-2.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                      {displayProfile[field.key]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Skills</p>
              {editMode && (
                <button
                  onClick={() => setShowSkillInput(true)}
                  className="flex items-center gap-1 text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
                >
                  <Plus size={12} />
                  Add Skill
                </button>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {displayProfile.skills.map((skill) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#004643]/10 dark:bg-[#004643]/20 text-[#004643] dark:text-[#E6F4F1] rounded-lg text-xs font-medium"
                  >
                    {skill}
                    {editMode && (
                      <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                        <X size={11} />
                      </button>
                    )}
                  </motion.span>
                ))}
              </AnimatePresence>

              {editMode && showSkillInput && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                    placeholder="Add skill..."
                    autoFocus
                    className="px-3 py-1.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#004643] rounded-lg text-xs text-[#111827] dark:text-[#E6F4F1] focus:outline-none w-28"
                  />
                  <button onClick={addSkill} className="text-[#004643] dark:text-[#0F766E]">
                    <CheckCircle size={16} />
                  </button>
                  <button onClick={() => { setShowSkillInput(false); setNewSkill(''); }} className="text-[#6B7280]">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white dark:bg-[#143C3A] border border-[#E5E7EB] dark:border-[#1F4D4A] rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">Achievements</p>
              {editMode && (
                <button
                  onClick={() => setShowAchievementInput(true)}
                  className="flex items-center gap-1 text-xs text-[#004643] dark:text-[#0F766E] font-medium hover:underline"
                >
                  <Plus size={12} />
                  Add Achievement
                </button>
              )}
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {displayProfile.achievements.map((item, i) => (
                  <motion.div key={item} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="flex items-center justify-between gap-3 p-3 bg-[#FAFAFA] dark:bg-[#0F2F2C] rounded-xl border border-[#E5E7EB] dark:border-[#1F4D4A]">
                    <div className="flex items-center gap-3">
                      <div className="w-1.5 h-1.5 bg-[#004643] rounded-full flex-shrink-0" />
                      <p className="text-sm text-[#111827] dark:text-[#E6F4F1]">{item}</p>
                    </div>
                    {editMode && (
                      <button
                        onClick={() => removeAchievement(i)}
                        className="text-[#6B7280] hover:text-red-500 transition-colors flex-shrink-0"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {editMode && showAchievementInput && (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={newAchievement}
                    onChange={(e) => setNewAchievement(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addAchievement()}
                    placeholder="Add achievement..."
                    autoFocus
                    className="px-3 py-1.5 bg-[#FAFAFA] dark:bg-[#0F2F2C] border border-[#004643] rounded-lg text-xs text-[#111827] dark:text-[#E6F4F1] focus:outline-none w-full"
                  />
                  <button onClick={addAchievement} className="text-[#004643] dark:text-[#0F766E]">
                    <CheckCircle size={16} />
                  </button>
                  <button onClick={() => { setShowAchievementInput(false); setNewAchievement(''); }} className="text-[#6B7280]">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

        </motion.div>
      </div>
    </motion.div>
  );
};

export default Profile;