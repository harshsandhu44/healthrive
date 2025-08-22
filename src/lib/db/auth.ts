import { createClient } from './server';

export async function getCurrentUser() {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function getCurrentUserProfile() {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return null;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, account_type, avatar_url, updated_at')
      .eq('id', user.id)
      .single();

    return profile;
  } catch (error) {
    console.error('Error getting user profile:', error);
    return null;
  }
}

export async function getSession() {
  const supabase = await createClient();
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

export async function getUserWithProfile() {
  const supabase = await createClient();
  
  try {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { user: null, profile: null };
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('id, account_type, avatar_url, updated_at')
      .eq('id', user.id)
      .single();

    return { user, profile };
  } catch (error) {
    console.error('Error getting user with profile:', error);
    return { user: null, profile: null };
  }
}