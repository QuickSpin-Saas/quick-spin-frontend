'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';
import { updateUser } from '@/lib/redux/slices/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Building2, 
  Key, 
  Settings, 
  Upload, 
  Trash2, 
  Copy,
  Eye,
  EyeOff,
  Plus,
  Calendar,
  Globe,
  Bell,
  Shield
} from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
});

const organizationSchema = z.object({
  name: z.string().min(2, 'Organization name must be at least 2 characters'),
  description: z.string().optional(),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  industry: z.string().optional(),
  size: z.string().optional(),
});

const apiKeySchema = z.object({
  name: z.string().min(1, 'API key name is required'),
  permissions: z.array(z.string()).optional(),
  expiresIn: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;
type OrganizationFormData = z.infer<typeof organizationSchema>;
type ApiKeyFormData = z.infer<typeof apiKeySchema>;

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('profile');
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [apiKeys, setApiKeys] = useState<Array<{
    id: string;
    name: string;
    key: string;
    createdAt: string;
    lastUsed: string | null;
    permissions: string[];
    status: string;
  }>>([
    {
      id: '1',
      name: 'Production API Key',
      key: 'qk_live_1234567890abcdef',
      createdAt: '2024-01-15',
      lastUsed: '2024-12-09',
      permissions: ['read', 'write'],
      status: 'active'
    },
    {
      id: '2',
      name: 'Development API Key',
      key: 'qk_test_abcdef1234567890',
      createdAt: '2024-02-01',
      lastUsed: '2024-12-08',
      permissions: ['read'],
      status: 'active'
    }
  ]);

  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'en',
    timezone: 'UTC',
    notifications: {
      email: true,
      push: false,
      sms: false,
      serviceAlerts: true,
      billingAlerts: true,
      marketing: false
    },
    privacy: {
      profileVisible: true,
      activityVisible: false,
      dataSharing: false
    }
  });

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      bio: '',
      location: '',
      website: '',
    },
  });

  const organizationForm = useForm<OrganizationFormData>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: 'QuickSpin Technologies',
      description: 'Building the future of managed microservices',
      website: 'https://quickspin.io',
      industry: 'Technology',
      size: '11-50',
    },
  });

  const apiKeyForm = useForm<ApiKeyFormData>({
    resolver: zodResolver(apiKeySchema),
    defaultValues: {
      name: '',
      permissions: ['read'],
      expiresIn: '30d',
    },
  });

  const onProfileSubmit = (data: ProfileFormData) => {
    dispatch(updateUser(data));
  };

  const onOrganizationSubmit = (data: OrganizationFormData) => {
    console.log('Organization update:', data);
  };

  const onApiKeySubmit = (data: ApiKeyFormData) => {
    const newApiKey = {
      id: Date.now().toString(),
      name: data.name,
      key: `qk_live_${Math.random().toString(36).substring(2, 18)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      permissions: data.permissions || ['read'],
      status: 'active'
    };
    setApiKeys([...apiKeys, newApiKey]);
    apiKeyForm.reset();
  };

  const copyApiKey = (key: string) => {
    navigator.clipboard.writeText(key);
  };

  const deleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter(k => k.id !== id));
  };

  const toggleApiKeyVisibility = (id: string) => {
    setShowApiKey(showApiKey === id ? null : id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-[600px] border-b border-border">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-theme ${
              activeTab === 'profile'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button
            onClick={() => setActiveTab('organization')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-theme ${
              activeTab === 'organization'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Building2 className="h-4 w-4" />
            Organization
          </button>
          <button
            onClick={() => setActiveTab('api-keys')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-theme ${
              activeTab === 'api-keys'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Key className="h-4 w-4" />
            API Keys
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-theme ${
              activeTab === 'preferences'
                ? 'border-primary text-primary'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            <Settings className="h-4 w-4" />
            Preferences
          </button>
        </div>

        {activeTab === 'profile' && <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your personal information and profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="text-xl">
                    {user?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Change Photo
                  </Button>
                  <p className="text-sm text-muted-foreground mt-1">
                    JPG, PNG, GIF. Max 2MB.
                  </p>
                </div>
              </div>

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      {...profileForm.register('name')}
                      placeholder="Enter your full name"
                    />
                    {profileForm.formState.errors.name && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register('email')}
                      placeholder="Enter your email"
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    {...profileForm.register('bio')}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Tell us about yourself"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      {...profileForm.register('location')}
                      placeholder="City, Country"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      {...profileForm.register('website')}
                      placeholder="https://yourwebsite.com"
                    />
                    {profileForm.formState.errors.website && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.website.message}
                      </p>
                    )}
                  </div>
                </div>

                <Button type="submit">Save Profile</Button>
              </form>
            </CardContent>
          </Card>
        </div>}

        {activeTab === 'organization' && <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Organization Settings</CardTitle>
              <CardDescription>
                Manage your organization information and settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={organizationForm.handleSubmit(onOrganizationSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Organization Name</Label>
                  <Input
                    id="org-name"
                    {...organizationForm.register('name')}
                    placeholder="Enter organization name"
                  />
                  {organizationForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {organizationForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    {...organizationForm.register('description')}
                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your organization"
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="org-website">Website</Label>
                    <Input
                      id="org-website"
                      type="url"
                      {...organizationForm.register('website')}
                      placeholder="https://organization.com"
                    />
                    {organizationForm.formState.errors.website && (
                      <p className="text-sm text-destructive">
                        {organizationForm.formState.errors.website.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="industry">Industry</Label>
                    <Select
                      onValueChange={(value) => organizationForm.setValue('industry', value)}
                      defaultValue={organizationForm.watch('industry')}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Technology">Technology</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Retail">Retail</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="size">Organization Size</Label>
                  <Select
                    onValueChange={(value) => organizationForm.setValue('size', value)}
                    defaultValue={organizationForm.watch('size')}
                  >
                    <SelectTrigger id="size">
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-10">1-10 employees</SelectItem>
                      <SelectItem value="11-50">11-50 employees</SelectItem>
                      <SelectItem value="51-200">51-200 employees</SelectItem>
                      <SelectItem value="201-500">201-500 employees</SelectItem>
                      <SelectItem value="501-1000">501-1000 employees</SelectItem>
                      <SelectItem value="1000+">1000+ employees</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit">Save Organization</Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>
                These actions are irreversible. Please proceed with caution.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border p-4">
                <div>
                  <p className="font-medium">Delete Organization</p>
                  <p className="text-sm text-muted-foreground">
                    Permanently delete your organization and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Organization
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>}

        {activeTab === 'api-keys' && <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Create API Key</CardTitle>
              <CardDescription>
                Generate a new API key for your applications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={apiKeyForm.handleSubmit(onApiKeySubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="key-name">Key Name</Label>
                  <Input
                    id="key-name"
                    {...apiKeyForm.register('name')}
                    placeholder="My Application"
                  />
                  {apiKeyForm.formState.errors.name && (
                    <p className="text-sm text-destructive">
                      {apiKeyForm.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="permissions">Permissions</Label>
                    <Select
                      onValueChange={(value) => apiKeyForm.setValue('permissions', [value])}
                      defaultValue="read"
                    >
                      <SelectTrigger id="permissions">
                        <SelectValue placeholder="Select permissions" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="read">Read Only</SelectItem>
                        <SelectItem value="write">Write Only</SelectItem>
                        <SelectItem value="read,write">Read & Write</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expires">Expires In</Label>
                    <Select
                      onValueChange={(value) => apiKeyForm.setValue('expiresIn', value)}
                      defaultValue="30d"
                    >
                      <SelectTrigger id="expires">
                        <SelectValue placeholder="Select expiration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7d">7 days</SelectItem>
                        <SelectItem value="30d">30 days</SelectItem>
                        <SelectItem value="90d">90 days</SelectItem>
                        <SelectItem value="1y">1 year</SelectItem>
                        <SelectItem value="never">Never</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Generate API Key
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>API Keys</CardTitle>
              <CardDescription>
                Manage your existing API keys
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="rounded-lg border p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{apiKey.name}</h4>
                          <Badge variant={apiKey.status === 'active' ? 'default' : 'secondary'}>
                            {apiKey.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created {apiKey.createdAt}
                          </div>
                          {apiKey.lastUsed && (
                            <div className="flex items-center gap-1">
                              <Globe className="h-3 w-3" />
                              Last used {apiKey.lastUsed}
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
                            {showApiKey === apiKey.id ? apiKey.key : '••••••••••••••••'}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => toggleApiKeyVisibility(apiKey.id)}
                          >
                            {showApiKey === apiKey.id ? (
                              <EyeOff className="h-3 w-3" />
                            ) : (
                              <Eye className="h-3 w-3" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => copyApiKey(apiKey.key)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex gap-2 mt-2">
                          {apiKey.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => deleteApiKey(apiKey.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>}

        {activeTab === 'preferences' && <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize how QuickSpin looks on your device
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select
                  value={preferences.theme}
                  onValueChange={(value) => setPreferences({...preferences, theme: value})}
                >
                  <SelectTrigger id="theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="language">Language</Label>
                <Select
                  value={preferences.language}
                  onValueChange={(value) => setPreferences({...preferences, language: value})}
                >
                  <SelectTrigger id="language">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Spanish</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="zh">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={preferences.timezone}
                  onValueChange={(value) => setPreferences({...preferences, timezone: value})}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time</SelectItem>
                    <SelectItem value="America/Chicago">Central Time</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time</SelectItem>
                    <SelectItem value="America/Los_Angeles">Pacific Time</SelectItem>
                    <SelectItem value="Europe/London">London</SelectItem>
                    <SelectItem value="Europe/Paris">Paris</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={preferences.notifications.email}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, email: checked}
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in your browser
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={preferences.notifications.push}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, push: checked}
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications via text message
                    </p>
                  </div>
                  <Switch
                    id="sms-notifications"
                    checked={preferences.notifications.sms}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, sms: checked}
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="service-alerts">Service Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about service issues and maintenance
                    </p>
                  </div>
                  <Switch
                    id="service-alerts"
                    checked={preferences.notifications.serviceAlerts}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, serviceAlerts: checked}
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="billing-alerts">Billing Alerts</Label>
                    <p className="text-sm text-muted-foreground">
                      Get notified about billing and payment issues
                    </p>
                  </div>
                  <Switch
                    id="billing-alerts"
                    checked={preferences.notifications.billingAlerts}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, billingAlerts: checked}
                    })}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="marketing-emails">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive promotional and marketing emails
                    </p>
                  </div>
                  <Switch
                    id="marketing-emails"
                    checked={preferences.notifications.marketing}
                    onCheckedChange={(checked) => setPreferences({
                      ...preferences,
                      notifications: {...preferences.notifications, marketing: checked}
                    })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Privacy
              </CardTitle>
              <CardDescription>
                Control your privacy settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="profile-visible">Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Make your profile visible to other users
                  </p>
                </div>
                <Switch
                  id="profile-visible"
                  checked={preferences.privacy.profileVisible}
                  onCheckedChange={(checked) => setPreferences({
                    ...preferences,
                    privacy: {...preferences.privacy, profileVisible: checked}
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="activity-visible">Activity Visibility</Label>
                  <p className="text-sm text-muted-foreground">
                    Share your activity with other users
                  </p>
                </div>
                <Switch
                  id="activity-visible"
                  checked={preferences.privacy.activityVisible}
                  onCheckedChange={(checked) => setPreferences({
                    ...preferences,
                    privacy: {...preferences.privacy, activityVisible: checked}
                  })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="data-sharing">Data Sharing</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous usage data collection
                  </p>
                </div>
                <Switch
                  id="data-sharing"
                  checked={preferences.privacy.dataSharing}
                  onCheckedChange={(checked) => setPreferences({
                    ...preferences,
                    privacy: {...preferences.privacy, dataSharing: checked}
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>}
      </div>
    </div>
  );
}