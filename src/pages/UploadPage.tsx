import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Option } from '../types';
import { User } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

interface UploadPageProps {
  user: User;
}

const UploadPage: React.FC<UploadPageProps> = ({ user }) => {
  const [comparisonTitle, setComparisonTitle] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { id: uuidv4(), title: '', url: '' },
    { id: uuidv4(), title: '', url: '' },
  ]);
  const [loading, setLoading] = useState<number | null>(null);
  const navigate = useNavigate();

  const uploadFile = async (file: File, index: number) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${index}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('media')
      .upload(filePath, file);

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    if (!data.publicUrl) {
      throw new Error('Unable to get public URL');
    }

    return data.publicUrl;
  };

  const handleFileChange = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      setLoading(index);
      const url = await uploadFile(file, index);
      const updatedOptions: Option[] = [...options];
      updatedOptions[index].url = url;
      setOptions(updatedOptions);
      setLoading(null);
      toast('Imagen subida correctamente!', {
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

  const handleSubmit = async () => {
    if (options.every((option) => option.url)) {
      const { data: comparison, error } = await supabase
        .from('comparisons')
        .insert({ title: comparisonTitle, user_id: user.id })
        .select()
        .single();

      if (error || !comparison) {
        console.error(error);
        return;
      }

      const newOptions: Option[] = options.map((option) => ({
        ...option,
        comparison_id: comparison.id,
        user_id: user.id,
      }));

      const { error: optionsError } = await supabase.from('options').insert(newOptions);

      if (optionsError) {
        console.error(optionsError);
        return;
      }

      console.log('New Comparison:', comparison);
      setComparisonTitle('');
      setOptions([
        { id: uuidv4(), title: '', url: '' },
        { id: uuidv4(), title: '', url: '' },
      ]);

      navigate('/');
    } else {
      alert('Por favor, carga ambas opciones.');
    }
  };

  const isSubmitDisabled = options.some(option => !option.url);

  return (
    <>
   <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"/>
    <Navbar />
    <div className="px-8 mt-16 mb-16 md:max-w-md md:mx-auto lg:max-w-5xl">
      <h2 className="text-2xl mb-4 text-white mt-4 lg:mt-2 lg:text-center">Crear Nueva Comparación</h2>
 
      <h3 className="text-xl mt-8 text-white lg:text-center">Agregar Imágenes</h3>
      <div className='lg:flex lg:justify-around lg:gap-8'>

      {options.map((option, index) => (
        <div key={option.id} className="mb-4 mt-8 lg:w-1/2 lg:flex lg:flex-col lg:items-center lg:border  lg:border-gray-100 lg:border-dashed p-8 ">
          <label className='text-white'> Imagen {index + 1}</label>
          <div className="relative mt-4 lg:w-1/2">
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => handleFileChange(index, e)}
              className="hidden"
              id={`file-upload-${index}`}
              disabled={loading !== null}
            />
            <label
              htmlFor={`file-upload-${index}`}
              className={`block text-white text-center p-2 rounded cursor-pointer ${loading === index ? 'bg-gray-500' : 'bg-blue-500'}`}
            >
              {loading === index ? 'Subiendo...' : 'Seleccionar archivo'}
            </label>
          </div>
          {option.url && (
            <div className="w-full max-w-xs mx-auto lg:mx-0 mt-4">
              <img src={option.url} alt={`Opción ${index + 1}`} className="object-contain w-full h-60 md:h-72" />
            </div>
          )}
        </div>
      ))}
      </div>
      <div className='w-full flex justify-center'>  
         <button
        onClick={handleSubmit}
        className={`p-2 mt-16 rounded w-full lg:w-96   ${isSubmitDisabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-500 text-white'}`}
        disabled={isSubmitDisabled}
      >
        Crear Comparación
      </button>

      </div>
   
      {/* <UserComparisons userId={user.id} /> */}
    </div>
    </>
  );
};

export default UploadPage;
