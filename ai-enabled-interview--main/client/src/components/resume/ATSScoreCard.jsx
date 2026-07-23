const ATSScoreCard = ({
  score,
}) => {
  return (
    <div
      className="
      bg-white/5
      border
      border-white/10
      rounded-3xl
      p-8
      text-center
    "
    >
      <h3 className="text-white text-xl">
        ATS Score
      </h3>

      <div className="text-6xl font-bold text-cyan-400 mt-4">
        {score}%
      </div>
    </div>
  );
};

export default ATSScoreCard;