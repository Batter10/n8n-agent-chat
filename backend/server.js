const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ROLES, hasPermission } = require('../src/config/roles');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Simuleer een simpele session store
const sessions = new Map();

// Webhook URLs van je n8n workflows
const N8N_WEBHOOKS = {
  ragAgent: 'https://n8n.your-domain.com/webhook/D7p5TNUzR4ETJWV5',
  qaAgent: 'https://n8n.your-domain.com/webhook/hyNelSzWkmWzDQFR'
};

// Middleware voor role-based access control
const checkRole = (requiredRole) => (req, res, next) => {
  const sessionId = req.headers['x-session-id'];
  const user = sessions.get(sessionId);
  
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (requiredRole && !hasPermission(user.role, requiredRole)) {
    return res.status(403).json({ error: 'Forbidden' });
  }

  req.user = user;
  next();
};

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // In productie zou je dit uit een database halen
  const users = require('../src/config/users').default;
  const user = users.find(u => u.email === email);

  if (!user || password !== 'test123') {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const sessionId = Math.random().toString(36).substring(7);
  sessions.set(sessionId, user);

  res.json({ sessionId, user });
});

// Document upload endpoint (alleen voor admins)
app.post('/api/upload', checkRole('manage_company_agents'), async (req, res) => {
  try {
    const response = await fetch(N8N_WEBHOOKS.ragAgent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        file: req.body.file,
        userId: req.user.id,
        companyId: req.user.companyId
      })
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Chat endpoint (voor alle gebruikers)
app.post('/api/chat', checkRole('use_agents'), async (req, res) => {
  try {
    const response = await fetch(N8N_WEBHOOKS.qaAgent, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: req.body.message,
        userId: req.user.id,
        companyId: req.user.companyId,
        sessionId: req.body.sessionId
      })
    });

    const result = await response.json();
    
    // Log de chat voor analyse
    console.log({
      timestamp: new Date(),
      userId: req.user.id,
      companyId: req.user.companyId,
      message: req.body.message,
      response: result
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});