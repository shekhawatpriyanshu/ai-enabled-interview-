const AnalysisCard = ({
  title,
  content,
}) => {
  return (
    <div
      className="
      bg-white/5
      border
      border-white/10
      rounded-3xl
      p-6
    "
    >
      <h2 className="text-xl text-white font-bold mb-4">
        {title}
      </h2>

      <p className="text-slate-300 leading-relaxed">
        {content}
      </p>
    </div>
  );
};

export default AnalysisCard;