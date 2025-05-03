'use client';

export default function AnimatedBackground() {
  return (
    <div
      className="absolute inset-0 z-0"
      style={{
        background: 'linear-gradient(150deg, #fdfdfe 0%, #fbfbfc 100%)'
      }}
    />
  );
} 