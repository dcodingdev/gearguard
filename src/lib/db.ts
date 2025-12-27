import dbConnect from './mongodb';
import {
    UserModel,
    EquipmentModel,
    MaintenanceTeamModel,
    MaintenanceRequestModel,
    ActivityLogModel
} from './models';
import { User, Equipment, MaintenanceTeam, MaintenanceRequest, ActivityLog } from '@/types';
import { hashPassword } from './auth';

function mapDocument<T>(doc: any, seen = new WeakSet()): T {
    if (!doc || typeof doc !== 'object') return doc;

    if (Array.isArray(doc)) {
        return doc.map(d => mapDocument(d, seen)) as any;
    }

    // Handle Date, ObjectId, and other special types
    if (doc instanceof Date) return doc as any;
    if (doc._bsontype === 'ObjectID' || doc.constructor?.name === 'ObjectId') {
        return doc.toString() as any;
    }

    if (seen.has(doc)) return doc;
    seen.add(doc);

    // If it's not a plain object, don't recurse (e.g. Buffer, etc)
    if (doc.constructor && doc.constructor !== Object) {
        // But still check if it's a Mongoose-like document with toObject/toJSON
        if (typeof doc.toJSON === 'function') {
            return mapDocument(doc.toJSON(), seen);
        }
        if (typeof doc.toObject === 'function') {
            return mapDocument(doc.toObject(), seen);
        }
        // If it's some other class instance, just return it or its string rep if it has _id
        if (doc._id) {
            const result = { ...doc, id: doc._id.toString() };
            delete (result as any)._id;
            return result as any;
        }
        return doc;
    }

    // It's a plain object
    const newDoc: any = { ...doc };

    // Map _id to id if it exists
    if (newDoc._id) {
        newDoc.id = newDoc._id.toString();
        delete newDoc._id;
    }
    delete newDoc.__v;

    // Recursively map properties
    for (const key in newDoc) {
        if (Object.prototype.hasOwnProperty.call(newDoc, key)) {
            const val = newDoc[key];
            if (val && typeof val === 'object') {
                newDoc[key] = mapDocument(val, seen);
            }
        }
    }

    return newDoc as T;
}

