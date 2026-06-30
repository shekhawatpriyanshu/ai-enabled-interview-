import {
  Trophy,
  Medal,
  Award,
} from "lucide-react";

const RankBadge = ({ rank }) => {
  const renderBadge = () => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center gap-2 text-yellow-500 font-bold">
            <Trophy size={20} />
            <span>1</span>
          </div>
        );

      case 2:
        return (
          <div className="flex items-center gap-2 text-gray-500 font-bold">
            <Medal size={20} />
            <span>2</span>
          </div>
        );

      case 3:
        return (
          <div className="flex items-center gap-2 text-orange-500 font-bold">
            <Award size={20} />
            <span>3</span>
          </div>
        );

      default:
        return (
          <span className="font-semibold text-gray-700">
            #{rank}
          </span>
        );
    }
  };

  return renderBadge();
};

export default RankBadge;