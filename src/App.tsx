import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import UploadPage from './pages/UploadPage';
import { User } from '@supabase/supabase-js';
import HomePage from './pages/HomePage';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isEmailConfirmed, setIsEmailConfirmed] = useState<boolean | null>(null);
  const darkMode = true;

  useEffect(() => {
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
      } else {
        const user = data?.session?.user ?? null;
        setUser(user);
        setIsEmailConfirmed(user?.email_confirmed_at ? true : false);
      }
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setUser(user);
      setIsEmailConfirmed(user?.email_confirmed_at ? true : false);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  if (isEmailConfirmed === null) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={user && isEmailConfirmed ? <HomePage user={user} /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={user && isEmailConfirmed ? <UploadPage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
