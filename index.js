const express = require("express");
const cors = require("cors");
var admin = require("firebase-admin");
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json())

const serviceAccount = {
    "type": "service_account",
    "project_id": process.env.FIREBASE_PROJECT_ID,
    "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.FIREBASE_CLIENT_ID,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL
  };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const auth = async (req, res, next) => {
    const sessionCookie = req.cookies.session || '';
    try {
      const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
      const userRecord = await admin.auth().getUser(decodedClaims.uid);
      req.user = userRecord.toJSON();
      next();
    } catch (error) {
      res.status(401).json({ error: 'Invalid session cookie' });
    }
  };


app.post('/sessionInit', async (req, res) => {
    const authHeader = req.headers.authorization;
  
    if (!authHeader) {
      res.status(401).json({ error: 'Missing Authorization header' });
      return;
    }
  
    const idToken = authHeader.trim();
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
  
    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const sessionCookie = await admin.auth().createSessionCookie(idToken, { expiresIn });
      const expires = new Date(Date.now() + expiresIn);
  
      res.cookie('session', sessionCookie, { expires, httpOnly: true });
      res.json({ status: 'success' });
    } catch (error) {
      console.error('Failed to create session cookie:', error);
      res.status(401).json({ error: 'Failed to create a session cookie' });
    }
  });

  app.get('/protected', auth, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
  });

app.listen(3000, () => {
    console.log('Server started on port 3000');
  });