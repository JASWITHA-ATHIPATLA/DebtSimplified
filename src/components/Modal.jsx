import React, { useEffect } from 'react';
import './Modal.css';

export default function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const fn = e => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', fn);
    return () => document.removeEventListener('keydown', fn);
  }, [onClose]);

  return (
    <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={wide ? { maxWidth: 620 } : {}}>
        <div className="modal-hd">
          <span className="modal-ttl">{title}</span>
          <button className="btn btn-ghost btn-sm" onClick={onClose}>
            ✕
          </button>
        </div>
        <div className="modal-bd">{children}</div>
      </div>
    </div>
  );
}