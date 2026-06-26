const ScoreCard = ({
  label,
  value,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 text-center shadow-xl hover:border-cyan-500/30 transition-all duration-300">

      <h3 className="text-slate-400 text-sm uppercase tracking-wider">
        {label}
      </h3>

      <h2 className="text-5xl font-bold mt-4 bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
        {value}
      </h2>

      <p className="text-slate-500 mt-2">
        out of 100
      </p>

    </div>
  );
};

export default ScoreCard;