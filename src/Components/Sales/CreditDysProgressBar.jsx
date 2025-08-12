import React from 'react';

const CreditDaysProgressBar = ({ value }) => {
  // Clamp the value between 0 and 100
  const clampedValue = Math.min(Math.max(value, 0), 100);

  // Determine color based on value
  const getColor = (val) => {
    if (val <= 30) return '#ef4444';  // Tailwind red-500
    if (val <= 60) return '#facc15';  // Tailwind yellow-400
    return '#22c55e';                 // Tailwind green-500
  };

  const barColor = getColor(clampedValue);

  return (
    <div className="relative w-[10vw] h-4">

      {/* Progress Bar */}
        <progress
          value={clampedValue}
          max="100"
          className="w-full h-4 rounded overflow-hidden appearance-none credit-days-progress"
          style={{
            // Fallback for Safari
            color: barColor,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
          {clampedValue}%
        </div>

        {/* Dynamic styles for inner bar */}
        <style>
          {`
            .credit-days-progress::-webkit-progress-bar {
              background-color: #e5e7eb; /* gray-200 */
              border-radius: 0.5rem;
            }
            .credit-days-progress::-webkit-progress-value {
              background-color: ${barColor};
              border-radius: 0.5rem;
            }
            .credit-days-progress::-moz-progress-bar {
              background-color: ${barColor};
              border-radius: 0.5rem;
            }
          `}
        </style>
    </div>
  );
};

export default CreditDaysProgressBar;
