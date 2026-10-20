import { CSSProperties } from 'react';

export default function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div 
      className={`animate-pulse bg-[#FDF6E2] dark:bg-[#251A12] pixel-box ${className || ''}`}
      style={style}
    />
  );
}
