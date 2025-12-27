import { z } from 'zod';
import { DEPARTMENTS, EQUIPMENT_CATEGORIES, EQUIPMENT_STATUS } from '@/constants';

// Helper to create enum from const array
const departmentValues = ['production', 'it', 'admin', 'logistics', 'maintenance', 'quality', 'facilities', 'sales'] as const;
const categoryValues = ['machine', 'vehicle', 'computer', 'other'] as const;
const statusValues = ['operational', 'under_maintenance', 'out_of_service', 'scrapped'] as const;

export const equipmentSchema = z.object({
    name: z.string().min(1, 'Equipment name is required').max(100, 'Name too long'),
    serialNumber: z.string().min(1, 'Serial number is required').max(50, 'Serial number too long'),
    category: z.enum(categoryValues),
    department: z.enum(departmentValues),
    assignedEmployee: z.object({
        id: z.string(),
        name: z.string(),
    }).optional(),
    maintenanceTeamId: z.string().min(1, 'Please select a maintenance team'),
    defaultTechnicianId: z.string().min(1, 'Please select a default technician'),
    purchaseDate: z.string().min(1, 'Purchase date is required'),
    warrantyExpiry: z.string().optional(),
    location: z.string().min(1, 'Location is required').max(200, 'Location too long'),
    status: z.enum(statusValues).default('operational'),
    notes: z.string().max(500, 'Notes too long').optional(),
});

export type EquipmentSchemaType = z.infer<typeof equipmentSchema>;
