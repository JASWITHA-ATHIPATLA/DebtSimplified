import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import './Activity.css';

export default function Activity() {
  const { state } = useContext(AppContext);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? state.activity : state.activity.filter(a => a.type === filter);

  return (
    <div className="page-inner">
      <h1 className="pg-title">Activity</h1>
      <p className="pg-sub">Full history of all actions</p>

      <div className="tabs" style={{ maxWidth: 400 }}>
        {[
          ['all', 'All'],
          ['expense', 'Expenses'],
          ['group', 'Groups'],
          ['settle', 'Settlements'],
        ].map(([v, l]) => (
          <button
            key={v}
            className={`tab ${filter === v ? 'on' : ''}`}
            onClick={() => setFilter(v)}
          >
            {l}
          </button>
        ))}
      </div>

      <div className="card">
        <div className="card-bd-p0">
          {filtered.length === 0 && (
            <div className="empty">
              <div className="empty-ic">📋</div>
              <h3>No activity</h3>
            </div>
          )}
          {filtered.map(a => (
            <div className="act-item" key={a.id}>
              <div className="act-ic">{a.icon}</div>
              <div>
                <div className="act-txt">{a.text}</div>
                <div className="act-time">{a.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}