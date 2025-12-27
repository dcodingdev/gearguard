import { z } from 'zod';
import { REQUEST_TYPES, REQUEST_PRIORITY, REQUEST_STATUS } from '@/constants';

const typeValues = ['corrective', 'preventive'] as const;
const priorityValues = ['low', 'medium', 'high', 'critical'] as const;
const statusValues = ['new', 'in_progress', 'repaired', 'cancelled', 'scrap'] as const;

export const requestSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
    type: z.enum(typeValues),
    priority: z.enum(priorityValues),
    equipmentId: z.string().min(1, 'Please select equipment'),
    teamId: z.string().min(1, 'Please select a team'),
    assignedTechnicianId: z.string().optional(),
    status: z.enum(statusValues),
    scheduledDate: z.string().min(1, 'Scheduled date is required'),
    completedDate: z.string().optional(),
    duration: z.number().min(0).optional(),
    notes: z.string().max(1000, 'Notes too long').optional(),
});

export type RequestSchemaType = z.infer<typeof requestSchema>;
