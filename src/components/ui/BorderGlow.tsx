import React from 'react';
import './BorderGlow.css';

interface BorderGlowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  borderWidth?: string;
  borderRadius?: string;
  animationDuration?: string;
}

const BorderGlow: React.FC<BorderGlowProps> = ({
  children,
  className = "",
  glowColor = "#6366f1",
  borderWidth = "2px",
  borderRadius = "24px",
  animationDuration = "3s",
  ...props
}) => {
  return (
    <div
      className={`border-glow-container ${className}`}
      style={{
        '--glow-color': glowColor,
        '--border-width': borderWidth,
        '--border-radius': borderRadius,
        '--animation-duration': animationDuration,
        borderRadius: borderRadius
      } as React.CSSProperties}
      {...props}
    >
      <div className="border-glow-content">
        {children}
      </div>
      <div className="border-glow-overlay" />
    </div>
  );
};

export default BorderGlow;
