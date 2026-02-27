import { useState } from 'react';

const StarRating = ({ value, onChange, readonly = false, size = 'md' }) => {
  const [hovered, setHovered] = useState(0);

  const sizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`${sizes[size]} transition-transform ${
            !readonly ? 'hover:scale-125 cursor-pointer' : 'cursor-default'
          } ${
            star <= (hovered || value)
              ? 'text-yellow-400'
              : 'text-gray-300'
          }`}
        >
          ★
        </button>
      ))}
      {!readonly && value > 0 && (
        <span className="text-sm text-gray-500 ml-1">{value}/5</span>
      )}
    </div>
  );
};

export default StarRating;
