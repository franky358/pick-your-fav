import React, { useState } from 'react';
import { Option } from "../types";
import { v4 as uuidv4 } from 'uuid';

interface UploadProps {
  onUpload: (newOption: Option) => void;
}

const Upload: React.FC<UploadProps> = ({ onUpload }) => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreview(null);
    }
  };

  const handleUpload = () => {
    if (file) {
      const newOption: Option = {
        id: uuidv4(), // Generar un nuevo uuid para cada opción
        title: title,
        url: preview || '',
      };
      onUpload(newOption);
      setTitle('');
      setFile(null);
      setPreview(null);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="text-xl mb-4">Upload New Option</h2>
      <input
        type="text"
        placeholder="Title (optional)"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-4 p-2 border rounded w-full"
      />
      <input
        type="file"
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="mb-4 p-2 border rounded w-full"
      />
      {preview && (
        <div className="mb-4">
          <img src={preview} alt="Preview" className="w-full h-auto" />
        </div>
      )}
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Upload
      </button>
    </div>
  );
};

export default Upload;
