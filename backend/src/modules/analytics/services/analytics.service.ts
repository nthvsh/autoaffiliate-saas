import { supabase } from '../../../config/database';

// Get campaign stats
export const getCampaignStats = async (campaignId: string) => {
  // Total audience found
  const { count: totalAudience } = await supabase
    .from('audience')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId);

  // Replies sent
  const { count: totalReplies } = await supabase
    .from('content')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId)
    .eq('type', 'reply');

  // Conversions
  const { count: totalConversions } = await supabase
    .from('audience')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId)
    .eq('converted', true);

  // Revenue
  const { data: revenueData } = await supabase
    .from('campaigns')
    .select('revenue')
    .eq('id', campaignId)
    .single();

  const audienceCount = totalAudience || 0;
  const conversions = totalConversions || 0;

  return {
    totalAudience: audienceCount,
    totalReplies: totalReplies || 0,
    totalConversions: conversions,
    revenue: revenueData?.revenue || 0,
    conversionRate: audienceCount > 0 ? (conversions / audienceCount) * 100 : 0,
  };
};

// Get funnel analytics
export const getFunnelAnalytics = async (campaignId: string) => {
  // WhatsApp stats
  const { count: whatsappStarted } = await supabase
    .from('whatsapp_conversations')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId);

  // Email stats
  const { count: emailStarted } = await supabase
    .from('email_sequences')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId);

  // Email completed
  const { count: emailCompleted } = await supabase
    .from('email_sequences')
    .select('*', { count: 'exact', head: true })
    .eq('campaign_id', campaignId)
    .eq('status', 'completed');

  return {
    whatsappStarted: whatsappStarted || 0,
    emailStarted: emailStarted || 0,
    emailCompleted: emailCompleted || 0,
  };
};

// Get content performance
export const getContentPerformance = async (campaignId: string) => {
  const { data, error } = await supabase
    .from('content')
    .select('*')
    .eq('campaign_id', campaignId)
    .eq('type', 'reply')
    .order('engagement_score', { ascending: false })
    .limit(10);

  if (error) return [];
  return data || [];
};