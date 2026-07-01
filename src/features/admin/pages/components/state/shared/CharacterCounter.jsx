import React from 'react';

const CharacterCounter = ({ value = "", maxLength }) => {
  const currentLength = value?.length || 0;
  const isNearLimit = currentLength > maxLength * 0.9;
  
  return (
    <div className={`text-xs mt-1 text-right ${isNearLimit ? 'text-red-500' : 'text-slate-400'}`}>
      {currentLength} / {maxLength}
    </div>
  );
};

export default CharacterCounter;
