#!/usr/bin/env bash
set -e
if [ -f App.jsx ]; then
  mkdir -p src
  cp App.jsx src/App.jsx
fi
npm install
npm run build
rm -rf app/src/main/assets/*
mkdir -p app/src/main/assets
python3 <<'PY'
from pathlib import Path

dist = Path('dist')
out = Path('app/src/main/assets')
assets = dist / 'assets'
js_files = sorted(assets.glob('*.js')) if assets.exists() else []
css_files = sorted(assets.glob('*.css')) if assets.exists() else []

if not js_files:
    raise SystemExit('No JS bundle found in dist/assets')

css = '\n'.join(p.read_text(encoding='utf-8') for p in css_files)
js = '\n;\n'.join(p.read_text(encoding='utf-8') for p in js_files)

html = '''<!doctype html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover">
<title>Mobile Spire</title>
<style>
html,body,#root{margin:0;width:100%;height:100%;overflow:hidden;background:#000;}
__CSS__
</style>
</head>
<body>
<div id="root"></div>
<script>
window.addEventListener('error', function(e) {
  var msg = String((e.error && (e.error.stack || e.error.message)) || e.message || e);
  document.body.innerHTML = '<pre style="white-space:pre-wrap;color:#fecaca;background:#050208;min-height:100vh;padding:16px;font-family:monospace">JS ERROR:\\n' + msg.replace(/[<>&]/g, function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c]}) + '</pre>';
});
window.addEventListener('unhandledrejection', function(e) {
  var msg = String((e.reason && (e.reason.stack || e.reason.message)) || e.reason || e);
  document.body.innerHTML = '<pre style="white-space:pre-wrap;color:#fecaca;background:#050208;min-height:100vh;padding:16px;font-family:monospace">PROMISE ERROR:\\n' + msg.replace(/[<>&]/g, function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;'}[c]}) + '</pre>';
});
</script>
<script>
__JS__
</script>
</body>
</html>
'''.replace('__CSS__', css).replace('__JS__', js)

(out / 'index.html').write_text(html, encoding='utf-8')
PY
