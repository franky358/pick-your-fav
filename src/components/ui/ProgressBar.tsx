import React, { useEffect, useState } from 'react';

interface ProgressBarProps {
  votesComparison: number;
  optionVotes: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ votesComparison, optionVotes }) => {
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    const calculatedPercentage = (optionVotes / votesComparison) * 100;
    setPercentage(calculatedPercentage);
  }, [votesComparison, optionVotes]);

  if (!optionVotes) return null;

  return (
    <div className="w-full bg-gray-300 rounded-full h-2 overflow-hidden">
      <div
        className="bg-pink-500 h-2 rounded-full transition-all duration-3000 ease-in-out"
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
