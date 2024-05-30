import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Option } from '../types';
import { User } from '@supabase/supabase-js';
import UserComparisons from '../components/UserComparison';
import { v4 as uuidv4 } from 'uuid';

interface UploadPageProps {
  user: User;
}

const UploadPage: React.FC<UploadPageProps> = ({ user }) => {
  const [comparisonTitle, setComparisonTitle] = useState('');
  const [options, setOptions] = useState<Option[]>([
    { id: uuidv4(), title: '', url: '' },
    { id: uuidv4(), title: '', url: '' },
  ]);
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
      const url = await uploadFile(file, index);
      const updatedOptions: Option[] = [...options];
      updatedOptions[index].url = url;
      setOptions(updatedOptions);
    }
  };

  const handleTitleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const updatedOptions: Option[] = [...options];
    updatedOptions[index].title = e.target.value;
    setOptions(updatedOptions);
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

  return (
    <div className="p-4">
      <h2 className="text-2xl mb-4">Crear Nueva Comparación</h2>
      <input
        type="text"
        placeholder="Título de la Comparación (opcional)"
        value={comparisonTitle}
        onChange={(e) => setComparisonTitle(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <h3 className="text-xl mb-4">Agregar Opciones</h3>
      {options.map((option, index) => (
        <div key={option.id} className="mb-4">
          <input
            type="text"
            placeholder={`Título de la Opción ${index + 1} (opcional)`}
            value={option.title}
            onChange={(e) => handleTitleChange(index, e)}
            className="mb-2 p-2 border rounded w-full"
          />
          <input
            type="file"
            accept="image/*,video/*"
            onChange={(e) => handleFileChange(index, e)}
            className="mb-2 p-2 border rounded w-full"
          />
          {option.url && (
            <div className="mb-2">
              <img src={option.url} alt={`Opción ${index + 1}`} className="w-full h-auto" />
            </div>
          )}
        </div>
      ))}
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white p-2 rounded w-full"
      >
        Crear Comparación
      </button>

      <UserComparisons userId={user.id} />
    </div>
  );
};

export default UploadPage;
