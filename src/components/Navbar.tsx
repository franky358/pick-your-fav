import React from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';


const Navbar: React.FC = () => {
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
    <nav className=" bg-gray-500 bg-opacity-15 backdrop-filter backdrop-blur-md p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-white text-xl font-bold">PICK IT</Link>
        <div className="flex space-x-4">
        <Link to="/" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Inicio
          </Link>
          <Link to="/upload" className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Crear
          </Link>
        
          <Link to="/" onClick={handleLogout} className="text-white hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
            Salir
          </Link>
       
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
