import { supabase } from './supabaseClient';

// Helper function to save log after Groq AI processes input
export async function saveLog(activity, score, recommendation) {
  const { data, error } = await supabase
    .from('activity_logs')
    .insert([
      { 
        user_activity: activity, 
        carbon_score: score, 
        ai_recommendation: recommendation 
      }
    ])
    .select(); // Adding .select() returns the inserted row back

  if (error) {
    console.error('Error saving log to Supabase:', error.message);
    return { success: false, error };
  }
  
  console.log('Saved successfully to Supabase:', data);
  return { success: true, data };
}

// Helper function to fetch logs for your UI
export async function fetchLogs() {
  const { data, error } = await supabase
    .from('activity_logs')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching logs from Supabase:', error.message);
    return [];
  }
  
  return data;
}