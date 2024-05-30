import React from 'react';
import { Option } from "../types";

interface VoteItemProps {
  item: Option;
  onVote: () => void;
  isSelected: boolean;
  isVotable: boolean;
}

const VoteItem: React.FC<VoteItemProps> = ({ item, onVote, isSelected, isVotable }) => {
  return (
    <div
      className={`rounded w-full md:w-1/2 cursor-pointer ${
        isSelected ? 'bg-green-200 border-2 border-green-200' : ''
      } ${isVotable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={() => isVotable && onVote()}
    >
      <img src={item.url} alt={item.title || 'Option'} className="w-full h-auto" />
    </div>
  );
};

export default VoteItem;


