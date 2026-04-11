// src/components/common/Avatar.jsx

const colors = [
  'bg-[#004643] text-white',
  'bg-[#0F766E] text-white',
  'bg-amber-500 text-white',
  'bg-blue-500 text-white',
  'bg-purple-500 text-white',
];

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
};

const Avatar = ({ name = '', src = '', size = 'md', className = '' }) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const colorIndex = name.charCodeAt(0) % colors.length;

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover ring-2 ring-white dark:ring-[#143C3A] ${className}`}
      />
    );
  }

  return (
    <div
      className={`
        ${sizes[size]} ${colors[colorIndex]}
        rounded-full flex items-center justify-center
        font-semibold ring-2 ring-white dark:ring-[#143C3A]
        ${className}
      `}
    >
      {initials}
    </div>
  );
};

export default Avatar;