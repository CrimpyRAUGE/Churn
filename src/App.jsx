import { useState, useEffect } from "react";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

const fonts = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=JetBrains+Mono:wght@300;400;500&display=swap');`;

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0e1a;
    --surface: #111827;
    --surface2: #1a2235;
    --border: #1e2d45;
    --accent: #00e5ff;
    --accent2: #ff6b6b;
    --accent3: #ffd166;
    --green: #06d6a0;
    --text: #e2e8f0;
    --muted: #64748b;
    --font-head: 'Syne', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }

  body { background: var(--bg); color: var(--text); font-family: var(--font-head); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 10% 20%, rgba(0,229,255,0.04) 0%, transparent 50%),
      radial-gradient(ellipse at 90% 80%, rgba(255,107,107,0.04) 0%, transparent 50%);
    padding: 0 0 80px;
  }

  .header {
    border-bottom: 1px solid var(--border);
    padding: 20px 40px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(17,24,39,0.8);
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 100;
  }

  .logo {
    font-size: 13px;
    font-family: var(--font-mono);
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
  }

  .logo span { color: var(--muted); }

  .badge {
    font-family: var(--font-mono);
    font-size: 11px;
    padding: 4px 10px;
    border-radius: 3px;
    background: rgba(0,229,255,0.08);
    border: 1px solid rgba(0,229,255,0.2);
    color: var(--accent);
    letter-spacing: 0.1em;
  }

  .main {
    max-width: 1100px;
    margin: 0 auto;
    padding: 60px 40px 0;
  }

  .hero { margin-bottom: 56px; }

  .hero-tag {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--accent);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .hero-tag::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1px;
    background: var(--accent);
  }

  .hero h1 {
    font-size: clamp(36px, 5vw, 58px);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: #fff;
    margin-bottom: 16px;
  }

  .hero h1 em { font-style: normal; color: var(--accent); }

  .hero p {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--muted);
    max-width: 480px;
    line-height: 1.8;
  }

  .grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    align-items: start;
  }

  .panel {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 12px;
    overflow: hidden;
  }

  .panel-header {
    padding: 20px 24px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .panel-title {
    font-size: 12px;
    font-family: var(--font-mono);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 8px var(--accent);
  }

  .panel-body { padding: 24px; }
  .field { margin-bottom: 20px; }

  .field label {
    display: block;
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: 0.12em;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  .field input, .field select {
    width: 100%;
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 11px 14px;
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s;
    -webkit-appearance: none;
  }

  .field input:focus, .field select:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(0,229,255,0.08);
  }

  .field select option { background: var(--surface); }
  .slider-wrap { display: flex; align-items: center; gap: 12px; }

  .field input[type=range] {
    padding: 0;
    border: none;
    background: none;
    accent-color: var(--accent);
    cursor: pointer;
    height: 4px;
    flex: 1;
  }

  .slider-val {
    font-family: var(--font-mono);
    font-size: 13px;
    color: var(--accent);
    min-width: 32px;
    text-align: right;
  }

  .btn {
    width: 100%;
    padding: 14px;
    background: var(--accent);
    color: #000;
    border: none;
    border-radius: 6px;
    font-family: var(--font-head);
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 4px;
  }

  .btn:hover { background: #33ecff; transform: translateY(-1px); }
  .btn:active { transform: translateY(0); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .score-section { margin-bottom: 28px; }

  .score-ring-wrap {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
    position: relative;
  }

  .score-ring {
    width: 160px;
    height: 160px;
    transform: rotate(-90deg);
  }

  .score-center {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  .score-num {
    font-size: 42px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: -0.03em;
  }

  .score-label {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-top: 4px;
  }

  .tier-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 8px 16px;
    border-radius: 4px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin: 0 auto 24px;
    display: flex;
    width: fit-content;
  }

  .tier-green { background: rgba(6,214,160,0.1); border: 1px solid rgba(6,214,160,0.3); color: var(--green); }
  .tier-yellow { background: rgba(255,209,102,0.1); border: 1px solid rgba(255,209,102,0.3); color: var(--accent3); }
  .tier-red { background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); color: var(--accent2); }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-bottom: 24px;
  }

  .metric-card {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px;
  }

  .metric-name {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    margin-bottom: 6px;
  }

  .metric-val {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }

  .metric-val span {
    font-size: 11px;
    font-family: var(--font-mono);
    color: var(--muted);
    font-weight: 400;
    margin-left: 3px;
  }

  .playbook {
    background: var(--surface2);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 18px;
  }

  .playbook-head {
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--accent);
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .playbook-head::before { content: '▶'; font-size: 8px; }

  .playbook-text {
    font-family: var(--font-mono);
    font-size: 12px;
    line-height: 1.9;
    color: #94a3b8;
    white-space: pre-wrap;
  }

  .loading-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    gap: 16px;
  }

  .spinner {
    width: 36px;
    height: 36px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .loading-text {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--muted);
    letter-spacing: 0.1em;
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
    text-align: center;
    gap: 12px;
  }

  .empty-icon { font-size: 36px; opacity: 0.3; margin-bottom: 4px; }
  .empty-title { font-size: 14px; font-weight: 600; color: var(--muted); }

  .empty-sub {
    font-family: var(--font-mono);
    font-size: 11px;
    color: #334155;
    line-height: 1.7;
    max-width: 220px;
  }

  .risk-bar-wrap { margin-bottom: 20px; }

  .risk-bar-label {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin-bottom: 6px;
  }

  .risk-bar-track {
    height: 6px;
    background: var(--border);
    border-radius: 3px;
    overflow: hidden;
  }

  .risk-bar-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.8s cubic-bezier(0.16,1,0.3,1);
  }

  @media (max-width: 768px) {
    .grid { grid-template-columns: 1fr; }
    .main { padding: 40px 20px 0; }
    .header { padding: 16px 20px; }
  }
