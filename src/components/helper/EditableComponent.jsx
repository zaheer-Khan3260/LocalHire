import React from 'react';
import { FaPen } from 'react-icons/fa';

const EditableComponent = ({ isUser, isEditing, onClick, placeholder, value, onChange, label, as = "input" }) => {
  const InputComponent = as === "textarea" ? "textarea" : "input";
  
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-300">{label}</label>
      {isEditing ? (
        <InputComponent
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-primaryCardColor text-gray-400 w-full mt-1 p-2 h-12 rounded"
          placeholder={placeholder}
        />
      ) : (
        <div className="flex items-center relative group">
          <span className="text-gray-300">{value}</span>
          <button onClick={onClick} className={`ml-2 text-blue-400 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 ${isUser ? "block" : "hidden"}`}>
            <FaPen />
          </button>
        </div>
      )}
    </div>
  );
};

export default EditableComponent;