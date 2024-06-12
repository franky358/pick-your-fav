import React from 'react';
import { motion } from "framer-motion";
import { User } from '@supabase/supabase-js';
import VotingPanel from '../components/VotingPanel';
import Header from '../components/Header';
import Navbar from '../components/Navbar';

interface HomePageProps {
  user: User;
}

const HomePage: React.FC<HomePageProps> = ({ user }) => {


  return (
  <>
      <Navbar />
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

    </div>
  </>

     
  );
};

export default HomePage;
