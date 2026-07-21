import { supabase } from '../../../config/database';

export const trackPageView = async (campaignId: string, country: string) => {
  const { data: existing } = await supabase
    .from('page_views')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('country', country)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('page_views')
      .update({ 
        view_count: existing.view_count + 1,
        last_viewed: new Date().toISOString()
      })
      .eq('id', existing.id)
      .select();
    return { data, error };
  } else {
    const { data, error } = await supabase
      .from('page_views')
      .insert([{
        campaign_id: campaignId,
        country: country,
        view_count: 1,
        last_viewed: new Date().toISOString()
      }])
      .select();
    return { data, error };
  }
};

export const getPageViews = async (campaignId: string) => {
  const { data, error } = await supabase
    .from('page_views')
    .select('*')
    .eq('campaign_id', campaignId);
  return { data, error };
};
