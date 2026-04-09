import React, { useReducer, useEffect, useMemo, useState } from 'react';
import { AppContext } from './context/AppContext';
import { reducer, SEED } from './reducers/appReducer';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import Friends from './pages/Friends';
import Expenses from './pages/Expenses';
import Balance from './pages/Balance';
import Settle from './pages/Settle';
import Activity from './pages/Activity';
import './styles/global.css'; // global styles (resets, variables, utilities)

const stored = (() => {
  try {
    const d = localStorage.getItem('splitzy_v2');
    return d ? JSON.parse(d) : null;
  } catch {
    return null;
  }
})();

export default function App() {
  const [state, dispatch] = useReducer(reducer, stored || SEED);
  const [page, setPage] = useState('home');
  const ctx = useMemo(() => ({ state, dispatch }), [state]);

  useEffect(() => {
    localStorage.setItem('splitzy_v2', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', state.theme);
  }, [state.theme]);

  const isLoggedIn = !!state.user;

  useEffect(() => {
    if (!isLoggedIn && !['home', 'login', 'signup'].includes(page)) setPage('home');
    if (isLoggedIn && ['home', 'login', 'signup'].includes(page)) setPage('dashboard');
  }, [isLoggedIn, page]);

  const PAGE_MAP = {
    dashboard: Dashboard,
    groups: Groups,
    friends: Friends,
    expenses: Expenses,
    balance: Balance,
    settle: Settle,
    activity: Activity,
  };
  const PageComp = PAGE_MAP[page];

  return (
    <AppContext.Provider value={ctx}>
      <div className={`app ${state.theme === 'dark' ? 'dk' : 'lt'}`}>
        <Navbar page={page} setPage={setPage} isLoggedIn={isLoggedIn} />
        {!isLoggedIn ? (
          page === 'login' ? (
            <Login setPage={setPage} />
          ) : page === 'signup' ? (
            <Signup setPage={setPage} />
          ) : (
            <Landing setPage={setPage} />
          )
        ) : (
          <div className="shell">
            <Sidebar page={page} setPage={setPage} />
            <div className="main-content">
              {PageComp ? <PageComp setPage={setPage} /> : <Dashboard setPage={setPage} />}
            </div>
          </div>
        )}
      </div>
    </AppContext.Provider>
  );
}