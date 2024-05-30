import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VoteItem from './VoteItem';
import { Comparison, Option } from '../types';

const VotingPanel: React.FC = () => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [votes, setVotes] = useState<{ [key: string]: string }>({}); // Guarda los votos del usuario

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

    const fetchVotes = async () => {
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
        setVotes(votesMap);
      }
    };

    fetchComparisons();
    fetchVotes();
  }, []);

  const handleVote = async (comparisonId: string, optionId: string) => {
  
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert('Please log in to vote.');
      return;
    }

    // Check if user has already voted for this comparison
    if (votes[comparisonId]) {
      alert('You have already voted for this comparison.');
      return;
    }

    const { error } = await supabase
      .from('votes')
      .insert({ user_id: user.id, comparison_id: comparisonId, option_id: optionId });

    if (error) {
      console.error(error);
    } else {
      setVotes((prev) => ({ ...prev, [comparisonId]: optionId }));
    }
  };

  console.log(comparisons);
  console.log(votes);

  return (
    <div>
      {comparisons.map((comparison) => {
        const comparisonIdStr = String(comparison.id);
        const userVotedOptionId = votes[comparisonIdStr] || null;
        const pairVoted = userVotedOptionId !== null;
        return (
          <div key={comparisonIdStr} className="mb-8">
            <div className="flex flex-col md:flex-row md:space-x-4">
              {(comparison.options || []).map((option: Option) => {
                const optionIdStr = String(option.id);
                return (
                  <VoteItem
                    key={option.id}
                    item={option}
                    onVote={() => handleVote(comparisonIdStr, optionIdStr)}
                    isSelected={userVotedOptionId === optionIdStr}
                    isVotable={!pairVoted}
                  />
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
