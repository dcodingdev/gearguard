import { z } from 'zod';
import { TEAM_MEMBER_ROLES } from '@/constants';

const memberRoleValues = TEAM_MEMBER_ROLES.map(r => r.value) as [string, ...string[]];

export const teamMemberSchema = z.object({
    userId: z.string().min(1, 'User is required'),
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    role: z.enum(['lead', 'technician']),
    isAvailable: z.boolean().default(true),
});

export const teamSchema = z.object({
    name: z.string().min(1, 'Team name is required').max(100, 'Name too long'),
    specialization: z.string().min(1, 'Specialization is required').max(100, 'Specialization too long'),
    description: z.string().max(500, 'Description too long').optional(),
});

export type TeamSchemaType = z.infer<typeof teamSchema>;
export type TeamMemberSchemaType = z.infer<typeof teamMemberSchema>;
