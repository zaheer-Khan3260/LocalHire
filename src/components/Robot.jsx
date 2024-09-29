import React, { useState, useEffect } from 'react';
import Spline from '@splinetool/react-spline';

function Robot() {
  const [isLoading, setIsLoading] = useState(true);

  const handleSplineLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className='relative'>
      <div className='w-36 h-12 bg-[rgb(227,227,227)] absolute bottom-3 right-4'></div>
      {isLoading && (
        <div className="flex items-center justify-center h-full">
          <p>Loading...</p>
        </div>
      )}
      <Spline
        scene="https://prod.spline.design/GyU8QnuWOeBdT2OZ/scene.splinecode"
        onLoad={handleSplineLoad}
        style={{ display: isLoading ? 'none' : 'block' }}
      />
    </div>
  );
}

export default Robot;
