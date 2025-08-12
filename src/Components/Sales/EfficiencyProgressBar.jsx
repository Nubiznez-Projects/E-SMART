import React from 'react';

const EfficiencyProgressBar = ({ value }) => {
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
      <progress
        value={clampedValue}
        max="100"
        className="w-full h-4 rounded overflow-hidden appearance-none efficiency-progress"
        style={{
          // Fallback if pseudo styling fails
          color: barColor
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {clampedValue}%
      </div>

      {/* Dynamic styling for the native <progress> element */}
      <style>
        {`
          .efficiency-progress::-webkit-progress-bar {
            background-color: #e5e7eb; /* Tailwind gray-200 */
            border-radius: 0.5rem;
          }
          .efficiency-progress::-webkit-progress-value {
            background-color: ${barColor};
            border-radius: 0.5rem;
          }
          .efficiency-progress::-moz-progress-bar {
            background-color: ${barColor};
            border-radius: 0.5rem;
          }
        `}
      </style>
    </div>
  );
};

export default EfficiencyProgressBar;
