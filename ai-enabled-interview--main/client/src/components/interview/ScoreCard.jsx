import { motion } from "framer-motion";

const ScoreCard = ({ label, value }) => {
  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 text-center shadow-lg hover:border-cyan-300 hover:shadow-cyan-500/20 transition-all duration-300"
    >
      <h3 className="text-slate-500 text-sm uppercase font-bold tracking-wider mb-2">
        {label}
      </h3>

      <h2 className="text-5xl font-extrabold text-cyan-600 drop-shadow-sm">
        {value}
      </h2>

      <p className="text-slate-500 font-medium mt-3">
        out of 100
      </p>
    </motion.div>
  );
};

export default ScoreCard;