`;

function getRiskColor(score) {
  if (score <= 33) return "#06d6a0";
  if (score <= 66) return "#ffd166";
  return "#ff6b6b";
}

function getRiskTier(score) {
  if (score <= 33) return { label: "Low Risk", cls: "tier-green", emoji: "✦" };
  if (score <= 66) return { label: "Medium Risk", cls: "tier-yellow", emoji: "◆" };
  return { label: "High Risk", cls: "tier-red", emoji: "⚠" };
}

function calcChurnScore(data) {
  let score = 0;
  const loginMap = { daily: 0, weekly: 15, monthly: 35, rarely: 55 };
  score += loginMap[data.loginFreq] ?? 30;
  const days = parseInt(data.daysSinceLogin) || 0;
  if (days > 30) score += 25;
  else if (days > 14) score += 15;
  else if (days > 7) score += 8;
  const tickets = parseInt(data.supportTickets) || 0;
  score += Math.min(tickets * 4, 20);
  const nps = parseInt(data.nps) || 5;
  score += Math.max(0, (10 - nps) * 2.5);
  const arr = parseInt(data.arr) || 0;
  if (arr < 5000) score += 5;
  const adoption = parseInt(data.featureAdoption) || 50;
  score += Math.max(0, (50 - adoption) * 0.3);
  return Math.min(100, Math.max(0, Math.round(score)));
}

function ScoreRing({ score }) {
  const color = getRiskColor(score);
  const r = 68;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  return (
    <div className="score-ring-wrap">
      <svg className="score-ring" viewBox="0 0 160 160">
        <circle cx="80" cy="80" r={r} fill="none" stroke="#1e2d45" strokeWidth="10" />
        <circle cx="80" cy="80" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeLinecap="round" strokeDasharray={`${fill} ${circ}`}
          style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: "stroke-dasharray 0.8s cubic-bezier(0.16,1,0.3,1)" }}
        />
      </svg>
      <div className="score-center">
        <div className="score-num" style={{ color }}>{score}</div>
        <div className="score-label">Risk Score</div>
      </div>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({
    customerName: "",
    plan: "growth",
    arr: "12000",
    loginFreq: "weekly",
    daysSinceLogin: "10",
    supportTickets: "2",
    nps: "7",
    featureAdoption: "60",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [aiText, setAiText] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  async function analyze() {
    setLoading(true);
    setResult(null);
    setAiText("");
    const score = calcChurnScore(form);
    const tier = getRiskTier(score);
    const prompt = `You are an expert Customer Success Manager at a B2B SaaS company.
A customer account has just been scored with a churn risk assessment. Provide a concise, actionable playbook.

Customer: ${form.customerName || "Unnamed Account"}
Plan: ${form.plan}
ARR: $${parseInt(form.arr).toLocaleString()}
Churn Risk Score: ${score}/100 (${tier.label})
Login frequency: ${form.loginFreq}
Days since last login: ${form.daysSinceLogin}
Open support tickets: ${form.supportTickets}
NPS score: ${form.nps}/10
Feature adoption: ${form.featureAdoption}%

Write a 3-step recommended action playbook for this CSM. Be specific, tactical, and use real CS language (EBR, QBR, champion, expansion, at-risk, etc). Keep it under 180 words. Format as:

STEP 1 — [Action Title]
[1-2 sentences]

STEP 2 — [Action Title]
[1-2 sentences]

