import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Login.css';

export default function Login({ setPage }) {
  const { state, dispatch } = useContext(AppContext);
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Invalid email address';
    if (!pass) e.pass = 'Password is required';
    else if (pass.length < 6) e.pass = 'Minimum 6 characters';
    return e;
  };

  const submit = async () => {
    const e = validate();
    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const user = state.users.find(u => u.email === email && u.password === pass);
    if (!user) {
      setErrors({ general: 'Invalid email or password. Try demo credentials.' });
      setLoading(false);
      return;
    }
    dispatch({ type: 'LOGIN', payload: user });
    setPage('dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" style={{ top: '-100px', right: '-100px' }} />
      <div className="auth-box">
        <div className="auth-logo">S</div>
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to continue to Splitzy</p>
        <div className="demo-hint">
          🎯 <strong>Demo:</strong> rahul@demo.com / demo123
        </div>
        {errors.general && <div className="form-error" style={{ marginBottom: '.75rem', fontSize: 13 }}>⚠️ {errors.general}</div>}
        <div className="fg">
          <label className="form-label">Email address</label>
          <input className="form-input" type="email" value={email} onChange={e => { setEmail(e.target.value); setErrors({}); }} placeholder="you@example.com" />
          {errors.email && <div className="form-error">{errors.email}</div>}
        </div>
        <div className="fg">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" value={pass} onChange={e => { setPass(e.target.value); setErrors({}); }} placeholder="••••••••" />
          {errors.pass && <div className="form-error">{errors.pass}</div>}
        </div>
        <button className="btn-auth" onClick={submit} disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in →'}
        </button>
        <div className="auth-switch">Don't have an account? <span onClick={() => setPage('signup')}>Sign up</span></div>
      </div>
    </div>
  );
}