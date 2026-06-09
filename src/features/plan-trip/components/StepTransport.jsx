import { useTripPlanner } from "../context/TripPlannerContext";
import { FiArrowRight, FiArrowLeft } from "react-icons/fi";
import { FaPlane, FaTrain, FaBus, FaCar, FaCarSide } from "react-icons/fa";
import { motion } from "framer-motion";

const transportOptions = [
  { id: "flight", name: "Flight", icon: FaPlane },
  { id: "train", name: "Train", icon: FaTrain },
  { id: "bus", name: "Bus", icon: FaBus },
  { id: "private-car", name: "Private Car", icon: FaCar },
  { id: "self-drive", name: "Self Drive", icon: FaCarSide },
];

const StepTransport = () => {
  const { tripData, updateTripData, nextStep, prevStep } = useTripPlanner();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10 py-10">
      <div>
        <h2 className="text-3xl font-black mb-2 text-[#E85D04]">Transportation</h2>
        <p className="text-white/60">How are you planning to reach {tripData.destination?.cityId?.name}?</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {transportOptions.map(option => {
          const isSelected = tripData.transportation === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => updateTripData({ transportation: option.id })}
              className={`flex flex-col items-center justify-center gap-4 p-8 rounded-3xl border transition-all ${
                isSelected 
                  ? "bg-[#E85D04]/10 border-[#E85D04] text-[#E85D04] shadow-[0_0_20px_rgba(232,93,4,0.2)]" 
                  : "bg-[#0A0F1A] border-white/10 text-white/60 hover:bg-white/5"
              }`}
            >
              <option.icon size={32} />
              <span className="font-bold text-sm tracking-wider">{option.name}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between pt-8">
        <button onClick={prevStep} className="bg-white/10 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
          <FiArrowLeft /> Back
        </button>
        <button onClick={nextStep} className="bg-[#E85D04] text-white px-8 py-3 rounded-xl font-black flex items-center gap-2 hover:bg-[#D05203] transition-colors shadow-lg">
          Next: Accommodation <FiArrowRight />
        </button>
      </div>
    </motion.div>
  );
};

export default StepTransport;
