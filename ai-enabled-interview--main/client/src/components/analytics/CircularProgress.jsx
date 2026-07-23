// src/components/analytics/CircularProgress.jsx

const CircularProgress = ({
  value = 0,
  max = 100,
  size = 140,
  strokeWidth = 12,
  color = "#0d6efd",
  label = "Progress",
}) => {
  const percentage =
    max > 0
      ? Math.min((value / max) * 100, 100)
      : 0;

  const radius =
    (size - strokeWidth) / 2;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (percentage / 100) * circumference;

  return (
    <div className="text-center">

      <div
        className="position-relative d-inline-block"
        style={{
          width: size,
          height: size,
        }}
      >
        <svg
          width={size}
          height={size}
          style={{
            transform: "rotate(-90deg)",
          }}
        >
          {/* Background Circle */}

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#e9ecef"
            strokeWidth={strokeWidth}
            fill="none"
          />

          {/* Progress Circle */}

          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{
              transition:
                "stroke-dashoffset 0.7s ease",
            }}
          />
        </svg>

        {/* Center Content */}

        <div
          className="position-absolute top-50 start-50 translate-middle text-center"
        >
          <h4 className="fw-bold mb-0">
            {Math.round(percentage)}%
          </h4>

          <small className="text-muted">
            {value}/{max}
          </small>
        </div>

      </div>

      <div className="mt-3">

        <h6 className="fw-semibold">
          {label}
        </h6>

      </div>

    </div>
  );
};

export default CircularProgress;