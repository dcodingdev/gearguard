import { z } from 'zod';
import { REQUEST_TYPES, REQUEST_PRIORITY, REQUEST_STATUS } from '@/constants';

const typeValues = REQUEST_TYPES.map(t => t.value) as [string, ...string[]];
const priorityValues = REQUEST_PRIORITY.map(p => p.value) as [string, ...string[]];
const statusValues = REQUEST_STATUS.map(s => s.value) as [string, ...string[]];

export const requestSchema = z.object({
    subject: z.string().min(1, 'Subject is required').max(200, 'Subject too long'),
    description: z.string().min(1, 'Description is required').max(2000, 'Description too long'),
    type: z.enum(typeValues, { errorMap: () => ({ message: 'Please select a request type' }) }),
    priority: z.enum(priorityValues, { errorMap: () => ({ message: 'Please select a priority' }) }),
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
