import mongoose, { Schema, Model } from 'mongoose';
import {
    User,
    Equipment,
    MaintenanceTeam,
    MaintenanceRequest,
    ActivityLog,
    TeamMember,
    AssignedEmployee
} from '@/types';

// --- User Model ---
const UserSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'manager', 'technician'] },
    teamId: { type: String },
    avatar: { type: String },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>('User', UserSchema);

// --- Equipment Model ---
const AssignedEmployeeSchema = new Schema<AssignedEmployee>({
    id: { type: String },
    name: { type: String }
}, { _id: false });

const EquipmentSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    category: { type: String, required: true },
    department: { type: String, required: true },
    assignedEmployee: AssignedEmployeeSchema,
    maintenanceTeamId: { type: String, required: true },
    defaultTechnicianId: { type: String, required: true },
    purchaseDate: { type: String, required: true }, // Keeping as string for consistency with type
    warrantyExpiry: { type: String },
    location: { type: String, required: true },
    status: { type: String, required: true },
    isScraped: { type: Boolean, default: false },
    scrapReason: { type: String },
    notes: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const EquipmentModel: Model<Equipment> = mongoose.models.Equipment || mongoose.model<Equipment>('Equipment', EquipmentSchema);

// --- Maintenance Team Model ---
const TeamMemberSchema = new Schema<TeamMember>({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    role: { type: String, required: true },
    isAvailable: { type: Boolean, default: true },
}, {
    toJSON: {
        virtuals: true,
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

const MaintenanceTeamSchema = new Schema({
    _id: { type: String, required: true },
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    description: { type: String },
    members: [TeamMemberSchema],
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const MaintenanceTeamModel: Model<MaintenanceTeam> = mongoose.models.MaintenanceTeam || mongoose.model<MaintenanceTeam>('MaintenanceTeam', MaintenanceTeamSchema);

// --- Maintenance Request Model ---
const MaintenanceRequestSchema = new Schema({
    _id: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    type: { type: String, required: true },
    priority: { type: String, required: true },
    equipmentId: { type: String, required: true },
    teamId: { type: String, required: true },
    assignedTechnicianId: { type: String },
    status: { type: String, default: 'new' },
    scheduledDate: { type: String, required: true },
    completedDate: { type: String },
    duration: { type: Number },
    notes: { type: String },
    createdBy: { type: String, required: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const MaintenanceRequestModel: Model<MaintenanceRequest> = mongoose.models.MaintenanceRequest || mongoose.model<MaintenanceRequest>('MaintenanceRequest', MaintenanceRequestSchema);

// --- Activity Log Model ---
const ActivityLogSchema = new Schema({
    _id: { type: String, required: true },
    type: { type: String, required: true },
    action: { type: String, required: true },
    entityId: { type: String, required: true },
    entityName: { type: String, required: true },
    userId: { type: String, required: true },
    userName: { type: String, required: true },
    details: { type: String },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (doc, ret: any) => {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
        }
    }
});

export const ActivityLogModel: Model<ActivityLog> = mongoose.models.ActivityLog || mongoose.model<ActivityLog>('ActivityLog', ActivityLogSchema);
