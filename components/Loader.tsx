import React from 'react';

interface LoaderProps {
  isLarge?: boolean;
}

const Dot: React.FC<{ delay: string }> = ({ delay }) => (
    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: delay }} />
);

const Loader: React.FC<LoaderProps> = ({ isLarge = false }) => {
  const sizeClasses = isLarge ? 'text-2xl' : 'text-base';
  const colorClasses = isLarge ? 'text-teal-500 dark:text-teal-400' : 'text-white';
  
  return (
    <div className={`flex items-center justify-center space-x-1.5 ${sizeClasses} ${colorClasses}`}>
        <Dot delay="-0.3s" />
        <Dot delay="-0.15s" />
        <Dot delay="0s" />
    </div>
  );
};

export default Loader;