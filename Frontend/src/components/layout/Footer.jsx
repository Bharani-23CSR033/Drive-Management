// src/components/layout/Footer.jsx

import { Link } from 'react-router-dom';
import { BriefcaseBusiness, Mail } from 'lucide-react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-[#143C3A] border-t border-[#E5E7EB] dark:border-[#1F4D4A] mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Brand Section */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#004643] rounded-lg flex items-center justify-center">
                <BriefcaseBusiness size={16} className="text-white" />
              </div>
              <span className="font-bold text-[#004643] dark:text-[#E6F4F1] text-base">
                PlaceDrive
              </span>
            </div>

            <p className="text-sm text-[#6B7280] leading-relaxed max-w-xs">
              Streamlining campus placement drives for students, admins, and companies — all in one place.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="p-2 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
              >
                <FaGithub size={16} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
              >
                <FaLinkedin size={16} />
              </a>

              <a
                href="mailto:example@email.com"
                aria-label="Email"
                className="p-2 rounded-lg text-[#6B7280] hover:text-[#004643] hover:bg-[#004643]/10 transition-all"
              >
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">
              Platform
            </h4>
            <ul className="space-y-2">
              {['Student Portal', 'Admin Panel', 'Company Access', 'Drive Calendar'].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-sm text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-[#111827] dark:text-[#E6F4F1]">
              Support
            </h4>
            <ul className="space-y-2">
              {['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Use'].map((item) => (
                <li key={item}>
                  <Link
                    to="#"
                    className="text-sm text-[#6B7280] hover:text-[#004643] dark:hover:text-[#E6F4F1] transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-[#E5E7EB] dark:border-[#1F4D4A] flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-[#6B7280]">
            © {new Date().getFullYear()} PlaceDrive. All rights reserved.
          </p>
          <p className="text-xs text-[#6B7280]">
            Built for campus Placements
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;