// Generate unique IDs (keeping the same format for consistency)
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Seed data function
export async function seedDatabase() {
    await dbConnect();

    // Check if database is already seeded
    const userCount = await UserModel.countDocuments();
    if (userCount > 0) return;

    console.log('Seeding database...');
    const now = new Date().toISOString();

    // Seed Users
    const users = [
        {
            _id: 'user-1',
            name: 'John Admin',
            email: 'admin@gearguard.com',
            password: hashPassword('admin123'),
            role: 'admin',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: 'user-2',
            name: 'Sarah Manager',
            email: 'manager@gearguard.com',
            password: hashPassword('manager123'),
            role: 'manager',
            isActive: true,
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: 'user-3',
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
            _id: 'user-4',
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
            _id: 'user-5',
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
            _id: 'user-6',
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

    await UserModel.insertMany(users);

    // Seed Teams
    const teams = [
        {
            _id: 'team-1',
            name: 'Mechanics',
            specialization: 'Heavy Machinery & Vehicles',
            description: 'Expert team for all mechanical repairs and maintenance',
            members: [
                { userId: 'user-3', name: 'Mike Technician', email: 'tech1@gearguard.com', role: 'lead', isAvailable: true },
                { userId: 'user-4', name: 'Lisa Technician', email: 'tech2@gearguard.com', role: 'technician', isAvailable: true },
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: 'team-2',
            name: 'Electricians',
            specialization: 'Electrical Systems',
            description: 'Specialized in electrical repairs and installations',
            members: [
                { userId: 'user-5', name: 'Tom Electrician', email: 'tech3@gearguard.com', role: 'lead', isAvailable: true },
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: 'team-3',
            name: 'IT Support',
            specialization: 'Computer & Network',
            description: 'IT infrastructure and computer maintenance',
            members: [
                { userId: 'user-6', name: 'Amy IT Support', email: 'tech4@gearguard.com', role: 'lead', isAvailable: true },
            ],
            createdAt: now,
            updatedAt: now,
        },
        {
            _id: 'team-4',
            name: 'Facilities',
            specialization: 'Building Maintenance',
            description: 'General facilities and building maintenance',
            members: [],
            createdAt: now,
            updatedAt: now,
        },
    ];

    await MaintenanceTeamModel.insertMany(teams);

    // Seed Equipment
    const equipment = [
        {
            _id: 'equip-1',
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
            _id: 'equip-2',
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
            _id: 'equip-3',
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
            _id: 'equip-4',
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
            _id: 'equip-5',
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
            _id: 'equip-6',
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
            _id: 'equip-7',
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
            _id: 'equip-8',
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

    await EquipmentModel.insertMany(equipment);

    // Seed Requests
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    const tomorrow = new Date(Date.now() + 86400000).toISOString();
    const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString();

    const requests = [
        {
            _id: 'req-1',
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
            _id: 'req-2',
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
            _id: 'req-3',
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
            _id: 'req-4',
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
            _id: 'req-5',
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
            _id: 'req-6',
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

    await MaintenanceRequestModel.insertMany(requests);

    console.log('Database seeded successfully');
}

// User operations
export async function getUsers(): Promise<User[]> {
    await dbConnect();
    const users = await UserModel.find({}).lean();
    return mapDocument(users);
}

export async function getUserById(id: string): Promise<User | undefined> {
    await dbConnect();
    const user = await UserModel.findById(id).lean();
    return mapDocument(user) as User | undefined;
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
    await dbConnect();
    const user = await UserModel.findOne({ email }).lean();
    return mapDocument(user) as User | undefined;
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    await dbConnect();
    const newUser = await UserModel.create({
        ...data,
        _id: generateId(), // Explicitly set ID if we want to maintain string ID format
    });
    return mapDocument(newUser.toJSON());
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
    await dbConnect();
    const updatedUser = await UserModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return mapDocument(updatedUser) as User | null;
}

export async function deleteUser(id: string): Promise<boolean> {
    await dbConnect();
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
}

// Equipment operations
export async function getEquipment(filters?: { department?: string; status?: string; search?: string }): Promise<Equipment[]> {
    await dbConnect();
    const query: any = {};
    if (filters?.department) {
        query.department = filters.department;
    }
    if (filters?.status) {
        query.status = filters.status;
    }
    if (filters?.search) {
        const search = filters.search;
        query.$or = [
            { name: { $regex: search, $options: 'i' } },
            { serialNumber: { $regex: search, $options: 'i' } },
            { location: { $regex: search, $options: 'i' } }
        ];
    }
    return mapDocument(await EquipmentModel.find(query).lean());
}

export async function getEquipmentById(id: string): Promise<Equipment | undefined> {
    await dbConnect();
    const equipment = await EquipmentModel.findById(id).lean();
    return mapDocument(equipment) as Equipment | undefined;
}

export async function createEquipment(data: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Equipment> {
    await dbConnect();
    const newEquipment = await EquipmentModel.create({
        ...data,
        _id: generateId(),
    });
    return mapDocument(newEquipment.toJSON());
}

export async function updateEquipment(id: string, data: Partial<Equipment>): Promise<Equipment | null> {
    await dbConnect();
    const updatedEquipment = await EquipmentModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return mapDocument(updatedEquipment) as Equipment | null;
}

export async function deleteEquipment(id: string): Promise<boolean> {
    await dbConnect();
    const result = await EquipmentModel.findByIdAndDelete(id);
    return !!result;
}

// Team operations
export async function getTeams(): Promise<MaintenanceTeam[]> {
    await dbConnect();
    const teams = await MaintenanceTeamModel.find({}).lean();
    return mapDocument(teams);
}

export async function getTeamById(id: string): Promise<MaintenanceTeam | undefined> {
    await dbConnect();
    const team = await MaintenanceTeamModel.findById(id).lean();
    return mapDocument(team) as MaintenanceTeam | undefined;
}

export async function createTeam(data: Omit<MaintenanceTeam, 'id' | 'createdAt' | 'updatedAt' | 'members'>): Promise<MaintenanceTeam> {
    await dbConnect();
    const newTeam = await MaintenanceTeamModel.create({
        ...data,
        _id: generateId(),
        members: []
    });
    return mapDocument(newTeam.toJSON());
}

export async function updateTeam(id: string, data: Partial<MaintenanceTeam>): Promise<MaintenanceTeam | null> {
    await dbConnect();
    const updatedTeam = await MaintenanceTeamModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return mapDocument(updatedTeam) as MaintenanceTeam | null;
}

export async function deleteTeam(id: string): Promise<boolean> {
    await dbConnect();
    const result = await MaintenanceTeamModel.findByIdAndDelete(id);
    return !!result;
}

// Request operations
export async function getRequests(filters?: { status?: string; type?: string; teamId?: string; equipmentId?: string }): Promise<MaintenanceRequest[]> {
    await dbConnect();
    const query: any = {};
    if (filters?.status) query.status = filters.status;
    if (filters?.type) query.type = filters.type;
    if (filters?.teamId) query.teamId = filters.teamId;
    if (filters?.equipmentId) query.equipmentId = filters.equipmentId;

    return mapDocument(await MaintenanceRequestModel.find(query).sort({ createdAt: -1 }).lean());
}

export async function getRequestById(id: string): Promise<MaintenanceRequest | undefined> {
    await dbConnect();
    const request = await MaintenanceRequestModel.findById(id).lean();
    return mapDocument(request) as MaintenanceRequest | undefined;
}

export async function createRequest(data: Omit<MaintenanceRequest, 'id' | 'createdAt' | 'updatedAt'>): Promise<MaintenanceRequest> {
    await dbConnect();
    const newRequest = await MaintenanceRequestModel.create({
        ...data,
        _id: generateId(),
    });
    return mapDocument(newRequest.toJSON());
}

export async function updateRequest(id: string, data: Partial<MaintenanceRequest>): Promise<MaintenanceRequest | null> {
    await dbConnect();
    const updatedRequest = await MaintenanceRequestModel.findByIdAndUpdate(id, data, { new: true }).lean();
    return mapDocument(updatedRequest) as MaintenanceRequest | null;
}

export async function deleteRequest(id: string): Promise<boolean> {
    await dbConnect();
    const result = await MaintenanceRequestModel.findByIdAndDelete(id);
    return !!result;
}

// Activity log
export async function getActivityLog(limit = 10): Promise<ActivityLog[]> {
    await dbConnect();
    return mapDocument(await ActivityLogModel.find({}).sort({ createdAt: -1 }).limit(limit).lean());
}

export async function addActivityLog(data: Omit<ActivityLog, 'id' | 'createdAt'>): Promise<void> {
    await dbConnect();
    await ActivityLogModel.create({
        ...data,
        _id: generateId(),
    });
}

// Dashboard stats
export async function getDashboardStats() {
    await dbConnect();
    const [
        totalEquipment,
        operationalEquipment,
        underMaintenanceEquipment,
        outOfServiceEquipment,
        totalRequests,
        openRequests,
        inProgressRequests,
        completedRequests,
        totalTeams,
        technicians
    ] = await Promise.all([
        EquipmentModel.countDocuments(),
        EquipmentModel.countDocuments({ status: 'operational' }),
        EquipmentModel.countDocuments({ status: 'under_maintenance' }),
        EquipmentModel.countDocuments({ status: 'out_of_service' }),
        MaintenanceRequestModel.countDocuments(),
        MaintenanceRequestModel.countDocuments({ status: 'new' }),
        MaintenanceRequestModel.countDocuments({ status: 'in_progress' }),
        MaintenanceRequestModel.countDocuments({ status: 'repaired' }),
        MaintenanceTeamModel.countDocuments(),
        UserModel.countDocuments({ role: 'technician' })
    ]);

    return {
        totalEquipment,
        operationalEquipment,
        underMaintenanceEquipment,
        outOfServiceEquipment,
        totalRequests,
        openRequests,
        inProgressRequests,
        completedRequests,
        totalTeams,
        totalTechnicians: technicians,
    };
}

// Initialize database
seedDatabase().catch(console.error);
