import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import VotingPanel from '../components/VotingPanel';
import Header from '../components/Header';


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


  return (

    <div className='bg-black'>
      <Header />
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center"
      >
      <main className="w-full">
        <VotingPanel />
   
      </main>
      </motion.div>

      {/* <button
          onClick={() => navigate('/upload')}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Crear Nueva Comparación
        </button>
      <button
            onClick={handleLogout}
            className="bg-red-500 text-white p-2 rounded"
          >
            Cerrar Sesión
      </button> */}
    </div>
     
  );
};

export default HomePage;
