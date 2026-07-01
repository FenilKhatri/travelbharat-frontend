import { Link } from "react-router-dom";
import FooterSection from "../../features/public/sections/footer/FooterSection";
import { footerLinks } from "../../features/public/data/routes/footer.links";
import logoDark from "../../assets/logo_dark.png";
import logoLight from "../../assets/logo_light.png";
import { FiMail, FiPhone, FiMapPin, FiArrowUpRight } from "react-icons/fi";
import { memo } from "react";
import { useQuery } from "@tanstack/react-query";
import { statsService } from "../../services/statsService";

const Footer = memo(() => {
  const { data: statsData } = useQuery({
    queryKey: ["publicStats"],
    queryFn: statsService.getPublicStats,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  // axios interceptor already returns res.data, so statsData is the API response body
  const stats = statsData?.data || {};

  const footerLinksDesign =
    "group inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-[#E85D04] transition-all duration-300 text-[15px]";

  return (
    <footer className="relative overflow-hidden bg-linear-to-b from-[#FFF7ED] via-[#FFF1E6] to-[#FFE4CC] dark:from-[#070A11] dark:via-[#0A0F1A] dark:to-[#070A11] border-t border-[#E85D04]/10 dark:border-white/10">

      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1974&q=80')"}}
      />

      {/* Cultural Decorative Elements */}
      <motion.img
        initial={{ opacity: 0, rotate: 0 }}
        whileInView={{ opacity: 0.07, rotate: 20 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Mandala_svg.svg"
        alt="Mandala"
        className="absolute left-[-15%] sm:left-[-10%] top-[-10%] w-[280px] sm:w-[500px] pointer-events-none animate-spin-slow"
      />

      <motion.img
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 0.08, y: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png"
        alt="Kite"
        className="absolute right-[2%] sm:right-[5%] top-[10%] w-16 sm:w-24 md:w-32 pointer-events-none animate-float"
      />

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[450px] h-[450px] bg-[#E85D04]/15 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#FFB703]/10 blur-[120px] rounded-full"></div>

      <div className="relative z-10 max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-12 pt-16 sm:pt-24 pb-10">

        {/* TOP SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-16 pb-16 border-b border-[#E85D04]/10 dark:border-white/10">

          {/* LEFT SIDE */}
          <div>

            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8 shrink-0">
              <img src={logoDark} alt="Logo" className="h-14 w-auto object-contain dark:hidden" />
              <img src={logoLight} alt="Logo" className="h-14 w-auto object-contain hidden dark:block" />
            </Link>

            {/* Description */}
            <p className="text-base sm:text-lg leading-relaxed text-slate-700 dark:text-slate-300 max-w-2xl">
              Discover the soul of Bharat through vibrant festivals,
              breathtaking destinations, spiritual journeys, royal heritage,
              and unforgettable travel experiences across every state of India.
            </p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 sm:mt-10">
              {[
                { value: stats.states ? `${stats.states}` : "28+", label: "States" },
                { value: stats.destinations ? `${stats.destinations}` : "500+", label: "Destinations" },
                { value: stats.festivals ? `${stats.festivals}` : "100+", label: "Festivals" },
              ].map((item, index) => (
                <div
                  key={index}
                  className="px-4 py-3 sm:px-6 sm:py-4 rounded-xl sm:rounded-2xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/30 dark:border-white/10 shadow-lg"
                >
                  <h4 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white text-center">
                    {item.value}
                  </h4>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-8 sm:mt-10">

              <a
                href="mailto:fenilkhatri931@gmail.com"
                className="group flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300 hover:text-[#E85D04] transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 flex items-center justify-center shrink-0">
                  <FiMail size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Email Us
                  </p>

                  <span className="font-medium text-sm sm:text-base break-all">
                    fenilkhatri931@gmail.com
                  </span>
                </div>
              </a>

              <a
                href="tel:+919876543210"
                className="group flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300 hover:text-[#E85D04] transition-all"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 flex items-center justify-center shrink-0">
                  <FiPhone size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Call Us
                  </p>

                  <span className="font-medium text-sm sm:text-base">
                    +91 93134 07400
                  </span>
                </div>
              </a>

              <div className="group flex items-center gap-3 sm:gap-4 text-slate-700 dark:text-slate-300">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10 flex items-center justify-center shrink-0">
                  <FiMapPin size={18} />
                </div>

                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Headquarters
                  </p>

                  <span className="font-medium text-sm sm:text-base">
                    Surat, Gujarat, India
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT LINKS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-10">

            <FooterSection
              title="Explore"
              links={footerLinks?.explore}
              linkClass={footerLinksDesign}
            />

            <FooterSection
              title="Popular States"
              links={footerLinks?.popularStates}
              linkClass={footerLinksDesign}
            />

            <FooterSection
              title="Company"
              links={footerLinks?.company}
              linkClass={footerLinksDesign}
            />
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-8">

          {/* Copyright */}
          <p className="text-slate-500 dark:text-slate-400 text-sm text-center lg:text-left">
            © {new Date().getFullYear()} TravelBharat. Crafted with ❤️
            for explorers of Incredible India.
          </p>

          {/* Bottom Links */}
          <div className="flex flex-wrap items-center justify-center gap-6">

            <Link
              to="/privacy-policy"
              className="group inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#E85D04] transition-all"
            >
              Privacy Policy
              <FiArrowUpRight
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
              />
            </Link>

            <Link
              to="/terms-of-service"
              className="group inline-flex items-center gap-1 text-sm text-slate-600 dark:text-slate-400 hover:text-[#E85D04] transition-all"
            >
              Terms & Conditions
              <FiArrowUpRight
                size={14}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default Footer;