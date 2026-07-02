import React, { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

// Scroll Reveal Wrapper
const Reveal = ({ children, delay = 0, y = 30 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
};

const GalleryCarousel = ({ images, name }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  if (!images || images.length === 0) return null;

  const nextPhoto = () => setActivePhoto(prev => (prev + 1) % images.length);
  const prevPhoto = () => setActivePhoto(prev => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/*  SECTION 4: VISUAL JOURNEY  */}
      <section className="py-24 bg-slate-50 dark:bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto px-4">
          <Reveal>
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-4xl md:text-5xl font-black mb-2 text-slate-900 dark:text-white">Visual Journey</h2>
                <p className="text-slate-500 dark:text-white/50 text-sm font-black tracking-[0.2em] uppercase">Glimpses of {name}</p>
              </div>
              <button
                onClick={() => { setActivePhoto(0); setModalOpen(true); }}
                className="hidden md:block bg-slate-200/50 dark:bg-white/5 hover:bg-slate-300/50 dark:hover:bg-white/10 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white px-6 py-3 rounded-full font-bold transition-all text-sm uppercase tracking-wider cursor-pointer"
              >
                View All Photos
              </button>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[50vh] md:h-[70vh]">
              {/* Hero Feature Image */}
              <div
                className="md:col-span-2 md:row-span-2 rounded-[2rem] overflow-hidden relative group cursor-pointer"
                onClick={() => { setActivePhoto(0); setModalOpen(true); }}
              >
                <img src={images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Gallery Main" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
              </div>

              {/* Grid Images */}
              {images.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="hidden md:block rounded-[2rem] overflow-hidden relative group cursor-pointer"
                  onClick={() => { setActivePhoto(idx + 1); setModalOpen(true); }}
                >
                  <img src={img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={`Gallery ${idx + 1}`} />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-500" />
                  {idx === 3 && images.length > 5 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-black text-3xl">+{images.length - 5}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Reveal>

          <button
            onClick={() => { setActivePhoto(0); setModalOpen(true); }}
            className="mt-6 w-full md:hidden bg-slate-200/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-800 dark:text-white py-4 rounded-xl font-bold uppercase tracking-widest text-sm"
          >
            View All Photos
          </button>
        </div>
      </section>

      {/*  IMMERSIVE PHOTO MODAL  */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all z-50 cursor-pointer"
            >
              <FiX size={24} />
            </button>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 text-sm font-bold tracking-[0.2em]">
              {activePhoto + 1} / {images.length}
            </div>

            <button onClick={prevPhoto} className="absolute left-6 w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full hidden md:flex items-center justify-center backdrop-blur-md transition-all z-50 cursor-pointer">
              <FiChevronLeft size={28} />
            </button>

            <motion.img
              key={activePhoto}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              src={images[activePhoto]}
              className="w-[90vw] h-[80vh] object-contain drop-shadow-[0_0_50px_rgba(255,255,255,0.1)]"
              alt={`Gallery Full ${activePhoto}`}
            />

            <button onClick={nextPhoto} className="absolute right-6 w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full hidden md:flex items-center justify-center backdrop-blur-md transition-all z-50 cursor-pointer">
              <FiChevronRight size={28} />
            </button>

            {/* Mobile Nav */}
            <div className="absolute bottom-6 flex gap-4 md:hidden z-50">
              <button onClick={prevPhoto} className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer">
                <FiChevronLeft size={28} />
              </button>
              <button onClick={nextPhoto} className="w-14 h-14 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all cursor-pointer">
                <FiChevronRight size={28} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GalleryCarousel;