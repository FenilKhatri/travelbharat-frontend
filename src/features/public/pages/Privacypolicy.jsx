import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiShield, FiEye, FiFileText, FiLock, FiUserCheck, FiDatabase, FiPhoneCall, FiInfo } from "react-icons/fi";

const sections = [
  { id: "introduction", label: "1. Introduction", icon: FiInfo },
  { id: "information-collection", label: "2. Information We Collect", icon: FiEye },
  { id: "how-we-use", label: "3. How We Use Information", icon: FiDatabase },
  { id: "cookies-trackers", label: "4. Cookies & Trackers", icon: FiFileText },
  { id: "data-security", label: "5. Data Security Protocols", icon: FiLock },
  { id: "your-rights", label: "6. Your Privacy Rights", icon: FiUserCheck },
  { id: "contact-us", label: "7. Contact & Support", icon: FiPhoneCall },
];

const Privacypolicy = () => {
  const [activeSection, setActiveSection] = useState("introduction");

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
            <FiShield size={16} />
            <span>Privacy Protection</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-tight"
          >
            Privacy Policy
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 dark:text-slate-400 text-lg"
          >
            At TravelBharat, we are dedicated to protecting your personal data and ensuring transparency in how we collect, process, and safeguard your details.
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
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
                      activeSection === sec.id
                        ? "bg-gradient-to-r from-[#E85D04] to-[#FF9E00] text-white shadow-md shadow-[#E85D04]/20 scale-[1.02]"
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
            <section id="introduction" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiInfo size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Introduction</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Welcome to TravelBharat – Explore India State by State ("TravelBharat", "we", "us", or "our"). We are committed to safeguarding the privacy of our platform visitors, registered explorers, and administrators. 
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                This Privacy Policy explains how we collect, store, share, use, and process your personal information when you use our website, mobile interface, or connect with our backend services (collectively, the "Platform"). By accessing the Platform, you consent to the data collection and processing methods outlined in this policy.
              </p>
            </section>

            {/* Section 2 */}
            <section id="information-collection" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiEye size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Information We Collect</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We collect information directly provided by you, dynamically through authentication flows, and automatically through device analytics to power your Indian tourism platform experience.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/45">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Personal Data Provided Directly</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li>Account details: Name, Email Address, and Avatar.</li>
                    <li>Authentication logs via Google Sign-In and Firebase OAuth.</li>
                    <li>Support form messages and state/city feedback.</li>
                    <li>User reviews, uploaded destination pictures, and ratings.</li>
                  </ul>
                </div>
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/45">
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">Data Collected Automatically</h4>
                  <ul className="list-disc pl-5 text-sm text-slate-600 dark:text-slate-400 space-y-2">
                    <li>Device specs (IP address, operating system, browser configuration).</li>
                    <li>Usage data: Pages visited, time spent, search queries.</li>
                    <li>Approximate location coordinates (used exclusively for localizing state suggestions and state maps visualization).</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section id="how-we-use" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiDatabase size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">3. How We Use Your Information</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                The data collected on TravelBharat is processed dynamically to build your interactive tour guides, customized route visualizations, and security audits:
              </p>
              <div className="space-y-3">
                {[
                  { title: "Service Delivery", desc: "Allow users to check states, search for cities, review local destinations, and view cultural features." },
                  { title: "Personalization", desc: "Show personalized recommendations based on the regions (North, South, East, West, Northeast) you explore." },
                  { title: "Secure Authentication", desc: "Verify identities using Firebase OAuth login and prevent unauthorized administration accesses." },
                  { title: "Direct Communications", desc: "Process and mail newsletters, welcome templates, and admin updates using our secure SMTP gateways." },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start">
                    <span className="w-6 h-6 rounded-full bg-[#E85D04]/10 dark:bg-[#E85D04]/20 text-[#E85D04] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base">{item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4 */}
            <section id="cookies-trackers" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiFileText size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">4. Cookies & Trackers</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                We use cookies and equivalent local storage methods to optimize layout loading speeds, theme preferences (light/dark transitions), and session tokens.
              </p>

              {/* Cookies Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800/50 text-slate-800 dark:text-slate-200 text-sm font-semibold">
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Cookie Type</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Purpose</th>
                      <th className="p-4 border-b border-slate-200 dark:border-slate-800">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-slate-600 dark:text-slate-400">
                    <tr className="border-b border-slate-100 dark:border-slate-900">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">Essential Session Token</td>
                      <td className="p-4">Authenticates admin roles and user sessions with backend services.</td>
                      <td className="p-4">Session-based</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-900">
                      <td className="p-4 font-medium text-slate-900 dark:text-white">Theme Preference</td>
                      <td className="p-4">Saves whether the user selected the dark or light layout.</td>
                      <td className="p-4">Persistent</td>
                    </tr>
                    <tr>
                      <td className="p-4 font-medium text-slate-900 dark:text-white">Analytics Cookie</td>
                      <td className="p-4">Monitors path parameters to identify trending states and popular places.</td>
                      <td className="p-4">30 Days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section 5 */}
            <section id="data-security" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiLock size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">5. Data Security Protocols</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                TravelBharat implements strict technical precautions to ensure your data stays safe:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[
                  { title: "SSL Encryption", desc: "All data transferred between frontend web page interfaces and the backend Node.js APIs is encrypted via TLS/SSL." },
                  { title: "Database Safety", desc: "MongoDB server databases are secured with dynamic IP access lists and strict access controls." },
                  { title: "OAuth Verification", desc: "No plaintext user passwords are saved directly. All logins are processed through Google Auth and Firebase tokens." }
                ].map((sec, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-900/20 border border-slate-100 dark:border-slate-800">
                    <h5 className="font-bold text-slate-900 dark:text-white mb-1.5 text-sm">{sec.title}</h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sec.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 6 */}
            <section id="your-rights" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiUserCheck size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">6. Your Privacy Rights</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                As a user of TravelBharat, you maintain absolute ownership over your personal data:
              </p>
              <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
                <li><strong>Right to Access:</strong> Request a complete summary of your personal information stored on our servers.</li>
                <li><strong>Right to Rectification:</strong> Directly modify your profile avatar, name, and security settings on your profile.</li>
                <li><strong>Right to Erase (Account Deletion):</strong> Delete your profile data, reviews, and saves from the backend.</li>
                <li><strong>Right to Opt-Out:</strong> Unsubscribe from email loops by using links in our emails.</li>
              </ul>
            </section>

            {/* Section 7 */}
            <section id="contact-us" className="scroll-mt-32 space-y-5">
              <div className="flex items-center gap-4 border-b border-slate-100 dark:border-slate-800/50 pb-4">
                <div className="w-10 h-10 rounded-xl bg-[#E85D04]/10 dark:bg-[#E85D04]/20 flex items-center justify-center text-[#E85D04]">
                  <FiPhoneCall size={22} />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">7. Contact & Support</h2>
              </div>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                If you have questions about this policy, require data removal assistance, or want to raise concerns about cookies, please get in touch with our security administrator:
              </p>
              
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#FFF7ED] to-[#FFF1E6] dark:from-[#0B132B] dark:to-[#0C1E36] border border-[#E85D04]/15 dark:border-white/5 space-y-4 max-w-md">
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

export default Privacypolicy;
