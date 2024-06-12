import React from 'react';
import { Option } from "../types";
import { BackgroundGradient } from './ui/background-gradient';
import ImageComponent from './ImageComponent';
// import ProgressBar from './ui/ProgressBar';
import { FaHeart } from "react-icons/fa";

interface VoteItemProps {
  item: Option;
  onVote: () => void;
  isSelected: boolean;
  isVotable: boolean;
  votesComparison: number;
  optionVotes: number;
}

const VoteItem: React.FC<VoteItemProps> = ({ item, onVote, isSelected, isVotable, optionVotes }) => {
  if (isSelected) {
    return (
      <BackgroundGradient className="bg-white dark:bg-zinc-900 rounded-3xl py-8">
        <div className='flex flex-col justify-between'>
          <div className='flex items-center gap-2 justify-end mr-4 mt-1'>
            <FaHeart color='#EC4899' /> 
            <p className='text-pink-500 md:text-xl lg:text-sm'>{`${optionVotes} ${optionVotes === 1 ? 'like' : 'likes'}`} </p>
          </div>
          <ImageComponent src={item.url} alt={item.title || 'Option'} />
 
        </div>
      </BackgroundGradient>
    );
  }

  return (
    <div
      className={`w-full lg:w-1/3  ${isVotable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={() => isVotable && onVote()}
    >
      <div className='flex flex-col justify-between'>
        <div className='flex items-center gap-2 justify-end mr-4'>
          <FaHeart color='#EC4899' /> 
          <p className='text-pink-500 md:text-xl lg:text-sm'>{`${optionVotes} ${optionVotes === 1 ? 'like' : 'likes'}`} </p>
        </div>
        <ImageComponent src={item.url} alt={item.title || 'Option'} />
     
      </div>
    </div>
  );
};

export default VoteItem;
