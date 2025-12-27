'use client';

import { useState } from 'react';
import {
    User,
    Lock,
    Bell,
    Shield,
    Save,
    Upload,
    Smartphone,
    Mail,
    Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

export default function SettingsPage() {
    const { user } = useAuth();
    const [isLoading, setIsLoading] = useState(false);

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast.success('Profile updated successfully');
        }, 1000);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-white">Settings</h1>
                <p className="text-slate-400">Manage your account preferences and configurations</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
                <TabsList className="bg-slate-900 border border-slate-800 p-1">
                    <TabsTrigger value="profile" className="gap-2">
                        <User className="h-4 w-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="security" className="gap-2">
                        <Lock className="h-4 w-4" />
                        Security
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="gap-2">
                        <Bell className="h-4 w-4" />
                        Notifications
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Profile Information</CardTitle>
                            <CardDescription className="text-slate-400">Update your account details and public profile.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSaveProfile} className="space-y-6">
                                <div className="flex flex-col md:flex-row gap-8 items-start">
                                    <div className="flex flex-col items-center gap-4">
                                        <div className="h-24 w-24 rounded-full bg-slate-800 flex items-center justify-center border-2 border-slate-700 overflow-hidden group relative">
                                            <span className="text-2xl text-slate-400 font-bold">
                                                {user?.name?.split(' ').map(n => n[0]).join('')}
                                            </span>
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                                <Upload className="h-6 w-6 text-white" />
                                            </div>
                                        </div>
                                        <Button variant="outline" size="sm">Change Avatar</Button>
                                    </div>

                                    <div className="flex-1 grid gap-4 w-full">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name" className="text-slate-300">Full Name</Label>
                                                <Input id="name" defaultValue={user?.name} className="bg-slate-800 border-slate-700 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="email" className="text-slate-300">Email Address</Label>
                                                <Input id="email" defaultValue={user?.email} className="bg-slate-800 border-slate-700 text-white" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="role" className="text-slate-300">Role</Label>
                                                <Input id="role" value={user?.role} disabled className="bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed capitalize" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="team" className="text-slate-300">Team</Label>
                                                <Input id="team" value="Maintenance Team A" disabled className="bg-slate-800/50 border-slate-700 text-slate-500 cursor-not-allowed" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="bio" className="text-slate-300">Bio</Label>
                                            <Input id="bio" placeholder="Tell us about your expertise..." className="bg-slate-800 border-slate-700 text-white" />
                                        </div>
                                    </div>
                                </div>
                                <Separator className="bg-slate-800" />
                                <div className="flex justify-end">
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                        {!isLoading && <Save className="h-4 w-4 ml-2" />}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Password Settings</CardTitle>
                            <CardDescription className="text-slate-400">Change your password and secure your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="current-pass" className="text-slate-300">Current Password</Label>
                                <Input id="current-pass" type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="new-pass" className="text-slate-300">New Password</Label>
                                    <Input id="new-pass" type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirm-pass" className="text-slate-300">Confirm Password</Label>
                                    <Input id="confirm-pass" type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" />
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button className="bg-blue-600 hover:bg-blue-700">Update Password</Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                            <CardDescription className="text-slate-400">Add an extra layer of security to your account.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                    <Smartphone className="h-6 w-6 text-blue-500" />
                                </div>
                                <div>
                                    <p className="font-medium text-white">Authenticator App</p>
                                    <p className="text-sm text-slate-500">Enable 2FA via mobile app</p>
                                </div>
                            </div>
                            <Switch />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-white">Notification Preferences</CardTitle>
                            <CardDescription className="text-slate-400">Choose how and when you want to be notified.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Mail className="h-4 w-4 text-slate-400" />
                                    <p className="text-slate-300">Email Notifications</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator className="bg-slate-800" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Bell className="h-4 w-4 text-slate-400" />
                                    <p className="text-slate-300">Push Notifications</p>
                                </div>
                                <Switch defaultChecked />
                            </div>
                            <Separator className="bg-slate-800" />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Globe className="h-4 w-4 text-slate-400" />
                                    <p className="text-slate-300">Browser Notifications</p>
                                </div>
                                <Switch />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
