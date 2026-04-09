import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Avatar from './Avatar';
import './Sidebar.css';

const PAGES_NAV = [
  { id: 'dashboard', icon: '📊', label: 'Dashboard' },
  { id: 'groups', icon: '👥', label: 'Groups' },
  { id: 'friends', icon: '🤝', label: 'Friends' },
  { id: 'expenses', icon: '💸', label: 'Expenses' },
  { id: 'balance', icon: '⚖️', label: 'Balances' },
  { id: 'settle', icon: '✅', label: 'Settle Up' },
  { id: 'activity', icon: '📋', label: 'Activity' },
];

export default function Sidebar({ page, setPage }) {
  const { state, dispatch } = useContext(AppContext);
  return (
    <aside className="sidebar">
      <nav className="s-nav">
        {PAGES_NAV.map(p => (
          <button
            key={p.id}
            className={`s-item ${page === p.id ? 'active' : ''}`}
            onClick={() => setPage(p.id)}
          >
            <span className="s-icon">{p.icon}</span>
            <span>{p.label}</span>
          </button>
        ))}
      </nav>
      <div className="s-footer">
        <div className="s-user">
          <Avatar name={state.user?.name} size="sm" />
          <div>
            <div className="s-user-name">{state.user?.name?.split(' ')[0]}</div>
            <div className="s-user-email">{state.user?.email}</div>
          </div>
        </div>
        <button
          className="btn btn-ghost btn-sm btn-full"
          style={{ marginTop: 8 }}
          onClick={() => dispatch({ type: 'TOGGLE_THEME' })}
        >
          {state.theme === 'dark' ? '☀️ Light mode' : '🌙 Dark mode'}
        </button>
      </div>
    </aside>
  );
}