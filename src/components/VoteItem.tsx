// src/components/VoteItem.tsx
import React from 'react';

interface VoteItemProps {
  item: Option;
  onVote: () => void;
  isSelected: boolean;
  isVotable: boolean;
}

const VoteItem: React.FC<VoteItemProps> = ({ item, onVote, isSelected, isVotable }) => {
  return (
    <div
      className={`p-4 border rounded w-full md:w-1/2 cursor-pointer hover:bg-gray-200 ${
        isSelected ? 'bg-green-200' : ''
      }`}
      onClick={() => isVotable && onVote()}
    >
      {item.title && <h2 className="text-xl">{item.title}</h2>}
      <img src={item.url} alt={item.title || 'Option'} className="w-full h-auto" />
    </div>
  );
};

export default VoteItem;
