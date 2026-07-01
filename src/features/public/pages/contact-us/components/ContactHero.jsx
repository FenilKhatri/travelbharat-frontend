const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }};
const ContactHero = () => {
  return (
    <section className="relative pt-28 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-[#0A1628] via-[#0E1E36] to-[#162544]" />
      <div className="absolute inset-0 opacity-15">
        <div className="absolute top-10 right-20 w-72 h-72 bg-[#E85D04]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
        <motion.div {...fadeUp}>
          <span className="text-[#E85D04] font-bold tracking-widest uppercase text-xs mb-4 block">
            — Get In Touch —
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#E85D04] to-[#FFA647]">
              Us
            </span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Have a question, suggestion, or feedback? We'd love to hear from you.
            Our team is here to help.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
export default ContactHero;