import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Comparison, Option } from '../types';

interface UserComparisonsProps {
  userId: string;
}

interface OptionWithVotes extends Option {
  voteCount: number;
}

interface ComparisonWithVotes extends Comparison {
  options: OptionWithVotes[];
  totalVotes: number;
  votersCount: number;
}

const UserComparisons: React.FC<UserComparisonsProps> = ({ userId }) => {
  const [comparisons, setComparisons] = useState<ComparisonWithVotes[]>([]);

  useEffect(() => {
    const fetchUserComparisons = async () => {
      const { data: comparisons, error } = await supabase
        .from('comparisons')
        .select('*, options(*)')
        .eq('user_id', userId);
      if (error) {
        console.error(error);
      } else {
        const comparisonIds = comparisons.map((c: Comparison) => c.id);
        const { data: votes, error: votesError } = await supabase
          .from('votes')
          .select('comparison_id, option_id')
          .in('comparison_id', comparisonIds);
        if (votesError) {
          console.error(votesError);
        } else {
          const comparisonVotesMap = votes.reduce((acc: any, vote: any) => {
            if (!acc[vote.comparison_id]) {
              acc[vote.comparison_id] = { totalVotes: 0, voters: new Set(), options: {} };
            }
            acc[vote.comparison_id].totalVotes += 1;
            acc[vote.comparison_id].voters.add(vote.user_id);
            if (!acc[vote.comparison_id].options[vote.option_id]) {
              acc[vote.comparison_id].options[vote.option_id] = 0;
            }
            acc[vote.comparison_id].options[vote.option_id] += 1;
            return acc;
          }, {});

          const comparisonsWithVotes = comparisons.map((comparison: Comparison) => {
            const comparisonIdStr = String(comparison.id);
            const voteData = comparisonVotesMap[comparisonIdStr] || {
              totalVotes: 0,
              voters: new Set(),
              options: {},
            };

            const optionsWithVotes = (comparison.options || []).map((option: Option) => ({
              ...option,
              voteCount: voteData.options[option.id] || 0,
            }));

            return {
              ...comparison,
              options: optionsWithVotes,
              totalVotes: voteData.totalVotes,
              votersCount: voteData.voters.size,
            };
          });

          setComparisons(comparisonsWithVotes);
        }
      }
    };

    fetchUserComparisons();
  }, [userId]);

  return (
    <div className="mt-8">
      <h2 className="text-2xl mb-4">Tus Comparaciones</h2>
      {comparisons.length === 0 ? (
        <p>No has creado ninguna comparación aún.</p>
      ) : (
        comparisons.map((comparison) => (
          <div key={comparison.id} className="mb-8">
            {comparison.title && <h3 className="text-xl mb-2">{comparison.title}</h3>}
            <p>Total de votos: {comparison.totalVotes}</p>
            <p>Personas que han votado: {comparison.votersCount}</p>
            <div className="flex flex-col md:flex-row md:space-x-4">
              {(comparison.options || []).map((option) => (
                <div key={option.id} className="p-4 border rounded w-full md:w-1/2">
                  {option.title && <h4 className="text-lg">{option.title}</h4>}
                  <img src={option.url} alt={option.title || 'Option'} className="w-full h-auto" />
                  <p>Votos: {option.voteCount}</p>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default UserComparisons;
