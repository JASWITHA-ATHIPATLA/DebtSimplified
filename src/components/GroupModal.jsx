import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import Modal from './Modal';
import { EMOJIS } from '../constants';
import { getName } from '../utils/helpers';
import './GroupModal.css';

export default function GroupModal({ initial, onSave, onClose }) {
  const { state } = useContext(AppContext);
  const [name, setName] = useState(initial?.name || '');
  const [emoji, setEmoji] = useState(initial?.emoji || '🏖️');
  const [members, setMembers] = useState(initial?.members || ['me']);
  const [newM, setNewM] = useState('');

  const addM = () => {
    const t = newM.trim();
    if (t && !members.includes(t)) {
      setMembers([...members, t]);
      setNewM('');
    }
  };

  return (
    <Modal title={initial ? 'Edit Group' : 'Create Group'} onClose={onClose}>
      <div className="fg">
        <label className="fl">Group Name *</label>
        <input className="fi" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Goa Trip" />
      </div>
      <div className="fg">
        <label className="fl">Pick Emoji</label>
        <div className="emoji-grid">
          {EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => setEmoji(e)}
              className={`emoji-option ${emoji === e ? 'active' : ''}`}
            >
              {e}
            </button>
          ))}
        </div>
      </div>
      <div className="fg">
        <label className="fl">Add Members</label>
        <div className="add-member-row">
          <input
            className="fi"
            style={{ flex: 1 }}
            value={newM}
            onChange={e => setNewM(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && addM()}
            placeholder="Type name and press Enter"
          />
          <button className="btn btn-sec btn-sm" onClick={addM}>
            Add
          </button>
        </div>
      </div>
      <div className="members-list">
        {members.map(m => (
          <span key={m} className="badge bg-gray member-badge">
            {getName(state, m)} {m !== 'me' && <span className="remove-member" onClick={() => setMembers(members.filter(x => x !== m))}>✕</span>}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <button className="btn btn-sec btn-md" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn btn-prim btn-md"
          onClick={() => {
            if (name.trim()) onSave({ name, emoji, members });
          }}
        >
          {initial ? 'Save Changes' : 'Create Group'}
        </button>
      </div>
    </Modal>
  );
}