import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Avatar from './Avatar';
import './Navbar.css';

export default function Navbar({ page, setPage, isLoggedIn }) {
  const { state, dispatch } = useContext(AppContext);
  return (
    <nav className="navbar">
      <div className="nav-brand" onClick={() => setPage('home')}>
        <div className="nav-logo">S</div>
        <span className="nav-brand-name">Splitzy</span>
      </div>
      <div className="nav-links">
        {!isLoggedIn ? (
          <>
            <button className="nav-link" onClick={() => setPage('home')}>
              Home
            </button>
            <button className="nav-link" onClick={() => setPage('login')}>
              Login
            </button>
            <button className="nav-cta" onClick={() => setPage('signup')}>
              Get Started →
            </button>
          </>
        ) : (
          <>
            <button className="nav-link" onClick={() => dispatch({ type: 'TOGGLE_THEME' })}>
              {state.theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Avatar name={state.user?.name} size="sm" />
            <button
              className="nav-link"
              onClick={() => {
                dispatch({ type: 'LOGOUT' });
                setPage('home');
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}