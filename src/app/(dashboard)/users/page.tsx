'use client';

import { useState, useEffect } from 'react';
import {
    UserPlus,
    Search,
    Mail,
    Shield,
    MoreVertical,
    Edit,
    Trash2,
    CheckCircle2,
    XCircle,
    Users as UsersIcon,
    Loader2
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useUsers } from '@/hooks/useUsers';
import { useTeams } from '@/hooks/useTeams';
import { useAuth } from '@/context/AuthContext';
import { USER_ROLES } from '@/constants';
import { userSchema, UserSchemaType } from '@/schemas/user.schema';
import { toast } from 'sonner';
import { User } from '@/types';

export default function UserManagementPage() {
    const [search, setSearch] = useState('');
    const { users, isLoading, createUser, updateUser, deleteUser } = useUsers();
    const { teams } = useTeams();
    const { user: currentUser, hasRole } = useAuth();

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting }
    } = useForm<UserSchemaType>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            role: 'technician',
            teamId: '',
            isActive: true,
        }
    });

    const selectedRole = watch('role');

    useEffect(() => {
        if (editingUser) {
            reset({
                name: editingUser.name,
                email: editingUser.email,
                role: editingUser.role,
                teamId: editingUser.teamId || '',
                isActive: editingUser.isActive,
                password: '',
            });
        } else {
            reset({
                name: '',
                email: '',
                password: '',
                role: 'technician',
                teamId: '',
                isActive: true,
            });
        }
    }, [editingUser, reset]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (id === currentUser?.id) {
            toast.error("You cannot delete yourself");
            return;
        }
        if (confirm('Are you sure you want to delete this user?')) {
            try {
                await deleteUser(id);
                toast.success('User deleted successfully');
            } catch (error) {
                toast.error('Failed to delete user');
            }
        }
    };

    const onSubmit = async (values: UserSchemaType) => {
        try {
            if (editingUser) {
                await updateUser(editingUser.id, values);
                toast.success('User updated successfully');
            } else {
                if (!values.password) {
                    toast.error('Password is required for new users');
                    return;
                }
                await createUser(values);
                toast.success('User created successfully');
            }
            setIsDialogOpen(false);
            setEditingUser(null);
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.error || 'Something went wrong');
        }
    };

    const getRoleBadge = (role: string) => {
        const roleInfo = USER_ROLES.find(r => r.value === role);
        switch (role) {
            case 'admin':
                return <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20">{roleInfo?.label}</Badge>;
            case 'manager':
                return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20">{roleInfo?.label}</Badge>;
            default:
                return <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20">{roleInfo?.label}</Badge>;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!hasRole(['admin', 'manager'])) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-center">
                <Shield className="h-12 w-12 text-slate-600 mb-4" />
                <h2 className="text-xl font-bold text-white">Access Denied</h2>
                <p className="text-slate-400">Only administrators and managers can access user management.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">User Management</h1>
                    <p className="text-slate-400">Manage system access and roles</p>
                </div>
                {hasRole(['admin']) && (
                    <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() => {
                            setEditingUser(null);
                            setIsDialogOpen(true);
                        }}
                    >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add User
                    </Button>
                )}
            </div>

            <Card className="bg-slate-900 border-slate-800">
                <CardHeader className="pb-3 border-b border-slate-800">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                        <Input
                            placeholder="Search users..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10 bg-slate-800 border-slate-700 text-white"
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="border-slate-800 hover:bg-transparent">
                                <TableHead className="text-slate-400">User</TableHead>
                                <TableHead className="text-slate-400">Role</TableHead>
                                <TableHead className="text-slate-400">Team</TableHead>
                                <TableHead className="text-slate-400">Status</TableHead>
                                <TableHead className="text-slate-400 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => {
                                const team = teams.find(t => t.id === user.teamId);
                                return (
                                    <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/30 transition-colors">
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-8 w-8 bg-slate-800">
                                                    <AvatarFallback className="text-xs text-slate-400">
                                                        {user.name.split(' ').map(n => n[0]).join('')}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium text-white">{user.name}</p>
                                                    <div className="flex items-center gap-1 text-xs text-slate-500">
                                                        <Mail className="h-3 w-3" />
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                                        <TableCell>
                                            {team ? (
                                                <Badge variant="outline" className="border-slate-700 text-slate-400">
                                                    {team.name}
                                                </Badge>
                                            ) : (
                                                <span className="text-xs text-slate-600 italic">None</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {user.isActive ? (
                                                <div className="flex items-center gap-1.5 text-green-500">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Active</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-1.5 text-slate-500">
                                                    <XCircle className="h-4 w-4" />
                                                    <span className="text-xs font-medium">Inactive</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {hasRole(['admin']) && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="bg-slate-800 border-slate-700">
                                                        <DropdownMenuItem
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setEditingUser(user);
                                                                setIsDialogOpen(true);
                                                            }}
                                                        >
                                                            <Edit className="h-4 w-4 mr-2" />
                                                            Edit
                                                        </DropdownMenuItem>
                                                        {user.id !== currentUser?.id && (
                                                            <DropdownMenuItem
                                                                className="cursor-pointer text-red-400 hover:text-red-300"
                                                                onClick={() => handleDelete(user.id)}
                                                            >
                                                                <Trash2 className="h-4 w-4 mr-2" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        )}
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                            {filteredUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-500">
                                            <UsersIcon className="h-8 w-8 mb-2 opacity-20" />
                                            <p>No users found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Add/Edit User Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-md">
                    <DialogHeader>
                        <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
                        <DialogDescription className="text-slate-400">
                            {editingUser ? 'Update user details and permissions.' : 'Create a new user account and assign roles.'}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                            <Input
                                id="name"
                                placeholder="John Doe"
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('name')}
                            />
                            {errors.name && <p className="text-xs text-red-400">{errors.name.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="john@example.com"
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('email')}
                            />
                            {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">
                                {editingUser ? 'New Password (Leave blank to keep current)' : 'Password'}
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                className="bg-slate-800 border-slate-700 text-white"
                                {...register('password')}
                            />
                            {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-slate-300">Role</Label>
                                <Select
                                    defaultValue={watch('role')}
                                    onValueChange={(value) => setValue('role', value as any)}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        {USER_ROLES.map((role) => (
                                            <SelectItem key={role.value} value={role.value}>
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label className="text-slate-300">Team</Label>
                                <Select
                                    defaultValue={watch('teamId')}
                                    onValueChange={(value) => setValue('teamId', value)}
                                >
                                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                        <SelectValue placeholder="Select team" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-slate-700">
                                        <SelectItem value="">None</SelectItem>
                                        {teams.map((team) => (
                                            <SelectItem key={team.id} value={team.id}>
                                                {team.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <div className="space-y-0.5">
                                <Label className="text-slate-300">Active Status</Label>
                                <p className="text-xs text-slate-500 text-balance">Enable or disable user access to the system.</p>
                            </div>
                            <Switch
                                checked={watch('isActive')}
                                onCheckedChange={(checked) => setValue('isActive', checked)}
                            />
                        </div>

                        <DialogFooter className="pt-6">
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => setIsDialogOpen(false)}
                                className="text-slate-400 hover:text-white"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 min-w-[100px]"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    editingUser ? 'Update User' : 'Create User'
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
