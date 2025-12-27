// Departments - Fixed list as specified
export const DEPARTMENTS = [
    { value: 'production', label: 'Production' },
    { value: 'it', label: 'IT' },
    { value: 'admin', label: 'Admin' },
    { value: 'logistics', label: 'Logistics' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'quality', label: 'Quality Control' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'sales', label: 'Sales' },
] as const;

export type DepartmentValue = typeof DEPARTMENTS[number]['value'];

// Equipment Categories
export const EQUIPMENT_CATEGORIES = [
    { value: 'machine', label: 'Machine' },
    { value: 'vehicle', label: 'Vehicle' },
    { value: 'computer', label: 'Computer' },
    { value: 'other', label: 'Other' },
] as const;

export type EquipmentCategoryValue = typeof EQUIPMENT_CATEGORIES[number]['value'];

// Equipment Status
export const EQUIPMENT_STATUS = [
    { value: 'operational', label: 'Operational', color: 'bg-green-500' },
    { value: 'under_maintenance', label: 'Under Maintenance', color: 'bg-amber-500' },
    { value: 'out_of_service', label: 'Out of Service', color: 'bg-red-500' },
    { value: 'scrapped', label: 'Scrapped', color: 'bg-gray-600' },
] as const;

export type EquipmentStatusValue = typeof EQUIPMENT_STATUS[number]['value'];

// Request Types
export const REQUEST_TYPES = [
    { value: 'corrective', label: 'Corrective', description: 'Unplanned repair (Breakdown)' },
    { value: 'preventive', label: 'Preventive', description: 'Planned maintenance (Routine Checkup)' },
] as const;

export type RequestTypeValue = typeof REQUEST_TYPES[number]['value'];

// Request Priority
export const REQUEST_PRIORITY = [
    { value: 'low', label: 'Low', color: 'bg-slate-500' },
    { value: 'medium', label: 'Medium', color: 'bg-blue-500' },
    { value: 'high', label: 'High', color: 'bg-orange-500' },
    { value: 'critical', label: 'Critical', color: 'bg-red-500' },
] as const;

export type RequestPriorityValue = typeof REQUEST_PRIORITY[number]['value'];

// Request Status
export const REQUEST_STATUS = [
    { value: 'new', label: 'New', color: 'bg-blue-500' },
    { value: 'in_progress', label: 'In Progress', color: 'bg-amber-500' },
    { value: 'repaired', label: 'Repaired', color: 'bg-green-500' },
    { value: 'cancelled', label: 'Cancelled', color: 'bg-slate-500' },
    { value: 'scrap', label: 'Scrap', color: 'bg-gray-500' },
] as const;

export type RequestStatusValue = typeof REQUEST_STATUS[number]['value'];

// User Roles
export const USER_ROLES = [
    { value: 'admin', label: 'Administrator', description: 'Full access to all features' },
    { value: 'manager', label: 'Manager', description: 'Manage equipment, teams, and requests' },
    { value: 'technician', label: 'Technician', description: 'View and work on assigned requests' },
] as const;

export type UserRoleValue = typeof USER_ROLES[number]['value'];

// Team Member Roles
export const TEAM_MEMBER_ROLES = [
    { value: 'lead', label: 'Team Lead' },
    { value: 'technician', label: 'Technician' },
] as const;

export type TeamMemberRoleValue = typeof TEAM_MEMBER_ROLES[number]['value'];

// Navigation Items
export const NAV_ITEMS = [
    { href: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { href: '/equipment', label: 'Equipment', icon: 'Wrench' },
    { href: '/teams', label: 'Teams', icon: 'Users' },
    { href: '/requests', label: 'Requests', icon: 'ClipboardList' },
    { href: '/requests/calendar', label: 'Calendar', icon: 'Calendar' },
    { href: '/reports', label: 'Reports', icon: 'BarChart3' },
] as const;

export const ADMIN_NAV_ITEMS = [
    { href: '/users', label: 'User Management', icon: 'UserCog' },
] as const;

// JWT Configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'gearguard-secret-key-change-in-production';
export const JWT_EXPIRES_IN = '7d';
