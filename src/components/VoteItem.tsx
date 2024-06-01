import React from 'react';
import { Option } from "../types";
import { BackgroundGradient } from './ui/background-gradient';
import ImageComponent from './ImageComponent';
import ProgressBar from './ui/ProgressBar';
import { FaHeart } from "react-icons/fa";


interface VoteItemProps {
  item: Option;
  onVote: () => void;
  isSelected: boolean;
  isVotable: boolean;
  votesComparison: number;
  optionVotes : number;
}

const VoteItem: React.FC<VoteItemProps> = ({ item, onVote, isSelected, isVotable, votesComparison, optionVotes }) => {

if(isSelected) return (
  <BackgroundGradient className="rounded-[22px] max-w-sm  bg-white dark:bg-zinc-900">
    <div className='flex flex-col justify-between'>
    <div className='flex items-center gap-2 justify-end mt-4 mr-3'>
    <FaHeart color='#EC4899' /> 

    <p className='text-pink-500 '>{`${optionVotes} ${optionVotes === 1 ? 'like' : 'likes'}`} </p>
    </div>
    <ImageComponent src={item.url} alt={item.title || 'Option'} />
    
    <div className='flex h-16 mt-8'>
    <ProgressBar votesComparison={votesComparison} optionVotes={optionVotes}  />

    </div>

    </div>
    
    </BackgroundGradient>
)



  return (
    <div
      className={`rounded w-full md:w-1/2 cursor-pointer pt-4 
       ${isVotable ? 'cursor-pointer' : 'cursor-not-allowed'}`}
      onClick={() => isVotable && onVote()}
    >
    <div className='flex flex-col justify-between'>
    <div className='flex items-center gap-2 justify-end mt-4 mr-3'>
    <FaHeart color='#EC4899' /> 

    <p className='text-pink-500 '>{`${optionVotes} ${optionVotes === 1 ? 'like' : 'likes'}`} </p>
    </div>
    <ImageComponent src={item.url} alt={item.title || 'Option'} />
    
    <div className='flex h-16 mt-8'>
    <ProgressBar votesComparison={votesComparison} optionVotes={optionVotes}  />

    </div>

    </div>    </div>
  );
};

export default VoteItem;


