import React from 'react';
import Avatar from '../components/Avatar';
import './Landing.css';

export default function Landing({ setPage }) {
  const TESTIMONIALS = [
    { text: "Splitzy made our Goa trip planning so effortless. No more awkward money talks!", name: "Ananya Krishnan", role: "Product Designer, Bengaluru", stars: 5 },
    { text: "I use it every month with my flatmates for rent and utilities. Super clean UI!", name: "Rohan Verma", role: "Software Engineer, Mumbai", stars: 5 },
    { text: "The debt simplification feature is brilliant. Saves so many transactions.", name: "Meera Iyer", role: "Startup Founder, Chennai", stars: 5 },
  ];

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="hero-glow1" /><div className="hero-glow2" />
        <div className="hero-inner">
          <div className="hero-text">
            <div className="hero-badge">✨ Free to use · No credit card needed</div>
            <h1 className="hero-h1">Split expenses.<br /><span>Stay friends.</span></h1>
            <p className="hero-desc">Stop doing mental math at the end of every trip. Splitzy tracks who paid what, who owes whom, and makes settling up feel effortless.</p>
            <div className="hero-actions">
              <button className="btn-hero btn-hero-primary" onClick={() => setPage("signup")}>Start for free →</button>
              <button className="btn-hero btn-hero-outline" onClick={() => setPage("login")}>Sign in</button>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-title">Balance Summary</div>
            {[["Rahul","owes you","₹2,400",true],["You","owe Sneha","₹800",false],["Arjun","owes you","₹1,200",true]].map(([n,l,a,pos],i) => (
              <div key={i} className={`balance-pill ${pos?"bp-green":"bp-red"}`}>
                <span className="balance-pill-name">{n} {l}</span>
                <span className={`balance-pill-amt ${pos?"bpg":"bpr"}`}>{a}</span>
              </div>
            ))}
            <div className="hero-stats">
              <div><div className="hero-stat-val">₹28K+</div><div className="hero-stat-lab">Tracked this month</div></div>
              <div><div className="hero-stat-val">3 Groups</div><div className="hero-stat-lab">Active now</div></div>
              <div><div className="hero-stat-val">12 Txns</div><div className="hero-stat-lab">Simplified to 4</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <div className="hiw-bg">
        <section className="section">
          <div style={{ textAlign: "center", marginBottom: ".5rem" }}>
            <span className="section-tag">HOW IT WORKS</span>
          </div>
          <h2 className="section-title" style={{ textAlign: "center" }}>Three steps to financial<br />harmony with friends</h2>
          <div className="hiw-grid">
            {[
              { n:"1", icon:"👥", title:"Create a group", desc:"Add your friends, flatmates, or colleagues to a shared group. Name it, pick an emoji, and you're ready to go." },
              { n:"2", icon:"💸", title:"Add expenses", desc:"Log any expense — split equally, by exact amounts, or by percentage. Works for any situation." },
              { n:"3", icon:"✅", title:"Settle balances", desc:"Our smart algorithm minimises the number of payments needed. One tap to mark as paid." },
            ].map((s, i) => (
              <div key={i} className="hiw-card" style={{ animationDelay: `${i*.1}s` }}>
                {i < 2 && <span className="hiw-connector">→</span>}
                <div className="hiw-num">{s.n}</div>
                <div className="hiw-icon">{s.icon}</div>
                <div className="hiw-title">{s.title}</div>
                <p className="hiw-desc">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* TESTIMONIALS */}
      <section className="section">
        <span className="section-tag">LOVED BY USERS</span>
        <h2 className="section-title">What our users say</h2>
        <div className="testi-grid">
          {TESTIMONIALS.map((t,i) => (
            <div key={i} className="testi-card">
              <div className="testi-stars">{"★".repeat(t.stars)}</div>
              <p className="testi-text">"{t.text}"</p>
              <div className="testi-author">
                <Avatar name={t.name} size="sm" />
                <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{ padding: "0 2rem 5rem" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", background: "linear-gradient(135deg,#0d1117,#0d2818)", borderRadius: 24, padding: "3rem", textAlign: "center", position: "relative", overflow: "hidden" }}>
          <div style={{ position:"absolute",inset:0,background:"radial-gradient(ellipse at center,rgba(0,179,126,.2) 0%,transparent 70%)",pointerEvents:"none" }} />
          <h2 style={{ fontSize:"clamp(1.5rem,3vw,2.25rem)",fontWeight:800,color:"#fff",marginBottom:".75rem",letterSpacing:"-.5px" }}>Ready to split smarter?</h2>
          <p style={{ color:"#94a3b8",fontSize:16,marginBottom:"2rem" }}>Join thousands of users who've said goodbye to awkward money conversations.</p>
          <button className="btn-hero btn-hero-primary" onClick={() => setPage("signup")}>Create free account →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-name">Splitzy</div>
            <p className="footer-brand-desc">The smartest way to split expenses with friends, family, and colleagues. Built for India.</p>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            {["Features","How it works","Pricing","Changelog"].map(l=><div key={l} className="footer-link">{l}</div>)}
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            {["About us","Blog","Careers","Press"].map(l=><div key={l} className="footer-link">{l}</div>)}
          </div>
          <div>
            <div className="footer-col-title">Contact</div>
            <div className="footer-link">hello@splitzy.in</div>
            <div className="footer-link">+91 98765 43210</div>
            <div className="footer-link">Twitter / X</div>
            <div className="footer-link">Instagram</div>
          </div>
        </div>
        <div className="footer-bottom">
          <span className="footer-copy">© 2024 Splitzy. All rights reserved.</span>
          <div style={{ display:"flex",gap:"1rem" }}>
            {["Privacy Policy","Terms of Service","Cookie Policy"].map(l=><span key={l} className="footer-link" style={{ fontSize:13 }}>{l}</span>)}
          </div>
        </div>
      </footer>
    </div>
  );
}