import { useState } from "react";
import { FiSend, FiMap, FiMail } from "react-icons/fi";
import { FaMagic } from "react-icons/fa";
import { toast } from "react-toastify";
import http from "../../../../lib/axios";
import Button from "../../../../components/ui/Button";

const Newsletter = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);

      await http.post("/newsletter/subscribe", {
        email,
        source: "homepage"});

      toast.success("Welcome to TravelBharat ✨");
      setEmail("");
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Subscription failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-28 overflow-hidden bg-linear-to-b from-[#FFF7ED]/70 via-[#FFF1E6]/60 to-[#FFE4CC]/40 dark:from-background dark:via-surface-elevated dark:to-background">

      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-[0.25] dark:opacity-[0.08] bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop')"}}
      />

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E85D04]/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D97706]/20 blur-[120px] rounded-full"></div>

      {/* Left Cultural Decoration */}
      <motion.img
        initial={{ opacity: 0, x: -40 }}
        whileInView={{ opacity: 0.08, x: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Mandala_svg.svg"
        alt="Mandala"
        className="absolute left-[-15%] sm:left-[-10%] top-[10%] w-[250px] sm:w-[450px] pointer-events-none animate-spin-slow"
      />

      {/* Right Cultural Decoration */}
      <motion.img
        initial={{ opacity: 0, x: 40 }}
        whileInView={{ opacity: 0.12, x: 0 }}
        transition={{ duration: 1.2 }}
        viewport={{ once: true }}
        src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png"
        alt="Kite Festival"
        className="absolute right-[2%] sm:right-[5%] top-[15%] w-20 sm:w-28 md:w-36 pointer-events-none animate-float"
      />

      <div className="relative z-10 max-w-[1600px] mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative overflow-hidden"
        >

          {/* Floating Particles */}
          <div className="absolute md:top-10 md:left-10 top-2 left-2 w-3 h-3 rounded-full bg-[#E85D04]/80 animate-pulse"></div>
          <div className="absolute md:bottom-10 md:right-10 bottom-2 right-2 w-4 h-4 rounded-full bg-[#FFB703]/60 animate-ping"></div>

          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center px-4 sm:px-8 md:px-16 py-10 sm:py-16 md:py-20">

            {/* LEFT CONTENT */}
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#E85D04]/10 border border-[#E85D04]/20 mb-6 sm:mb-8">
                <FaMagic className="text-[#E85D04]" size={16} />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#E85D04] uppercase">
                  Join The TravelBharat Journey
                </span>
              </div>

              {/* Heading */}
              <h2 className="text-2xl sm:text-5xl lg:text-6xl font-black leading-tight text-slate-900 dark:text-white">
                Get Festival & Travel
                <span className="block bg-linear-to-r from-[#E85D04] via-[#FF9E00] to-[#FF6B00] bg-clip-text text-transparent">
                  Inspiration Daily
                </span>
              </h2>

              {/* Description */}
              <p className="mt-5 sm:mt-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-2xl">
                Discover hidden gems, Gujarat festivals, spiritual journeys,
                royal heritage destinations, and premium travel experiences
                delivered directly to your inbox.
              </p>

              {/* Features */}
              <div className="mt-6 sm:mt-10 flex flex-wrap gap-2.5 sm:gap-4">
                {[
                  "🇮🇳 Bharat Festivals",
                  "🪁 Gujarat Tourism",
                  "🏔️ Hidden Destinations",
                  "✨ Premium Itineraries",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-white/70 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT FORM */}
            <div className="relative w-full">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[32px] border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-3xl p-6 sm:p-8 md:p-10 shadow-[0_15px_60px_rgba(0,0,0,0.08)] dark:shadow-[0_15px_60px_rgba(0,0,0,0.3)]">

                {/* Decorative Glow */}
                <div className="absolute -top-20 -right-20 w-52 h-52 bg-[#E85D04]/20 blur-[90px] rounded-full"></div>

                <div className="relative z-10">

                  <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-linear-to-br from-[#E85D04] to-[#FF9E00] flex items-center justify-center shadow-[0_10px_30px_rgba(232,93,4,0.35)] mb-6 sm:mb-8">
                    <FiMail className="text-white" size={20} />
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">
                    Subscribe Now
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
                    Join thousands of explorers discovering the beauty,
                    culture, and festivals of Bharat.
                  </p>

                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 sm:space-y-5"
                  >
                    <div className="relative">
                      <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-5 sm:px-6 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/40 transition-all text-sm sm:text-base"
                      />

                      <FiMap
                        className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-[#E85D04]"
                        size={20}
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      disabled={loading}
                      className="w-full h-14 sm:h-16 rounded-xl sm:rounded-2xl text-sm sm:text-lg font-semibold bg-linear-to-r from-[#E85D04] to-[#FF7B00] hover:from-[#DC2F02] hover:to-[#E85D04] shadow-[0_10px_30px_rgba(232,93,4,0.35)] hover:scale-[1.02] transition-all duration-300"
                    >
                      {loading ? "Subscribing..." : "Start Exploring Bharat"}
                      <FiSend size={18} className="ml-2" />
                    </Button>
                  </form>

                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-4 sm:mt-5 text-center">
                    We respect your privacy. Unsubscribe anytime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-[#FFF7ED] dark:from-[#050816] to-transparent"></div>
    </section>
  );
};

export default Newsletter;