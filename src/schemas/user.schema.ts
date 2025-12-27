import { z } from 'zod';
import { USER_ROLES } from '@/constants';

const roleValues = USER_ROLES.map(r => r.value) as [string, ...string[]];

export const userSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
    role: z.enum(roleValues),
    teamId: z.string().optional(),
    isActive: z.boolean(),
});

export type UserSchemaType = z.infer<typeof userSchema>;
