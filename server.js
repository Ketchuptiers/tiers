const express = require('express');
const fs = require('fs');
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

const DB = 'players.json';
const PASSWORD = '0204';
if (!fs.existsSync(DB)) fs.writeFileSync(DB, '[]');

app.get('/players', (req, res) => {
  res.json(JSON.parse(fs.readFileSync(DB)));
});

app.post('/players', (req, res) => {
  if (req.body.password !== PASSWORD) return res.status(401).json({ error: 'Wrong password' });
  const players = JSON.parse(fs.readFileSync(DB));
  const { name, tiers } = req.body;
  const idx = players.findIndex(p => p.name === name);
  if (idx >= 0) players[idx] = { name, tiers };
  else players.push({ name, tiers });
  fs.writeFileSync(DB, JSON.stringify(players));
  res.json({ ok: true });
});
