const express = require('express');
const cors = require('cors');
const app = express();
const importRoutes = require('./routes/import');
const authMiddleware = require('./middleware/auth');

app.use(cors());
app.use(express.json());

// Mock auth middleware (replace with real one)
app.use((req, res, next) => {
  req.user = { id: 'broker_123' }; // Simulating authenticated user
  next();
});

app.use('/api', importRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/realestate', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
