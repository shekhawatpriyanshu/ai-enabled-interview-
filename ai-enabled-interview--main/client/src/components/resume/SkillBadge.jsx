const SkillBadge = ({
  skill,
}) => {
  return (
    <span
      className="
      px-4
      py-2
      rounded-full
      bg-cyan-500/20
      text-cyan-300
      text-sm
      font-medium
    "
    >
      {skill}
    </span>
  );
};

export default SkillBadge;