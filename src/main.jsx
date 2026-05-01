import React from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import SpireClone from './App.jsx';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('React runtime error:', error, info);
  }

  render() {
    if (this.state.error) {
      return <CrashScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}

function CrashScreen({ error }) {
  return (
    <div style={{ minHeight: '100vh', background: '#050208', color: '#fef3c7', padding: 24, fontFamily: 'monospace', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div style={{ color: '#f59e0b', fontSize: 26, fontWeight: 800, marginBottom: 12 }}>MOBILE SPIRE ERROR</div>
      <div style={{ color: '#fecaca', fontSize: 14, whiteSpace: 'pre-wrap', lineHeight: 1.45 }}>{String(error && (error.stack || error.message || error))}</div>
    </div>
  );
}

window.addEventListener('error', function (event) {
  const root = document.getElementById('root');
  if (root && !root.dataset.rendered) {
    root.innerHTML = '<div style="min-height:100vh;background:#050208;color:#fef3c7;padding:24px;font-family:monospace;display:flex;flex-direction:column;justify-content:center"><div style="color:#f59e0b;font-size:26px;font-weight:800;margin-bottom:12px">MOBILE SPIRE JS ERROR</div><pre style="white-space:pre-wrap;color:#fecaca">' + String(event.error && (event.error.stack || event.error.message) || event.message).replace(/[<>&]/g, function(c){return {"<":"&lt;",">":"&gt;","&":"&amp;"}[c]}) + '</pre></div>';
  }
});

window.addEventListener('unhandledrejection', function (event) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = '<div style="min-height:100vh;background:#050208;color:#fef3c7;padding:24px;font-family:monospace;display:flex;flex-direction:column;justify-content:center"><div style="color:#f59e0b;font-size:26px;font-weight:800;margin-bottom:12px">MOBILE SPIRE PROMISE ERROR</div><pre style="white-space:pre-wrap;color:#fecaca">' + String(event.reason && (event.reason.stack || event.reason.message) || event.reason).replace(/[<>&]/g, function(c){return {"<":"&lt;",">":"&gt;","&":"&amp;"}[c]}) + '</pre></div>';
  }
});

const rootElement = document.getElementById('root');
rootElement.dataset.rendered = '1';
createRoot(rootElement).render(
  <ErrorBoundary>
    <SpireClone />
  </ErrorBoundary>
);
