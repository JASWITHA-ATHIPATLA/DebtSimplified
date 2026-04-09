import React from 'react';
import { getAC } from '../constants';
import './Avatar.css';

export default function Avatar({ name, size = 'md' }) {
  const [bg, col] = getAC(name);
  const cls = {
    xs: 'av-xs',
    sm: 'av-sm',
    md: 'av-md',
    lg: 'av-lg',
    xl: 'av-xl',
  }[size];
  return (
    <div className={`av ${cls}`} style={{ background: bg, color: col }}>
      {(name || '?').slice(0, 2).toUpperCase()}
    </div>
  );
}