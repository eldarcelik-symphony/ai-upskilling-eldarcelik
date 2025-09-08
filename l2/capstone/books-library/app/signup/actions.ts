'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const signUpSchema = z
  .object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export async function signUpAction(formData: z.infer<typeof signUpSchema>) {
  try {
    // Validate the form data
    const validatedData = signUpSchema.parse(formData);

    const supabase = await createClient();

    const { data, error } = await supabase.auth.signUp({
      email: validatedData.email,
      password: validatedData.password,
    });

    if (error) {
      console.error('Supabase auth error:', error);
      return {
        success: false,
        error: error.message,
      };
    }

    if (data.user) {
      // Check if the trigger created the user record
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (userError) {
        console.error('User record creation error:', userError);
        return {
          success: false,
          error: `User created but user record creation failed: ${userError.message}`,
        };
      }

      return {
        success: true,
        message:
          'Account created successfully. Please check your email to verify your account.',
      };
    }

    return {
      success: false,
      error: 'Failed to create account',
    };
  } catch (error) {
    console.error('Signup action error:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.errors[0]?.message || 'Validation error',
      };
    }

    return {
      success: false,
      error: `An unexpected error occurred: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`,
    };
  }
}
