import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface PageView {
  id: string;
  country: string;
  view_count: number;
  last_viewed: string;
  created_at: string;
}

export const Dashboard = () => {
  const [views, setViews] = useState<PageView[]>([]);
  const [loading, setLoading] = useState(true);
  const [campaignId, setCampaignId] = useState('');

  const fetchViews = async (id: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/analytics/views/${id}`);
      setViews(res.data.data || []);
    } catch (error) {
      console.error('Error fetching views:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (campaignId) {
      setLoading(true);
      fetchViews(campaignId);
    }
  };

  const totalViews = views.reduce((sum, v) => sum + v.view_count, 0);

  return (
    <div style={{ maxWidth: 800, margin: '50px auto', padding: 20, fontFamily: 'Arial' }}>
      <h2>📊 Campaign Dashboard</h2>
      
      <form onSubmit={handleSubmit} style={{ marginBottom: 30 }}>
        <input
          type="text"
          placeholder="Enter Campaign ID"
          value={campaignId}
          onChange={(e) => setCampaignId(e.target.value)}
          style={{ padding: 10, width: '70%', marginRight: 10 }}
        />
        <button type="submit" style={{ padding: '10px 20px', background: '#007bff', color: '#fff', border: 'none', borderRadius: 5 }}>
          Show Views
        </button>
      </form>

      {loading ? (
        <p>Loading views...</p>
      ) : (
        <>
          <div style={{ background: '#f0f4fb', padding: 20, borderRadius: 10, marginBottom: 20 }}>
            <h3>📈 Total Views: {totalViews}</h3>
          </div>

          {views.length === 0 ? (
            <p>No views recorded for this campaign yet.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#1a3a6b', color: '#fff' }}>
                  <th style={{ padding: 10, textAlign: 'left' }}>Country</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Views</th>
                  <th style={{ padding: 10, textAlign: 'left' }}>Last Viewed</th>
                </tr>
              </thead>
              <tbody>
                {views.map((view) => (
                  <tr key={view.id} style={{ borderBottom: '1px solid #ddd' }}>
                    <td style={{ padding: 10 }}>{view.country}</td>
                    <td style={{ padding: 10 }}><strong>{view.view_count}</strong></td>
                    <td style={{ padding: 10 }}>{new Date(view.last_viewed).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <div style={{ marginTop: 30, padding: 15, background: '#fef9ec', borderRadius: 10 }}>
        <p>💡 <strong>Tip:</strong> Campaign ID is shown after clicking RUN button.</p>
      </div>
    </div>
  );
};