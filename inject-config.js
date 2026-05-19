const fs = require('fs');

const replacements = {
  '__FB_API_KEY__':             process.env.FB_API_KEY,
  '__FB_AUTH_DOMAIN__':         process.env.FB_AUTH_DOMAIN,
  '__FB_DATABASE_URL__':        process.env.FB_DATABASE_URL,
  '__FB_PROJECT_ID__':          process.env.FB_PROJECT_ID,
  '__FB_STORAGE_BUCKET__':      process.env.FB_STORAGE_BUCKET,
  '__FB_MESSAGING_SENDER_ID__': process.env.FB_MESSAGING_SENDER_ID,
  '__FB_APP_ID__':              process.env.FB_APP_ID,
};

const missing = Object.entries(replacements).filter(([, v]) => !v).map(([k]) => k);
if (missing.length) {
  console.error('Missing Netlify env vars:', missing.join(', '));
  process.exit(1);
}

let html = fs.readFileSync('index.html', 'utf8');
for (const [placeholder, value] of Object.entries(replacements)) {
  html = html.replace(placeholder, value);
}
fs.writeFileSync('index.html', html);
console.log('Firebase config injected successfully.');
