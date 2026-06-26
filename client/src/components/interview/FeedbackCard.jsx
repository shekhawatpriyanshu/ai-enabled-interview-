const FeedbackCard = ({
  title,
  items,
}) => {
  return (
    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-xl">

      <h2 className="text-2xl font-bold text-white mb-6">
        {title}
      </h2>

      <ul className="space-y-4">

        {items?.map(
          (
            item,
            index
          ) => (
            <li
              key={index}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-300"
            >
              {item}
            </li>
          )
        )}

      </ul>

    </div>
  );
};

export default FeedbackCard;