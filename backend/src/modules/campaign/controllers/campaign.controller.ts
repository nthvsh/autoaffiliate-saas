import { Request, Response } from 'express';
import { supabase } from '../../../config/database';

export const runCampaign = async (req: Request, res: Response) => {
  try {
    const { country, niche, category, productName, affiliateLink, landingPage } = req.body;

    const { data, error } = await supabase
      .from('campaigns')
      .insert([{
        name: productName || 'Campaign',  // ✅ Yeh line add karein
        country,
        niche,
        category,
        product_name: productName,
        affiliate_link: affiliateLink,
        landing_page_url: landingPage,
        status: 'running',
        started_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;

    res.json({ success: true, campaignId: data[0].id, message: 'Campaign started!' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};