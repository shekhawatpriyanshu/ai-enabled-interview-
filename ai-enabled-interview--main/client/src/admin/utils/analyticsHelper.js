export const formatPercentage = (value) => {
  if (!value) return "0%";

  return `${Number(value).toFixed(2)}%`;
};

export const formatNumber = (value) => {
  if (!value) return 0;

  return Number(value).toLocaleString();
};

export const getStatusColor = (status) => {

  switch (status) {

    case "Completed":
      return "text-green-600";

    case "Pending":
      return "text-yellow-600";

    case "Cancelled":
      return "text-red-600";

    case "Accepted":
      return "text-green-600";

    case "Wrong Answer":
      return "text-red-600";

    case "Compilation Error":
      return "text-orange-600";

    case "Runtime Error":
      return "text-purple-600";

    default:
      return "text-gray-600";

  }
};

export const calculateRate = (
  value,
  total
) => {

  if (!total) return 0;

  return Number(
    ((value / total) * 100).toFixed(2)
  );

};