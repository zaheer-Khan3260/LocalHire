import React from 'react';
import { FaPen } from 'react-icons/fa';

const EditableComponent = ({ isEditing, value, onChange, label, as = "input" }) => {
  const InputComponent = as === "textarea" ? "textarea" : "input";

  return (
    <div className='relative group'>
      {isEditing ? (
        <InputComponent
        label={label}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-gray-600 text-gray-200 w-full mt-1 p-2 rounded"
        />
      ) : (
        <p className="font-medium text-gray-100">{value}</p>
      )}
      {!isEditing && (
        <FaPen
          className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-500 cursor-pointer text-blue-400'
        />
      )}
    </div>
  );
};

export default EditableComponent;