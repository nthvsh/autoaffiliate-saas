import { supabase } from '../../../config/database';

// Get all prompts for a workspace
export const getPrompts = async (workspaceId: string) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('category', { ascending: true });
  
  return { data, error };
};

// Get active prompts by category
export const getPromptsByCategory = async (workspaceId: string, category: string) => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*')
    .eq('workspace_id', workspaceId)
    .eq('category', category)
    .eq('is_active', true);
  
  return { data, error };
};

// Create a new prompt
export const createPrompt = async (workspaceId: string, name: string, category: string, promptText: string, variables: string[] = []) => {
  const { data, error } = await supabase
    .from('prompts')
    .insert([{
      workspace_id: workspaceId,
      name,
      category,
      prompt_text: promptText,
      variables,
      version: 1,
      is_active: true,
    }])
    .select();
  
  return { data, error };
};

// Update a prompt
export const updatePrompt = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from('prompts')
    .update(updates)
    .eq('id', id)
    .select();
  
  return { data, error };
};

// Delete a prompt
export const deletePrompt = async (id: string) => {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);
  
  return { error };
};

// Log prompt usage
export const logPromptUsage = async (promptId: string, contentId: string, success: boolean, tokenUsage: number = 0) => {
  const { error } = await supabase
    .from('prompt_logs')
    .insert([{
      prompt_id: promptId,
      content_id: contentId,
      success,
      token_usage: tokenUsage,
    }]);
  
  // Update prompt usage count
  if (success) {
    await supabase
      .from('prompts')
      .update({ usage_count: supabase.rpc('increment', { row_id: promptId }) })
      .eq('id', promptId);
  }
  
  return { error };
};