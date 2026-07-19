import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function App() {
  const [form, setForm] = useState({
    country: '',
    niche: '',
    category: '',
    productName: '',
    affiliateLink: '',
    landingPage: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post(`${API_URL}/api/campaign/run`, form);
      setMessage('✅ Campaign Started! ID: ' + res.data.campaignId);
    } catch (error: any) {
      setMessage('❌ Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '50px auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>🚀 Start Campaign</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label>Country</label>
          <select name="country" value={form.country} onChange={handleChange} required style={{ width: '100%', padding: 8 }}>
            <option value="">Select</option>
            <option value="United States">🇺🇸 United States</option>
            <option value="Canada">🇨🇦 Canada</option>
            <option value="United Kingdom">🇬🇧 United Kingdom</option>
            <option value="Australia">🇦🇺 Australia</option>
            <option value="New Zealand">🇳🇿 New Zealand</option>
            <option value="Germany">🇩🇪 Germany</option>
            <option value="Netherlands">🇳🇱 Netherlands</option>
            <option value="Sweden">🇸🇪 Sweden</option>
            <option value="Norway">🇳🇴 Norway</option>
            <option value="Denmark">🇩🇰 Denmark</option>
            <option value="Switzerland">🇨🇭 Switzerland</option>
            <option value="Finland">🇫🇮 Finland</option>
            <option value="Ireland">🇮🇪 Ireland</option>
            <option value="Singapore">🇸🇬 Singapore</option>
            <option value="United Arab Emirates">🇦🇪 United Arab Emirates</option>
          </select>
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Product Niche</label>
          <input name="niche" value={form.niche} onChange={handleChange} placeholder="e.g. Dental Health" required style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Product Category</label>
          <input name="category" value={form.category} onChange={handleChange} placeholder="e.g. Health & Fitness" required style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Product Name</label>
          <input name="productName" value={form.productName} onChange={handleChange} placeholder="e.g. ProDentim" required style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Affiliate Link</label>
          <input name="affiliateLink" value={form.affiliateLink} onChange={handleChange} placeholder="https://..." required style={{ width: '100%', padding: 8 }} />
        </div>

        <div style={{ marginBottom: 15 }}>
          <label>Landing Page Link</label>
          <input name="landingPage" value={form.landingPage} onChange={handleChange} placeholder="https://..." required style={{ width: '100%', padding: 8 }} />
        </div>

        <button type="submit" disabled={loading} style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 5, cursor: 'pointer' }}>
          {loading ? '⏳ Starting...' : '🚀 RUN'}
        </button>
      </form>
      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
}

export default App;
