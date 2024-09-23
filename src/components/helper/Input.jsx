import React, {forwardRef} from 'react';


const InputComponent = forwardRef(
    (
      
        { 
            type, 
            placeholder, 
            label,  
            value,
            className,
            ...rest  // This will capture all other props
        }, 
        ref
    ) => {
  return (
    <div className="mb-4">
      <label htmlFor={label} className="block text-gray-700 font-semibold mb-2">
        {label}
      </label>
      <input
        id={label}
        type={type}
        placeholder={placeholder}
        value={value}
        ref={ref}
        className={`w-full rounded-lg px-3 py-2 shadow-xl focus:outline-none ${className}`}
        {...rest}  // This spreads all other props onto the input element
      />
    </div>
  );
})

export default InputComponent;