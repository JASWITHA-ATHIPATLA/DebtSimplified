import React, { useContext, useMemo } from 'react';
import { AppContext } from '../context/AppContext';
import { computeNetBalances, simplifyDebts } from '../utils/balance';
import { getName } from '../utils/helpers';
import Avatar from '../components/Avatar';
import './Balance.css';

export default function Balance() {
  const { state } = useContext(AppContext);
  const net = useMemo(() => computeNetBalances(state.expenses, state.settlements), [state.expenses, state.settlements]);
  const txns = useMemo(() => simplifyDebts(net), [net]);
  const myDebts = txns.filter(t => t.from === 'me');
  const owedMe = txns.filter(t => t.to === 'me');
  const others = txns.filter(t => t.from !== 'me' && t.to !== 'me');

  const groupBalances = state.groups.map(g => {
    const gExp = state.expenses.filter(e => e.groupId === g.id);
    const gNet = computeNetBalances(gExp, []);
    const gTxns = simplifyDebts(gNet);
    const youOwe = gTxns.filter(t => t.from === 'me').reduce((s, t) => s + t.amount, 0);
    const youOwed = gTxns.filter(t => t.to === 'me').reduce((s, t) => s + t.amount, 0);
    return { ...g, youOwe, youOwed, net: youOwed - youOwe };
  });

  const SectionHead = ({ title, color }) => (
    <div
      style={{
        fontSize: 12,
        fontWeight: 700,
        color,
        textTransform: 'uppercase',
        letterSpacing: '0.6px',
        marginBottom: '0.75rem',
        marginTop: '1rem',
      }}
    >
      {title}
    </div>
  );

  const DebtCard = ({ t, highlight }) => (
    <div className="settle-c" style={highlight ? { borderColor: highlight } : {}}>
      <Avatar name={getName(state, t.from)} size="md" />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700 }}>
          <span style={{ color: '#ef4444' }}>{getName(state, t.from)}</span> →{' '}
          <span style={{ color: 'var(--brand)' }}>{getName(state, t.to)}</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2 }}>Suggested payment</div>
      </div>
      <Avatar name={getName(state, t.to)} size="md" />
      <div className="amt-neg" style={{ fontSize: 16, fontWeight: 800 }}>
        ₹{t.amount.toLocaleString('en-IN')}
      </div>
    </div>
  );

  return (
    <div className="page-inner">
      <h1 className="pg-title">Balance Summary</h1>
      <p className="pg-sub">Debt‑simplified payment suggestions</p>

      <div className="stat-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
        <div className="stat-c">
          <div className="stat-lbl">You Owe</div>
          <div className="stat-val red">
            ₹{myDebts.reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="stat-c">
          <div className="stat-lbl">Owed to You</div>
          <div className="stat-val grn">
            ₹{owedMe.reduce((s, t) => s + t.amount, 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
          </div>
        </div>
        <div className="stat-c">
          <div className="stat-lbl">Others</div>
          <div className="stat-val">{others.length} transactions</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
        <div>
          <SectionHead title="You owe" color="#ef4444" />
          {myDebts.length === 0 && (
            <div className="card">
              <div className="card-bd">
                <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: '0.5rem' }}>
                  ✅ Nothing to pay!
                </div>
              </div>
            </div>
          )}
          {myDebts.map((t, i) => (
            <DebtCard key={i} t={t} highlight="#ef4444" />
          ))}

          <SectionHead title="Owed to you" color="var(--brand)" />
          {owedMe.length === 0 && (
            <div className="card">
              <div className="card-bd">
                <div style={{ textAlign: 'center', color: 'var(--text3)', fontSize: 13, padding: '0.5rem' }}>
                  ✅ Nobody owes you
                </div>
              </div>
            </div>
          )}
          {owedMe.map((t, i) => (
            <DebtCard key={i} t={t} highlight="var(--brand)" />
          ))}

          {others.length > 0 && (
            <>
              <SectionHead title="Between others" color="var(--text3)" />
              {others.map((t, i) => (
                <DebtCard key={i} t={t} />
              ))}
            </>
          )}
        </div>

        <div>
          <SectionHead title="By Group" color="var(--text2)" />
          {groupBalances.map(g => (
            <div key={g.id} className="card" style={{ marginBottom: '0.75rem' }}>
              <div className="card-bd">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: 24 }}>{g.emoji}</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>{g.name}</span>
                </div>
                {g.net === 0 ? (
                  <div style={{ fontSize: 13, color: 'var(--text3)' }}>All settled ✓</div>
                ) : (
                  <>
                    {g.youOwe > 0 && (
                      <div className="amt-neg" style={{ fontSize: 14 }}>
                        You owe ₹{g.youOwe.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    )}
                    {g.youOwed > 0 && (
                      <div className="amt-pos" style={{ fontSize: 14 }}>
                        You get ₹{g.youOwed.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}