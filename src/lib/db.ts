import { User, Equipment, MaintenanceTeam, MaintenanceRequest, ActivityLog } from '@/types';
import { hashPassword } from './auth';

// Generate unique IDs
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// In-memory database for server-side operations
// This simulates a database - in production, use a real database

let users: User[] = [];
let equipment: Equipment[] = [];
let teams: MaintenanceTeam[] = [];
let requests: MaintenanceRequest[] = [];
let activityLog: ActivityLog[] = [];
let isSeeded = false;

// Seed data function
export function seedDatabase() {
    if (isSeeded) return;

    const now = new Date().toISOString();

    // Seed Users
    users = [
        {
            id: 'user-1',
            name: 'John Admin',
            email: 'admin@gearguard.com',
            password: hashPassword('admin123'),
            role: 'admin',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user-2',
            name: 'Sarah Manager',
            email: 'manager@gearguard.com',
            password: hashPassword('manager123'),
            role: 'manager',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user-3',
            name: 'Mike Technician',
            email: 'tech1@gearguard.com',
            password: hashPassword('tech123'),
            role: 'technician',
            teamId: 'team-1',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user-4',
            name: 'Lisa Technician',
            email: 'tech2@gearguard.com',
            password: hashPassword('tech123'),
            role: 'technician',
            teamId: 'team-1',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user-5',
            name: 'Tom Electrician',
            email: 'tech3@gearguard.com',
            password: hashPassword('tech123'),
            role: 'technician',
            teamId: 'team-2',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'user-6',
            name: 'Amy IT Support',
            email: 'tech4@gearguard.com',
            password: hashPassword('tech123'),
            role: 'technician',
            teamId: 'team-3',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
    ];

    // Seed Teams
    teams = [
        {
            id: 'team-1',
            name: 'Mechanics',
            specialization: 'Heavy Machinery & Vehicles',
            description: 'Expert team for all mechanical repairs and maintenance',
            members: [
                { id: 'member-1', userId: 'user-3', name: 'Mike Technician', email: 'tech1@gearguard.com', role: 'lead', isAvailable: true },
                { id: 'member-2', userId: 'user-4', name: 'Lisa Technician', email: 'tech2@gearguard.com', role: 'technician', isAvailable: true },
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'team-2',
            name: 'Electricians',
            specialization: 'Electrical Systems',
            description: 'Specialized in electrical repairs and installations',
            members: [
                { id: 'member-3', userId: 'user-5', name: 'Tom Electrician', email: 'tech3@gearguard.com', role: 'lead', isAvailable: true },
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'team-3',
            name: 'IT Support',
            specialization: 'Computer & Network',
            description: 'IT infrastructure and computer maintenance',
            members: [
                { id: 'member-4', userId: 'user-6', name: 'Amy IT Support', email: 'tech4@gearguard.com', role: 'lead', isAvailable: true },
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'team-4',
            name: 'Facilities',
            specialization: 'Building Maintenance',
            description: 'General facilities and building maintenance',
            members: [],
            createdAt: now,
            updatedAt: now,
        },
    ];

    // Seed Equipment
    equipment = [
        {
            id: 'equip-1',
            name: 'CNC Machine A1',
            serialNumber: 'CNC-2023-001',
            category: 'machine',
            department: 'production',
            maintenanceTeamId: 'team-1',
            defaultTechnicianId: 'user-3',
            purchaseDate: '2023-01-15',
            warrantyExpiry: '2026-01-15',
            location: 'Building A, Floor 1',
            status: 'operational',
            notes: 'Primary CNC for metal parts',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'equip-2',
            name: 'Forklift FL-01',
            serialNumber: 'FL-2022-045',
            category: 'vehicle',
            department: 'logistics',
            assignedEmployee: { id: 'emp-1', name: 'Bob Driver' },
            maintenanceTeamId: 'team-1',
            defaultTechnicianId: 'user-4',
            purchaseDate: '2022-06-20',
            warrantyExpiry: '2025-06-20',
            location: 'Warehouse B',
            status: 'operational',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'equip-3',
            name: 'Dell Workstation WS-15',
            serialNumber: 'DELL-WS-2024-015',
            category: 'computer',
            department: 'it',
            assignedEmployee: { id: 'emp-2', name: 'Alice Developer' },
            maintenanceTeamId: 'team-3',
            defaultTechnicianId: 'user-6',
            purchaseDate: '2024-02-10',
            warrantyExpiry: '2027-02-10',
            location: 'Office 3rd Floor',
            status: 'operational',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'equip-4',
            name: 'Industrial Press P-200',
            serialNumber: 'IP-2021-200',
            category: 'machine',
            department: 'production',
            maintenanceTeamId: 'team-1',
            defaultTechnicianId: 'user-3',
            purchaseDate: '2021-09-05',
            warrantyExpiry: '2024-09-05',
            location: 'Building A, Floor 2',
            status: 'under_maintenance',
            notes: 'Scheduled for bearing replacement',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'equip-5',
            name: 'HVAC Unit AC-3',
            serialNumber: 'HVAC-2020-003',
            category: 'other',
            department: 'facilities',
            maintenanceTeamId: 'team-2',
            defaultTechnicianId: 'user-5',
            purchaseDate: '2020-03-15',
            location: 'Rooftop Building A',
            status: 'operational',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'equip-6',
            name: 'Delivery Van V-02',
            serialNumber: 'VAN-2023-002',
            category: 'vehicle',
            department: 'logistics',
            assignedEmployee: { id: 'emp-3', name: 'Charlie Driver' },
            maintenanceTeamId: 'team-1',
            defaultTechnicianId: 'user-4',
            purchaseDate: '2023-07-01',
            warrantyExpiry: '2026-07-01',
            location: 'Parking Lot B',
            status: 'operational',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'equip-7',
            name: 'Server Rack SR-01',
            serialNumber: 'SRV-2022-001',
            category: 'computer',
            department: 'it',
            maintenanceTeamId: 'team-3',
            defaultTechnicianId: 'user-6',
            purchaseDate: '2022-11-20',
            warrantyExpiry: '2025-11-20',
            location: 'Server Room',
            status: 'operational',
            notes: 'Main server infrastructure',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'equip-8',
            name: 'Welding Station WS-02',
            serialNumber: 'WLD-2019-002',
            category: 'machine',
            department: 'production',
            maintenanceTeamId: 'team-2',
            defaultTechnicianId: 'user-5',
            purchaseDate: '2019-04-12',
            location: 'Building B, Floor 1',
            status: 'out_of_service',
            notes: 'Pending replacement parts',
            createdAt: now,
            updatedAt: now,
        },
    ];

    // Seed Requests
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();

    requests = [
        {
            id: 'req-1',
            subject: 'Oil leak in CNC Machine',
            description: 'Noticed oil leaking from the hydraulic system. Needs immediate attention.',
            type: 'corrective',
            priority: 'high',
            equipmentId: 'equip-1',
            teamId: 'team-1',
            assignedTechnicianId: 'user-3',
            status: 'in_progress',
            scheduledDate: now,
            createdBy: 'user-2',
            createdAt: yesterday,
            updatedAt: now,
        },
        {
            id: 'req-2',
            subject: 'Forklift annual inspection',
            description: 'Scheduled annual safety inspection and maintenance.',
            type: 'preventive',
            priority: 'medium',
            equipmentId: 'equip-2',
            teamId: 'team-1',
            status: 'new',
            scheduledDate: tomorrow,
            createdBy: 'user-2',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'req-3',
            subject: 'Workstation RAM upgrade',
            description: 'Upgrade RAM from 16GB to 32GB for better performance.',
            type: 'corrective',
            priority: 'low',
            equipmentId: 'equip-3',
            teamId: 'team-3',
            assignedTechnicianId: 'user-6',
            status: 'new',
            scheduledDate: nextWeek,
            createdBy: 'user-1',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: 'req-4',
            subject: 'Press bearing replacement',
            description: 'Replace worn bearings to prevent further damage.',
            type: 'corrective',
            priority: 'critical',
            equipmentId: 'equip-4',
            teamId: 'team-1',
            assignedTechnicianId: 'user-3',
            status: 'in_progress',
            scheduledDate: now,
            createdBy: 'user-2',
            createdAt: yesterday,
            updatedAt: now,
        },
        {
            id: 'req-5',
            subject: 'HVAC filter change',
            description: 'Quarterly filter replacement for AC units.',
            type: 'preventive',
            priority: 'low',
            equipmentId: 'equip-5',
            teamId: 'team-2',
            assignedTechnicianId: 'user-5',
            status: 'repaired',
            scheduledDate: yesterday,
            completedDate: now,
            duration: 45,
            createdBy: 'user-2',
            createdAt: yesterday,
            updatedAt: now,
        },
        {
            id: 'req-6',
            subject: 'Van oil change',
            description: 'Regular oil change and fluid check.',
            type: 'preventive',
            priority: 'medium',
            equipmentId: 'equip-6',
            teamId: 'team-1',
            status: 'new',
            scheduledDate: nextWeek,
            createdBy: 'user-2',
            createdAt: now,
            updatedAt: now,
        },
    ];

    isSeeded = true;
}

// Initialize database
seedDatabase();

// User operations
export function getUsers(): User[] {
    return users;
}

export function getUserById(id: string): User | undefined {
    return users.find(u => u.id === id);
}

export function getUserByEmail(email: string): User | undefined {
    return users.find(u => u.email === email);
}

export function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
    const newUser: User = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    users.push(newUser);
    return newUser;
}

export function updateUser(id: string, data: Partial<User>): User | null {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data, updatedAt: new Date().toISOString() };
    return users[index];
}

export function deleteUser(id: string): boolean {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
}

// Equipment operations
export function getEquipment(filters?: { department?: string; status?: string; search?: string }): Equipment[] {
    let result = equipment;
    if (filters?.department) {
        result = result.filter(e => e.department === filters.department);
    }
    if (filters?.status) {
        result = result.filter(e => e.status === filters.status);
    }
    if (filters?.search) {
        const search = filters.search.toLowerCase();
        result = result.filter(e =>
            e.name.toLowerCase().includes(search) ||
            e.serialNumber.toLowerCase().includes(search) ||
            e.location.toLowerCase().includes(search)
        );
    }
    return result;
}

export function getEquipmentById(id: string): Equipment | undefined {
    return equipment.find(e => e.id === id);
}

export function createEquipment(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Equipment {
    const newEquipment: Equipment = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    equipment.push(newEquipment);
    return newEquipment;
}

export function updateEquipment(id: string, data: Partial<Equipment>): Equipment | null {
    const index = equipment.findIndex(e => e.id === id);
    if (index === -1) return null;
    equipment[index] = { ...equipment[index], ...data, updatedAt: new Date().toISOString() };
    return equipment[index];
}

export function deleteEquipment(id: string): boolean {
    const index = equipment.findIndex(e => e.id === id);
    if (index === -1) return false;
    equipment.splice(index, 1);
    return true;
}

// Team operations
export function getTeams(): MaintenanceTeam[] {
    return teams;
}

export function getTeamById(id: string): MaintenanceTeam | undefined {
    return teams.find(t => t.id === id);
}

export function createTeam(data: Omit<MaintenanceTeam, 'id' | 'createdAt' | 'updatedAt' | 'members'>): MaintenanceTeam {
    const newTeam: MaintenanceTeam = {
        ...data,
        id: generateId(),
        members: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    teams.push(newTeam);
    return newTeam;
}

export function updateTeam(id: string, data: Partial<MaintenanceTeam>): MaintenanceTeam | null {
    const index = teams.findIndex(t => t.id === id);
    if (index === -1) return null;
    teams[index] = { ...teams[index], ...data, updatedAt: new Date().toISOString() };
    return teams[index];
}

export function deleteTeam(id: string): boolean {
    const index = teams.findIndex(t => t.id === id);
    if (index === -1) return false;
    teams.splice(index, 1);
    return true;
}

// Request operations
export function getRequests(filters?: { status?: string; type?: string; teamId?: string; equipmentId?: string }): MaintenanceRequest[] {
    let result = requests;
    if (filters?.status) {
        result = result.filter(r => r.status === filters.status);
    }
    if (filters?.type) {
        result = result.filter(r => r.type === filters.type);
    }
    if (filters?.teamId) {
        result = result.filter(r => r.teamId === filters.teamId);
    }
    if (filters?.equipmentId) {
        result = result.filter(r => r.equipmentId === filters.equipmentId);
    }
    return result;
}

export function getRequestById(id: string): MaintenanceRequest | undefined {
    return requests.find(r => r.id === id);
}

export function createRequest(data: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>): MaintenanceRequest {
    const newRequest: MaintenanceRequest = {
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    requests.push(newRequest);
    return newRequest;
}

export function updateRequest(id: string, data: Partial<MaintenanceRequest>): MaintenanceRequest | null {
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return null;
    requests[index] = { ...requests[index], ...data, updatedAt: new Date().toISOString() };
    return requests[index];
}

export function deleteRequest(id: string): boolean {
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return false;
    requests.splice(index, 1);
    return true;
}

// Activity log
export function getActivityLog(limit = 10): ActivityLog[] {
    return activityLog.slice(-limit).reverse();
}

export function addActivityLog(data: Omit<ActivityLog, 'id' | 'createdAt'>): void {
    activityLog.push({
        ...data,
        id: generateId(),
        createdAt: new Date().toISOString(),
    });
}

// Dashboard stats
export function getDashboardStats() {
    return {
        totalEquipment: equipment.length,
        operationalEquipment: equipment.filter(e => e.status === 'operational').length,
        underMaintenanceEquipment: equipment.filter(e => e.status === 'under_maintenance').length,
        outOfServiceEquipment: equipment.filter(e => e.status === 'out_of_service').length,
        totalRequests: requests.length,
        openRequests: requests.filter(r => r.status === 'new').length,
        inProgressRequests: requests.filter(r => r.status === 'in_progress').length,
        completedRequests: requests.filter(r => r.status === 'repaired').length,
        totalTeams: teams.length,
        totalTechnicians: users.filter(u => u.role === 'technician').length,
    };
}
