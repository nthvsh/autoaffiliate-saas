import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { supabase } from './config/database';
import authRoutes from './modules/saas/routes/auth.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'AutoAffiliate SaaS Backend Running' });
});

app.get('/api/test-db', async (req, res) => {
  const { data, error } = await supabase.from('users').select('count');
  if (error) {
    return res.status(500).json({ error: error.message });
  }
  res.json({ success: true, data });
});

app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});