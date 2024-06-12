import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import VoteItem from './VoteItem';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Comparison } from '../types';
import { VotesResponse } from '../types';
import { ClipLoader } from 'react-spinners';

const VotingPanel: React.FC = () => {
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [userVotes, setUserVotes] = useState<{ [key: string]: string }>({});
  const [allVotes, setAllVotes] = useState<VotesResponse[]>([]);
  const [optimisticVotes, setOptimisticVotes] = useState<VotesResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const ERROR_MESSAGE = "Hubo un error descargando las comparaciones 😐, favor de intentar más tarde";

  useEffect(() => {
    const fetchComparisons = async () => {
      try {
        setIsLoading(true);
        const { data: comparisons, error } = await supabase.from('comparisons').select('*, options(*)');
        if (error) {
          throw new Error(ERROR_MESSAGE);
        } else {
          setComparisons(comparisons || []);
        }
      } catch (e) {
        setError(ERROR_MESSAGE);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchUserVotes = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: votes, error } = await supabase.from('votes').select('comparison_id, option_id').eq('user_id', user.id);

        if (error) {
          throw new Error(ERROR_MESSAGE);
        } else {
          const votesMap = votes.reduce((acc: { [key: string]: string }, vote: any) => {
            acc[vote.comparison_id] = vote.option_id;
            return acc;
          }, {});
          setUserVotes(votesMap);
        }
      } catch (e) {
        setError(ERROR_MESSAGE);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchOptionVotes = async () => {
      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: votes, error } = await supabase.from('votes').select('comparison_id, option_id');

        if (error) {
          throw new Error(ERROR_MESSAGE);
        } else {
          setAllVotes(votes);
        }
      } catch (e) {
        setError(ERROR_MESSAGE);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComparisons();
    fetchUserVotes();
    fetchOptionVotes();

    // Suscripción a actualizaciones en tiempo real
    const votesSubscription = supabase
      .channel('votes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'votes' }, (payload: any) => {
        setAllVotes((prevVotes) => [...prevVotes, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(votesSubscription);
    };
  }, []);

  const handleVote = async (comparisonId: string, optionId: string) => {
    const previousVotes = { ...userVotes };
    const optimisticVote = { comparison_id: comparisonId, option_id: optionId };

    // Actualizar optimisticamente los votos del usuario
    setUserVotes((prev) => ({ ...prev, [comparisonId]: optionId }));
    setOptimisticVotes((prev) => [...prev, optimisticVote]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { error } = await supabase.from('votes').insert({ user_id: user.id, comparison_id: comparisonId, option_id: optionId });

      if (error) {
        throw new Error(error.message);
      }
    } catch (e) {
      console.error(e);
      // Revertir el renderizado optimista en error
      setUserVotes(previousVotes);
      setOptimisticVotes((prev) => prev.filter((vote) => vote.comparison_id !== comparisonId || vote.option_id !== optionId));
      toast.error('Hubo un error emitiendo tu voto, favor de intentar más tarde', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const combinedVotes = [...allVotes, ...optimisticVotes];

  if (isLoading) return (
    <div className='h-screen w-screen flex justify-center items-start'>
      <ClipLoader color="#36d7b7" />
    </div>
  );

  if (error) return (
    <p className='text-white text-xl px-8 font-bold mt-16'>{error}</p>
  );

  return (
    <div className='mt-16 px-8 md:px-32'>
      <ToastContainer />
      {comparisons.map((comparison) => {
        const comparisonIdStr = String(comparison.id);
        const userVotedOptionId = userVotes[comparisonIdStr] || null;
        const pairVoted = userVotedOptionId !== null;
        const totalVotesComparison = combinedVotes.filter((vote) => vote.comparison_id === String(comparison.id)).length;

        return (
          <div key={comparisonIdStr} className="flex flex-col lg:flex-row lg:justify-between gap-6 p-8 mb-6 md:mb-12 bg-white bg-opacity-5 backdrop-filter backdrop-blur-md rounded-lg shadow-2xl border border-white border-opacity-30">
            {(comparison.options || []).map((option, i) => {
              const optionIdStr = String(option.id);
              const totalVotesOption = combinedVotes.filter((vote) => vote.option_id === String(option.id)).length;
              return (
                <>
                  <VoteItem
                    key={option.id}
                    item={option}
                    onVote={() => handleVote(comparisonIdStr, optionIdStr)}
                    isSelected={userVotedOptionId === optionIdStr}
                    isVotable={!pairVoted}
                    votesComparison={totalVotesComparison}
                    optionVotes={totalVotesOption}
                  />
                  {i % 2 === 0 &&
                    <div className='flex justify-center'>
                      <h1 className='text-white font-bold text-xl md:text-2xl lg:flex lg:items-center'>VS</h1>
                    </div>}
                </>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default VotingPanel;
