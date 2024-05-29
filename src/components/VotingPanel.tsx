// src/components/VotingPanel.tsx
import React, { useState } from 'react';
import VoteItem from './VoteItem';

const VotingPanel: React.FC = () => {
  const [comparisons, setComparisons] = useState<Comparison[]>([
    {
      id: 1,
      title: 'Comparison 1',
      options: [
        { id: 1, title: 'Option 1', url: 'url-to-image-or-video-1' },
        { id: 2, title: 'Option 2', url: 'url-to-image-or-video-2' },
      ],
      votedOptionId: null,
    },
    {
      id: 2,
      options: [
        { id: 3, title: 'Option 3', url: 'url-to-image-or-video-3' },
        { id: 4, title: 'Option 4', url: 'url-to-image-or-video-4' },
      ],
      votedOptionId: null,
    },
    {
      id: 3,
      title: 'Comparison 3',
      options: [
        { id: 5, title: 'Option 5', url: 'url-to-image-or-video-5' },
        { id: 6, url: 'url-to-image-or-video-6' },
      ],
      votedOptionId: null,
    },
  ]);

  const handleVote = (comparisonId: number, optionId: number) => {
    setComparisons((comparisons) =>
      comparisons.map((comparison) =>
        comparison.id === comparisonId
          ? { ...comparison, votedOptionId: optionId }
          : comparison
      )
    );
    console.log(`Voted for option with id: ${optionId} in comparison: ${comparisonId}`);
  };

  return (
    <div>
      {comparisons.map((comparison) => {
        const pairVoted = comparison.votedOptionId !== null;
        return (
          <div key={comparison.id} className="mb-8">
            {comparison.title && <h2 className="text-2xl mb-4">{comparison.title}</h2>}
            <div className="flex flex-col md:flex-row md:space-x-4">
              {comparison.options.map((option) => (
                <VoteItem
                  key={option.id}
                  item={option}
                  onVote={() => handleVote(comparison.id, option.id)}
                  isSelected={comparison.votedOptionId === option.id}
                  isVotable={!pairVoted}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VotingPanel;
