import React from 'react';
import { useNavigate } from 'react-router-dom';
import VotingPanel from '../components/VotingPanel';
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';

interface HomePageProps {
  user: User;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      navigate('/');
    }
  };

  console.log(user);

  return (
    <div className='bg-black'>
      <main className="py-4 px-6">
        <VotingPanel />
        <button
          onClick={() => navigate('/upload')}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Crear Nueva Comparación
        </button>
      </main>
      <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded"
          >
            Cerrar Sesión
      </button>
    </div>
  );
};

export default HomePage;
