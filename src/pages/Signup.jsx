import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import './Signup.css';

export default function Signup({ setPage }) {
  const { dispatch } = useContext(AppContext);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Minimum 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
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
    const user = {
      id: 'me',
      name: form.name.trim(),
      email: form.email,
      password: form.password,
      avatar: form.name.trim().slice(0, 2).toUpperCase(),
    };
    dispatch({ type: 'SIGNUP', payload: user });
    setPage('dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" style={{ bottom: '-100px', left: '-100px' }} />
      <div className="auth-box">
        <div className="auth-logo">S</div>
        <h1 className="auth-title">Create account</h1>
        <p className="auth-sub">Start splitting expenses in seconds</p>
        {[
          { k: 'name', label: 'Full name', type: 'text', ph: 'Rahul Sharma' },
          { k: 'email', label: 'Email address', type: 'email', ph: 'you@example.com' },
          { k: 'password', label: 'Password', type: 'password', ph: 'Min. 6 characters' },
          { k: 'confirm', label: 'Confirm password', type: 'password', ph: 'Repeat password' },
        ].map(({ k, label, type, ph }) => (
          <div key={k} className="fg">
            <label className="form-label">{label}</label>
            <input className="form-input" type={type} value={form[k]} onChange={e => set(k, e.target.value)} placeholder={ph} />
            {errors[k] && <div className="form-error">{errors[k]}</div>}
          </div>
        ))}
        <button className="btn-auth" onClick={submit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create account →'}
        </button>
        <div className="auth-switch">Already have an account? <span onClick={() => setPage('login')}>Sign in</span></div>
      </div>
    </div>
  );
}