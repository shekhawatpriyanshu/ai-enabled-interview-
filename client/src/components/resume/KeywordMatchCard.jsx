const KeywordMatchCard = ({
  matched,
  total,
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
        Keyword Match
      </h3>

      <div className="text-5xl font-bold text-purple-400 mt-4">
        {matched}/{total}
      </div>
    </div>
  );
};

export default KeywordMatchCard;