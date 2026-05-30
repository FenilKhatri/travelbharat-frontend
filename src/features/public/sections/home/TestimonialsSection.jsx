import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";
import { FaQuoteLeft } from "react-icons/fa";

const testimonials = [
  {
    name: "Aarti Sharma",
    role: "Travel Enthusiast",
    review: "TravelBharat made my trip to Rajasthan unforgettable! The curated destinations and seamless planning were absolutely top-notch.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Rahul Desai",
    role: "Photography Blogger",
    review: "The platform's insights into hidden gems in Gujarat helped me capture some of the most stunning architectural marvels.",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=150"
  },
  {
    name: "Meera Patel",
    role: "Cultural Explorer",
    review: "From the festivals to the food, the details provided by TravelBharat are incredibly accurate and deeply culturally rooted.",
    avatar: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&q=80&w=150"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-white dark:bg-[#060D18] relative overflow-hidden">
      {/* Decorative patterns */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#E85D04]/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D4A72C]/10 rounded-full blur-3xl mix-blend-multiply dark:mix-blend-screen pointer-events-none"></div>

      <div className="max-w-[1600px] w-full mx-auto px-4 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[#E85D04] font-bold uppercase tracking-wider text-sm mb-2 block">Voices of Bharat</span>
          <h2 className="text-3xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Traveler Experiences
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Hear from our community of explorers who have discovered the magic of India with TravelBharat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-slate-50 dark:bg-[#0A121F] p-8 rounded-3xl relative border border-slate-100 dark:border-white/5 shadow-lg group hover:-translate-y-2 transition-transform"
            >
              <div className="absolute top-6 right-6 text-[#E85D04]/20 group-hover:text-[#E85D04]/40 transition-colors">
                <FaQuoteLeft size={40} />
              </div>
              
              <div className="flex gap-1 text-[#D4A72C] mb-6">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FiStar key={star} size={18} fill="currentColor" />
                ))}
              </div>
              
              <p className="text-slate-700 dark:text-slate-300 mb-8 italic relative z-10 leading-relaxed text-lg">
                "{testimonial.review}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={testimonial.avatar} 
                  alt={testimonial.name} 
                  className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-[#1E293B] shadow-md"
                />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.name}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;

