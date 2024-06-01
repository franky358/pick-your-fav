import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VoteItem from './VoteItem';
import { Comparison, Option } from '../types';
import { VotesResponse } from '../types';

const VotingPanel: React.FC = () => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [userVotes, setUserVotes] = useState<{ [key: string]: string }>({}); // Guarda los votos del usuario
  const [allVotes, setAllVotes] =  useState <VotesResponse[]> ([]);

  useEffect(() => {
    const fetchComparisons = async () => {
      const { data: comparisons, error } = await supabase
        .from('comparisons')
        .select('*, options(*)');
      if (error) {
        console.error(error);
      } else {
        setComparisons(comparisons || []);
      }
    };

    const fetchUserVotes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: votes, error } = await supabase
        .from('votes')
        .select('comparison_id, option_id')
        .eq('user_id', user.id);

      if (error) {
        console.error(error);
      } else {
        const votesMap = votes.reduce((acc: { [key: string]: string }, vote: any) => {
          acc[vote.comparison_id] = vote.option_id;
          return acc;
        }, {});
        setUserVotes(votesMap);
      }
    };

    const fetchOptionVotes = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data: votes, error } = await supabase
      .from('votes')
      .select('comparison_id, option_id')

    if (error) {
      console.error(error);
    } else {
      setAllVotes(votes);
    }

    }

    fetchComparisons();
    fetchUserVotes();
    fetchOptionVotes();
  }, []);

  const handleVote = async (comparisonId: string, optionId: string) => {
  
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to vote.');
      return;
    }

    // Check if user has already voted for this comparison
    if (userVotes[comparisonId]) {
      alert('You have already voted for this comparison.');
      return;
    }

    const { error } = await supabase
      .from('votes')
      .insert({ user_id: user.id, comparison_id: comparisonId, option_id: optionId });

    if (error) {
      console.error(error);
    } else {
      setUserVotes((prev) => ({ ...prev, [comparisonId]: optionId }));
    }
  };


  return (
    <div className='mt-16 px-8'>
      {comparisons.map((comparison) => {
        const comparisonIdStr = String(comparison.id);
        const userVotedOptionId = userVotes[comparisonIdStr] || null;
        const pairVoted = userVotedOptionId !== null;
        const totalVotesComparison = allVotes.filter((vote) => vote.comparison_id === String(comparison.id)).length

        return (
          <div key={comparisonIdStr} className="mb-6 border-b border-slate-800">
            <div className="flex flex-col md:flex-row ">
              {(comparison.options || []).map((option: Option, i: number) => {
                const optionIdStr = String(option.id);
                const totalVotesOption = allVotes.filter((vote) => vote.option_id === String(option.id)).length
                return (
                  <>
                  <div className={`px-4 ${userVotedOptionId === optionIdStr ? 'mt-4 mb-8' :''} ` }>
                  <VoteItem
                    key={option.id}
                    item={option}
                    onVote={() => handleVote(comparisonIdStr, optionIdStr)}
                    isSelected={userVotedOptionId === optionIdStr}
                    isVotable={!pairVoted}
                    votesComparison={totalVotesComparison}
                    optionVotes={totalVotesOption}
                  />
                  </div>
                  <div>
                  {i % 2 === 0 && 
                  <div className='mt-4 flex justify-center'>
                    <h1 className='text-white font-bold text-xl '>VS</h1>
                  </div>}
              
                  </div>
                  </>
                 

                  
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VotingPanel;
