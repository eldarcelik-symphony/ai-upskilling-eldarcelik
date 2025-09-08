'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const signInSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function signInAction(formData: z.infer<typeof signInSchema>) {
  try {
    // Validate the form data
    const validatedData = signInSchema.parse(formData);

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    if (data.user) {
      return {
        success: true,
        message: 'Signed in successfully',
      };
    }

    return {
      success: false,
      error: 'Failed to sign in',
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation error',
      };
    }

    return {
      success: false,
      error: 'An unexpected error occurred',
    };
  }
}
