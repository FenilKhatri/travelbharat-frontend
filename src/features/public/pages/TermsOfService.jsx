import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { MdSecurity } from "react-icons/md";
import { FiEye, FiFileText, FiLock, FiCompass, FiPhoneCall, FiInfo } from "react-icons/fi";
import { FaHammer, FaBalanceScale } from "react-icons/fa";

const sections = [
  { id: "acceptance", label: "1. Acceptance of Terms", icon: FiInfo },
  { id: "eligibility", label: "2. Account & Eligibility", icon: MdSecurity },
  { id: "platform-usage", label: "3. Platform Usage Rules", icon: FiCompass },
  { id: "user-content", label: "4. User Generated Content", icon: FiEye },
  { id: "accuracy-disclaimer", label: "5. Information Accuracy", icon: FiFileText },
  { id: "intellectual-property", label: "6. Intellectual Property", icon: FaHammer },
  { id: "liability", label: "7. Limitation of Liability", icon: FaBalanceScale },
  { id: "terms-modifications", label: "8. Term Modifications", icon: FiLock },
  { id: "governing-law", label: "9. Governing Law", icon: FaBalanceScale },
  { id: "contact-us", label: "10. Contact Details", icon: FiPhoneCall },
];

const TermsOfService = () => {
  const [activeSection, setActiveSection] = useState("acceptance");

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offsetTop = element.offsetTop - 120;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth"
      });
      setActiveSection(id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#050B14] pt-24 md:pt-32 pb-24 relative transition-colors duration-300">

      {/* Background Decorative Patterns */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E85D04]/10 blur-[130px] rounded-full pointer-events-none z-0"></div>
      <div className="absolute bottom-10 left-0 w-[450px] h-[450px] bg-[#FFB703]/10 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 relative z-10">

        {/* Header Hero Banner */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E85D04]/10 border border-[#E85D04]/20 mb-6 text-sm font-semibold text-[#E85D04] dark:text-[#FFA034]"
          >
            <FiFileText size={16} />
            <span>Platform Agreement</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Terms of Service
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-lg"
          >
            Please read these Terms of Service carefully before accessing or using the TravelBharat platform. By browsing or creating an account, you agree to these conditions.
            <span className="block mt-2 text-sm font-medium text-slate-400 dark:text-slate-500">Last updated: May 29, 2026</span>
          </motion.p>
        </div>

        {/* main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 lg:gap-16 items-start">

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block sticky top-28 bg-white/70 dark:bg-[#0A121F]/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-6 rounded-2xl shadow-xl z-20">
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-6">
              Table of Contents
            </h3>

            <nav className="flex flex-col gap-1.5">
              {sections.map((sec) => {
                const Icon = sec.icon;
                return (
                  <button
                    key={sec.id}
                    onClick={() => scrollToSection(sec.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${activeSection === sec.id
                        ? "bg-linear-to-r from-[#E85D04] to-[#FF9E00] text-white shadow-md shadow-[#E85D04]/20 scale-[1.02]"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span>{sec.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Policy Document Content */}
          <div className="bg-white/70 dark:bg-[#0A121F]/70 backdrop-blur-xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-10 md:p-14 rounded-3xl shadow-xl space-y-16">

            {/* Section 1 */}
            <section id="acceptance" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiInfo size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Acceptance of Terms</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                By accessing, registration, or using any feature on TravelBharat – Explore India State by State ("TravelBharat", "we", "us", or "our"), you represent that you have read, understood, and agreed to be bound by these Terms of Service, along with our Privacy Policy.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If you do not agree to all terms and conditions outlined in this contract, you may not register, access, or consume any travel guides, itineraries, or maps displayed on the Platform.
              </p>
            </section>

            {/* Section 2 */}
            <section id="eligibility" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <MdSecurity size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Account & Eligibility</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                To access saved trips, local routes, state reviews, and admin dashboard panels, you must authenticate through our login gateway (which integrates Google Auth and Firebase token controls):
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li>You must be at least 18 years old or access under parent supervision.</li>
                <li>You agree to provide true, accurate, and up-to-date identification details during signup.</li>
                <li>You are solely responsible for all actions occurring under your session and account details.</li>
                <li>If you are registering an admin profile, you agree to comply with administrative security rules and strictly protect access keys.</li>
              </ul>
            </section>

            {/* Section 3 */}
            <section id="platform-usage" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiCompass size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. Platform Usage Rules</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                TravelBharat grants you a limited, non-exclusive, non-transferable, revocable license to access tourism guides, explore states, search cities, and write feedback. You agree to use the platform solely for personal and respectful travel discovery.
              </p>
              <div className="p-5 rounded-2xl bg-red-500/5 dark:bg-red-500/10 border border-red-500/10 dark:border-red-500/20">
                <h4 className="font-bold text-red-600 dark:text-red-400 mb-2">Prohibited Activities:</h4>
                <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-1.5">
                  <li>Scraping destination content, state databases, or newsletter databases using automated scripts or crawlers.</li>
                  <li>Posting artificial reviews, spam ratings, or advertising links in destination comment sections.</li>
                  <li>Using vulnerabilities to gain unauthorized entry to backend server controls or other users' profiles.</li>
                  <li>Bypassing regional map visualization parameters or state routing systems.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section id="user-content" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiEye size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. User Generated Content</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                You may have the opportunity to submit ratings, write feedback reviews, and upload pictures of destinations.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                By uploading details, you grant TravelBharat an irrevocable, royalty-free, worldwide license to display, promote, reformat, and host this content on the Platform. You represent that you own all copyright privileges to the uploaded photos and reviews, and that they do not breach any intellectual properties.
              </p>
            </section>

            {/* Section 5 */}
            <section id="accuracy-disclaimer" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiFileText size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Information Accuracy</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                TravelBharat aggregates details regarding Indian states, cities, festivals, local history, and coordinates. We endeavor to maintain information accuracy; however, we do not guarantee the completeness, accuracy, or timing of any data. Local conditions, festival schedules, and destination entry rules are subject to change without notice. Please verify travel routes and safety advisories independently.
              </p>
            </section>

            {/* Section 6 */}
            <section id="intellectual-property" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FaHammer size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">6. Intellectual Property Rights</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The visual layout, brand identity logo assets (`logo.png`), custom gradients, styling systems, interactive maps, graphics, backend APIs, databases, and structural code are the property of TravelBharat. You may not reproduce, modify, or resell any part of our platform code or system assets without prior written consent.
              </p>
            </section>

            {/* Section 7 */}
            <section id="liability" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FaBalanceScale size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">7. Limitation of Liability</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                TravelBharat provides tourism recommendations, routes, and details on an "as-is" and "as-available" basis without any express warranties.
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Under no circumstances shall TravelBharat, its creators, or administrators be liable for any direct, indirect, consequential, or incidental losses (including travel disruptions, vehicle problems, delays, or physical issues) arising from your travel plans based on platform data.
              </p>
            </section>

            {/* Section 8 */}
            <section id="terms-modifications" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiLock size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">8. Terms & Service Modifications</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We reserve the right, at our discretion, to update or modify these Terms of Service at any time to reflect security adjustments or backend upgrades. Any changes will become effective immediately upon being posted on this webpage. We recommend checking this page periodically to remain informed about our policies.
              </p>
            </section>

            {/* Section 9 */}
            <section id="governing-law" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FaBalanceScale size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">9. Governing Law</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                These Terms of Service, along with any disputes or legal actions arising from your platform usage, shall be governed by, and interpreted in accordance with, the laws of the Republic of India. You agree that any legal actions shall be resolved exclusively within the courts located in Surat, Gujarat, India.
              </p>
            </section>

            {/* Section 10 */}
            <section id="contact-us" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiPhoneCall size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">10. Contact Details</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If you have any questions or concerns regarding these terms, please contact us:
              </p>

              <div className="p-6 rounded-2xl bg-linear-to-br from-[#FFF7ED] to-[#FFF1E6] dark:from-[#0B132B] dark:to-[#0C1E36] border border-[#E85D04]/15 dark:border-white/5 space-y-4 max-w-md">
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">TravelBharat HQ Address</span>
                  <p className="font-semibold text-slate-800 dark:text-white text-base">Surat, Gujarat, India</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Privacy Support Email</span>
                  <p className="font-semibold text-[#E85D04] dark:text-[#FFA034] text-base">fenilkhatri931@gmail.com</p>
                </div>
                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 dark:text-slate-500">Platform Support Line</span>
                  <p className="font-semibold text-slate-800 dark:text-white text-base">+91 93134 07400</p>
                </div>
              </div>
            </section>

          </div>
        </div>

      </div>
    </div>
  );
};

export default TermsOfService;