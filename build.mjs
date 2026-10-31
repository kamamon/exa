// IMMERSE FIT のビルド（任意）: 1ファイル版のプレビュー dist/preview.html を作ります
// 使い方: npm install → npm run build
import { build } from 'esbuild';
import fs from 'node:fs';

const r = await build({ entryPoints: ['js/main.js'], bundle: true, format: 'esm', minify: true, write: false, logLevel: 'warning', charset: 'utf8' });
const code = r.outputFiles[0].text.replace(/<\/script/gi, '<\\/script');
const html = fs.readFileSync('index.html', 'utf8');
const style = html.match(/<style>[\s\S]*?<\/style>/)[0];
const body = html.match(/<body>([\s\S]*?)<\/body>/)[1].replace('<script type="module" src="js/main.js"></script>', '');
const fonts = html.match(/<link rel="stylesheet" href="https:\/\/fonts[^>]+>/)[0];
const out = `<title>IMMERSE FIT</title>
<meta name="claude:viewport-fit-sides" content="cover">
${fonts}
${style}
${body}
<script>window.__ARTIFACT__ = true;</script>
<script type="module">
${code}
</script>
`;
fs.mkdirSync('dist', { recursive: true });
fs.writeFileSync('dist/preview.html', out);
// 実写の映像（プレビューといっしょに置く）
fs.rmSync('dist/clips', { recursive: true, force: true }); fs.mkdirSync('dist/clips', { recursive: true });
let n = 0, kb = 0; for (const f of fs.readdirSync('clips')) if (f.endsWith('.mp4')) { fs.copyFileSync('clips/' + f, 'dist/clips/' + f); n++; kb += fs.statSync('clips/' + f).size / 1024; }
console.log('dist/clips', n, 'files', (kb / 1024).toFixed(1) + 'MB');
console.log('dist/preview.html', (out.length / 1024).toFixed(0) + 'KB');