STEP 3 — [Action Title]
[1-2 sentences]`;

    try {
      const res = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "Unable to generate playbook.";
      setAiText(text);
    } catch {
      setAiText("Unable to connect to AI. Check your API key.");
    }
    setResult({ score, tier, form: { ...form } });
    setLoading(false);
  }

  const score = result?.score ?? 0;
  const tier = result ? getRiskTier(score) : null;
  const color = getRiskColor(score);

  return (
    <>
      <style>{fonts + styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">Pulse<span>CS</span> — Churn Intelligence</div>
          <div className="badge">v1.0 · AI-Powered</div>
        </header>
        <main className="main">
          <div className="hero">
            <div className="hero-tag">Customer Success · Risk Analytics</div>
            <h1>Predict churn<br />before it <em>happens.</em></h1>
            <p>Input customer signals to generate an AI churn risk score and a personalized CSM action playbook.</p>
          </div>
          <div className="grid">
            <div className="panel">
              <div className="panel-header">
                <div className="dot" />
                <div className="panel-title">Customer Signals</div>
              </div>
              <div className="panel-body">
                <div className="field">
                  <label>Customer / Account Name</label>
                  <input type="text" placeholder="e.g. Acme Corp" value={form.customerName} onChange={e => set("customerName", e.target.value)} />
                </div>
                <div className="field">
                  <label>Plan Tier</label>
                  <select value={form.plan} onChange={e => set("plan", e.target.value)}>
                    <option value="starter">Starter</option>
                    <option value="growth">Growth</option>
                    <option value="pro">Pro</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>
                <div className="field">
                  <label>Annual Contract Value (ARR $)</label>
                  <input type="number" placeholder="12000" value={form.arr} onChange={e => set("arr", e.target.value)} />
                </div>
                <div className="field">
                  <label>Login Frequency</label>
                  <select value={form.loginFreq} onChange={e => set("loginFreq", e.target.value)}>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="rarely">Rarely</option>
                  </select>
                </div>
                <div className="field">
                  <label>Days Since Last Login — <span style={{color:"#00e5ff"}}>{form.daysSinceLogin}d</span></label>
                  <div className="slider-wrap">
                    <input type="range" min="0" max="90" value={form.daysSinceLogin} onChange={e => set("daysSinceLogin", e.target.value)} />
                    <span className="slider-val">{form.daysSinceLogin}</span>
                  </div>
                </div>
                <div className="field">
                  <label>Open Support Tickets — <span style={{color:"#00e5ff"}}>{form.supportTickets}</span></label>
                  <div className="slider-wrap">
                    <input type="range" min="0" max="20" value={form.supportTickets} onChange={e => set("supportTickets", e.target.value)} />
                    <span className="slider-val">{form.supportTickets}</span>
                  </div>
                </div>
                <div className="field">
                  <label>NPS Score (0–10) — <span style={{color:"#00e5ff"}}>{form.nps}</span></label>
                  <div className="slider-wrap">
                    <input type="range" min="0" max="10" value={form.nps} onChange={e => set("nps", e.target.value)} />
                    <span className="slider-val">{form.nps}</span>
                  </div>
                </div>
                <div className="field">
                  <label>Feature Adoption % — <span style={{color:"#00e5ff"}}>{form.featureAdoption}%</span></label>
                  <div className="slider-wrap">
                    <input type="range" min="0" max="100" value={form.featureAdoption} onChange={e => set("featureAdoption", e.target.value)} />
                    <span className="slider-val">{form.featureAdoption}%</span>
                  </div>
                </div>
                <button className="btn" onClick={analyze} disabled={loading}>
                  {loading ? "Analyzing..." : "Run Risk Analysis →"}
                </button>
              </div>
            </div>
            <div className="panel">
              <div className="panel-header">
                <div className="dot" style={{ background: result ? color : "#1e2d45", boxShadow: result ? `0 0 8px ${color}` : "none" }} />
                <div className="panel-title">Risk Assessment</div>
              </div>
              <div className="panel-body">
                {loading && (
                  <div className="loading-wrap">
                    <div className="spinner" />
                    <div className="loading-text">Running analysis...</div>
                  </div>
                )}
                {!loading && !result && (
                  <div className="empty">
                    <div className="empty-icon">◎</div>
                    <div className="empty-title">No analysis yet</div>
                    <div className="empty-sub">Fill in customer signals and run the analysis to see churn risk score + AI playbook.</div>
                  </div>
                )}
                {!loading && result && (
                  <>
                    <div className="score-section">
                      <ScoreRing score={score} />
                      <div className={`tier-badge ${tier.cls}`}>
                        <span>{tier.emoji}</span>
                        {tier.label}
                      </div>
                      <div className="risk-bar-wrap">
                        <div className="risk-bar-label">
                          <span>Low</span><span>Medium</span><span>High</span>
                        </div>
                        <div className="risk-bar-track">
                          <div className="risk-bar-fill" style={{ width: `${score}%`, background: color }} />
                        </div>
                      </div>
                    </div>
                    <div className="metrics-grid">
                      <div className="metric-card">
                        <div className="metric-name">ARR at Risk</div>
                        <div className="metric-val">${parseInt(result.form.arr || 0).toLocaleString()}<span>/yr</span></div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-name">NPS Score</div>
                        <div className="metric-val">{result.form.nps}<span>/10</span></div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-name">Feature Adoption</div>
                        <div className="metric-val">{result.form.featureAdoption}<span>%</span></div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-name">Days Inactive</div>
                        <div className="metric-val">{result.form.daysSinceLogin}<span>d</span></div>
                      </div>
                    </div>
                    {aiText && (
                      <div className="playbook">
                        <div className="playbook-head">AI Recommended Playbook</div>
                        <div className="playbook-text">{aiText}</div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
