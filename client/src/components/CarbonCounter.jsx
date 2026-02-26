import { useState, useEffect, useRef } from 'react';

const CarbonCounter = ({ target, duration = 2000, label, unit = 'kg', color = 'text-green-500' }) => {
  const [count, setCount] = useState(0);
  const startTime = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (target === 0) return;

    const animate = (timestamp) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * target));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return (
    <div className="text-center p-6 bg-white rounded-2xl shadow-lg pulse-green">
      <div className={`text-5xl font-black ${color} animate-countup`}>
        {count.toLocaleString()}
        <span className="text-2xl ml-1">{unit}</span>
      </div>
      <div className="text-gray-500 mt-2 font-medium">{label}</div>
    </div>
  );
};

export default CarbonCounter;