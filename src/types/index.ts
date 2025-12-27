import {
    DepartmentValue,
    EquipmentCategoryValue,
    EquipmentStatusValue,
    RequestTypeValue,
    RequestPriorityValue,
    RequestStatusValue,
    UserRoleValue,
    TeamMemberRoleValue,
} from '@/constants';

// User & Auth Types
export interface User {
    id: string;
    name: string;
    email: string;
    password: string; // hashed
    role: UserRoleValue;
    teamId?: string;
    avatar?: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface AuthPayload {
    userId: string;
    email: string;
    name: string;
    role: UserRoleValue;
    teamId?: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface AuthResponse {
    user: Omit<User, 'password'>;
    token: string;
}

// Equipment Types
export interface AssignedEmployee {
    id: string;
    name: string;
}

export interface Equipment {
    id: string;
    name: string;
    serialNumber: string;
    category: EquipmentCategoryValue;
    department: DepartmentValue;
    assignedEmployee?: AssignedEmployee;
    maintenanceTeamId: string;
    defaultTechnicianId: string;
    purchaseDate: string;
    warrantyExpiry?: string;
    location: string;
    status: EquipmentStatusValue;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

// Team Types
export interface TeamMember {
    id: string;
    userId: string;
    name: string;
    email: string;
    phone?: string;
    role: TeamMemberRoleValue;
    isAvailable: boolean;
}

export interface MaintenanceTeam {
    id: string;
    name: string;
    specialization: string;
    description?: string;
    members: TeamMember[];
    createdAt: string;
    updatedAt: string;
}

// Request Types
export interface MaintenanceRequest {
    id: string;
    subject: string;
    description: string;
    type: RequestTypeValue;
    priority: RequestPriorityValue;
    equipmentId: string;
    teamId: string;
    assignedTechnicianId?: string;
    status: RequestStatusValue;
    scheduledDate: string;
    completedDate?: string;
    duration?: number; // in minutes
    notes?: string;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

// Activity Log
export interface ActivityLog {
    id: string;
    type: 'equipment' | 'team' | 'request' | 'user';
    action: 'create' | 'update' | 'delete' | 'status_change';
    entityId: string;
    entityName: string;
    userId: string;
    userName: string;
    details?: string;
    createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
    totalEquipment: number;
    operationalEquipment: number;
    underMaintenanceEquipment: number;
    outOfServiceEquipment: number;
    totalRequests: number;
    openRequests: number;
    inProgressRequests: number;
    completedRequests: number;
    totalTeams: number;
    totalTechnicians: number;
}

// API Response Types
export interface ApiResponse<T> {
    data?: T;
    error?: string;
    message?: string;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Form Types
export type EquipmentFormData = Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>;
export type TeamFormData = Omit<MaintenanceTeam, 'id' | 'createdAt' | 'updatedAt' | 'members'>;
export type RequestFormData = Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt' | 'createdBy'>;
export type UserFormData = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;
