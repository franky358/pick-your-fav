// src/pages/HomePage.tsx
import React from 'react';
import Header from '../components/Header';
import VotingPanel from '../components/VotingPanel';

const HomePage: React.FC = () => {
  return (
    <div>
      <Header />
      <main className="p-4">
        <VotingPanel />
      </main>
    </div>
  );
};

export default HomePage;
