import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import Avatar from '../components/Avatar';
import GroupModal from '../components/GroupModal';
import { getName } from '../utils/helpers';
import './Groups.css';

export default function Groups() {
  const { state, dispatch } = useContext(AppContext);
  const [modal, setModal] = useState(null);
  const [editG, setEditG] = useState(null);

  const saveGroup = data => {
    if (editG) dispatch({ type: 'EDIT_GROUP', payload: { ...editG, ...data } });
    else dispatch({ type: 'ADD_GROUP', payload: { id: 'g' + Date.now(), ...data, created: new Date().toISOString().slice(0, 10) } });
    setModal(null);
    setEditG(null);
  };

  return (
    <div className="page-inner">
      <div className="groups-header">
        <div>
          <h1 className="pg-title">Groups</h1>
          <p className="pg-sub">{state.groups.length} active groups</p>
        </div>
        <button className="btn btn-prim btn-md" onClick={() => { setEditG(null); setModal('g'); }}>
          + New Group
        </button>
      </div>
      {state.groups.length === 0 && (
        <div className="empty">
          <div className="empty-ic">👥</div>
          <h3>No groups yet</h3>
          <p>Create your first group to start splitting</p>
        </div>
      )}
      <div className="gc-grid">
        {state.groups.map(g => {
          const gExp = state.expenses.filter(e => e.groupId === g.id);
          const tot = gExp.reduce((s, e) => s + e.amount, 0);
          const maxPossible = tot || 1;
          return (
            <div className="gc" key={g.id}>
              <div className="gc-header">
                <div className="gc-emoji">{g.emoji}</div>
                <div className="gc-actions">
                  <button className="btn btn-ghost btn-xs" onClick={() => { setEditG(g); setModal('g'); }}>✏️</button>
                  <button className="btn btn-ghost btn-xs" onClick={() => { if (window.confirm('Delete group?')) dispatch({ type: 'DELETE_GROUP', payload: g.id }); }}>🗑️</button>
                </div>
              </div>
              <div className="gc-name">{g.name}</div>
              <div className="gc-meta">{g.members.length} members · {gExp.length} expenses</div>
              <div className="gc-bar"><div className="gc-fill" style={{ width: `${Math.min(100, (tot / 50000) * 100)}%` }} /></div>
              <div className="avt-row">
                {g.members.slice(0, 5).map(m => <Avatar key={m} name={getName(state, m)} size="xs" />)}
                {g.members.length > 5 && <span className="badge bg-gray">+{g.members.length - 5}</span>}
              </div>
              <div className="gc-total">
                <span>Total spent</span>
                <span>₹{tot.toLocaleString('en-IN')}</span>
              </div>
            </div>
          );
        })}
      </div>
      {modal === 'g' && <GroupModal initial={editG} onSave={saveGroup} onClose={() => { setModal(null); setEditG(null); }} />}
    </div>
  );
}