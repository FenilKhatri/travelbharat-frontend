import { motion } from "framer-motion";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

const contactInfo = [
  {
    icon: FiMail,
    title: "Email Us",
    value: "fenilkhatri931@gmail.com",
    href: "mailto:fenilkhatri931@gmail.com",
    description: "Send us your questions anytime.",
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  },
  {
    icon: FiPhone,
    title: "Call Us",
    value: "+91 93134 07400",
    href: "tel:+919313407400",
    description: "Available Mon–Sat, 9 AM – 7 PM.",
    color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  {
    icon: FiMapPin,
    title: "Visit Us",
    value: "Surat, Gujarat, India",
    href: null,
    description: "Our base of operations.",
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
];

const ContactInfo = () => {
  return (
    <section className="max-w-6xl mx-auto px-4 -mt-12 relative z-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {contactInfo.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="bg-white dark:bg-[#0D1526] p-6 rounded-2xl border border-slate-100 dark:border-slate-800/50 shadow-lg hover:shadow-xl transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${item.color}`}>
              <item.icon size={22} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
              {item.title}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
              {item.description}
            </p>
            {item.href ? (
              <a
                href={item.href}
                className="text-[#E85D04] font-semibold text-sm hover:underline"
              >
                {item.value}
              </a>
            ) : (
              <span className="text-[#E85D04] font-semibold text-sm">{item.value}</span>
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ContactInfo;
