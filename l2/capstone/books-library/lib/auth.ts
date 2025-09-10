import { createClient } from '@/lib/supabase/server';
import { Role, ApprovalStatus } from '@/lib/supabase/types';
import { ROLES } from '@/lib/constants';

// Re-export ROLES for backward compatibility
export { ROLES };

// Constants for approval status values
export const APPROVAL_STATUS: Record<ApprovalStatus, ApprovalStatus> = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

// Type definitions for the user data we'll return
export type UserWithRole = {
  id: string;
  email: string;
  role: Role;
  approval_status: ApprovalStatus;
  created_at: string;
  updated_at: string;
};

export type AuthUser = {
  id: string;
  email?: string;
  role: Role;
  user_metadata?: Record<string, unknown>;
  app_metadata?: Record<string, unknown>;
};

/**
 * Server-side utility to fetch the current authenticated user with their role and approval status.
 * This function encapsulates the logic of joining auth.users with the users table.
 * 
 * @returns Promise<UserWithRole | null> - The user data with role and approval status, or null if not authenticated
 * @throws Error if there's a database error
 */
export async function getUserWithRole(): Promise<UserWithRole | null> {
  try {
    const supabase = await createClient();
    
    // Get the current authenticated user from Supabase Auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('Error getting authenticated user:', authError);
      return null;
    }
    
    if (!user) {
      return null;
    }
    
    // Query the users table to get the full user data including role and approval status
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, role, approval_status, created_at, updated_at')
      .eq('id', user.id)
      .single();
    
    if (userError) {
      console.error('Error fetching user data:', userError);
      return null;
    }
    
    if (!userData) {
      console.warn(`User ${user.id} not found in users table`);
      return null;
    }
    
    return userData as UserWithRole;
  } catch (error) {
    console.error('Unexpected error in getUserWithRole:', error);
    return null;
  }
}

