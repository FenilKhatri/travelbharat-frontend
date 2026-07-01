import { motion } from "framer-motion";
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
        source: "homepage",
      });
      toast.success("Welcome to TravelBharat ✨");
      setEmail("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Subscription failed");
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
            "url('https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2070&auto=format&fit=crop')",
        }}
      />

      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#E85D04]/20 blur-[140px] rounded-full"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#D97706]/20 blur-[120px] rounded-full"></div>

      {/* Left Cultural Decoration */}
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Mandala_svg.svg"
        alt="Mandala"
        className="absolute left-[-15%] sm:left-[-10%] top-[10%] w-[250px] sm:w-[450px] pointer-events-none opacity-[0.08] animate-spin"
        style={{ animationDuration: "20s" }}
      />

      {/* Right Cultural Decoration */}
      <img
        src="https://cdn-icons-png.flaticon.com/512/3448/3448339.png"
        alt="Kite Festival"
        className="absolute right-[2%] sm:right-[5%] top-[15%] w-20 sm:w-28 md:w-36 pointer-events-none opacity-[0.12] animate-bounce"
        style={{ animationDuration: "4s" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden"
        >
          <div className="relative z-10 grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            {/* LEFT CONTENT */}
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-[#E85D04]/10 border border-[#E85D04]/20 mb-6 sm:mb-8">
                <FaMagic className="text-[#E85D04]" size={16} />
                <span className="text-xs sm:text-sm font-semibold tracking-wide text-[#E85D04] uppercase">
                  Join The TravelBharat Journey
                </span>
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight text-slate-900 dark:text-white">
                Get Festival & Travel <br />
                <span className="bg-linear-to-r from-[#E85D04] via-[#FF9E00] to-[#FF6B00] bg-clip-text text-transparent">
                  Inspiration Daily
                </span>
              </h2>

              <p className="mt-5 sm:mt-8 text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed max-w-xl">
                Discover hidden gems, Gujarat festivals, spiritual journeys,
                royal heritage destinations, and premium travel experiences
                delivered directly to your inbox.
              </p>
            </div>

            {/* RIGHT FORM */}
            <div className="relative w-full max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <div className="relative rounded-2xl sm:rounded-[32px] border border-white/20 dark:border-white/10 bg-white/10 dark:bg-white/5 backdrop-blur-2xl p-6 sm:p-8 shadow-xl">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-linear-to-br from-[#E85D04] to-[#FF9E00] flex items-center justify-center shadow-lg mb-6 sm:mb-8">
                  <FiMail className="text-white" size={24} />
                </div>

                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                  Subscribe Now
                </h3>

                <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 sm:mb-8 leading-relaxed">
                  Join thousands of explorers discovering the beauty, culture,
                  and festivals of Bharat.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <input
                      type="email"
                      required
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 sm:h-14 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 text-slate-800 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E85D04]/40 transition-all text-sm"
                    />
                    <FiMap
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-[#E85D04]"
                      size={18}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={loading}
                    className="w-full h-12 sm:h-14 text-sm font-semibold rounded-xl bg-linear-to-r from-[#E85D04] to-[#FF7B00] hover:from-[#DC2F02] hover:to-[#E85D04] text-white transition-all shadow-md"
                  >
                    {loading ? "Subscribing..." : "Start Exploring Bharat"}
                    <FiSend size={16} className="ml-2" />
                  </Button>
                </form>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 text-center">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Newsletter;
