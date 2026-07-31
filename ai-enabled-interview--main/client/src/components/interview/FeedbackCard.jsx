import { motion } from "framer-motion";

const FeedbackCard = ({ title, items }) => {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-lg hover:border-cyan-300 hover:shadow-cyan-500/10 transition-all"
    >
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        {title}
      </h2>

      <ul className="space-y-4">
        {items?.map((item, index) => (
          <motion.li
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            key={index}
            className="bg-white border border-slate-200 rounded-xl p-4 text-slate-700 font-medium shadow-sm hover:border-cyan-400 hover:bg-slate-50 transition-colors"
          >
            {item}
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
};

export default FeedbackCard;