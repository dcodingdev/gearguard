import { z } from 'zod';
import { USER_ROLES } from '@/constants';

const roleValues = USER_ROLES.map(r => r.value) as [string, ...string[]];

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const userSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(roleValues, { errorMap: () => ({ message: 'Please select a role' }) }),
    teamId: z.string().optional(),
    avatar: z.string().url('Invalid avatar URL').optional(),
    isActive: z.boolean().default(true),
});

export const updateUserSchema = userSchema.partial().omit({ password: true }).extend({
    password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export type LoginSchemaType = z.infer<typeof loginSchema>;
export type UserSchemaType = z.infer<typeof userSchema>;
export type UpdateUserSchemaType = z.infer<typeof updateUserSchema>;
