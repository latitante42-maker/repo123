const express = require('express');
const cors = require('cors');
const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');

const app = express();
app.use(cors({ origin: '*' }));
const PORT = process.env.PORT || 3000;

app.get('/code', async (req, res) => {
  let number = "3926816361";
  if(req.query.number) number = req.query.number.replace(/\D/g,'');

  console.log('Richiesta per: ' + number);

  try {
    const { state, saveCreds } = await useMultiFileAuthState('./auth_' + number);
    const sock = makeWASocket({
      auth: state,
      printQRInTerminal: false,
      browser: ["Chrome", "Chrome", "1.0"]
    });

    sock.ev.on('creds.update', saveCreds);
    await new Promise(r => setTimeout(r, 3000));
    const code = await sock.requestPairingCode(number);
    
    console.log('CODICE: ' + code);
    res.json({ code: code, number: number });

  } catch (e) {
    console.log(e);
    res.json({ error: e.message });
  }
});

app.get('/', (req, res) => {
  res.send('Server per 3926816361 ON');
});

app.listen(PORT, () => console.log('Server ON ' + PORT));