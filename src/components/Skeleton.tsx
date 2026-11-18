import { CSSProperties } from 'react';

export default function Skeleton({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <div 
      className={`animate-pulse bg-surface pixel-box ${className || ''}`}
      style={style}
    />
  );
}
