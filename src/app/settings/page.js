'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCog, FaBell, FaLock, FaUser, FaTrash, FaSave } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { updateUserSettings, deleteAccount } from '@/services';
import toast from 'react-hot-toast';

const SettingsSection = ({ title, icon, children }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center space-x-3 mb-4">
            <div className="text-primary-500">{icon}</div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
        </div>
        {children}
    </div>
);

const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between py-3">
        <div>
            <p className="font-medium text-gray-900 dark:text-white">{label}</p>
            {description && (
                <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>
            )}
        </div>
        <button
            onClick={() => onChange(!enabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
            />
        </button>
    </div>
);

const SettingsPage = () => {
    const { user, logout } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [settings, setSettings] = useState({
        notifications: {
            email: true,
            push: true,
            messages: true,
            follows: true,
            posts: true,
            reviews: true
        },
        privacy: {
            showEmail: false,
            showPhone: false,
            showOnlineStatus: true,
            allowMessages: true
        },
        preferences: {
            theme: 'system',
            language: 'en',
            timezone: 'UTC'
        }
    });

    useEffect(() => {
        const loadSettings = async () => {
            try {
                setLoading(true);
                // Load user settings from user preferences
                if (user?.preferences) {
                    setSettings(prev => ({
                        ...prev,
                        ...user.preferences
                    }));
                }
            } catch (error) {
                toast.error('Failed to load settings');
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            loadSettings();
        }
    }, [user]);

    const handleSaveSettings = async () => {
        try {
            setSaving(true);
            await updateUserSettings(settings);
            toast.success('Settings saved successfully');
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to delete your account? This action cannot be undone.'
        );

        if (!confirmed) return;

        const doubleConfirm = window.prompt(
            'Type "DELETE" to confirm account deletion:'
        );

        if (doubleConfirm !== 'DELETE') {
            toast.error('Account deletion cancelled');
            return;
        }

        try {
            await deleteAccount();
            toast.success('Account deleted successfully');
            logout();
        } catch (error) {
            toast.error('Failed to delete account');
        }
    };

    const updateNotificationSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const updatePrivacySetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            privacy: {
                ...prev.privacy,
                [key]: value
            }
        }));
    };

    const updatePreferenceSetting = (key, value) => {
        setSettings(prev => ({
            ...prev,
            preferences: {
                ...prev.preferences,
                [key]: value
            }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Settings
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Manage your account preferences and privacy settings
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Profile Settings */}
                    <SettingsSection title="Profile" icon={<FaUser />}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Display Name</label>
                                <input
                                    type="text"
                                    value={user?.name || ''}
                                    className="input-style w-full"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    To change your name, edit your profile
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    className="input-style w-full"
                                    disabled
                                />
                                <p className="text-xs text-gray-500 mt-1">
                                    Contact support to change your email
                                </p>
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Notification Settings */}
                    <SettingsSection title="Notifications" icon={<FaBell />}>
                        <div className="space-y-2">
                            <ToggleSwitch
                                enabled={settings.notifications.email}
                                onChange={(value) => updateNotificationSetting('email', value)}
                                label="Email Notifications"
                                description="Receive notifications via email"
                            />

                            <ToggleSwitch
                                enabled={settings.notifications.push}
                                onChange={(value) => updateNotificationSetting('push', value)}
                                label="Push Notifications"
                                description="Receive browser push notifications"
                            />

                            <ToggleSwitch
                                enabled={settings.notifications.messages}
                                onChange={(value) => updateNotificationSetting('messages', value)}
                                label="Message Notifications"
                                description="Get notified when you receive messages"
                            />

                            <ToggleSwitch
                                enabled={settings.notifications.follows}
                                onChange={(value) => updateNotificationSetting('follows', value)}
                                label="Follow Notifications"
                                description="Get notified when someone follows you"
                            />

                            <ToggleSwitch
                                enabled={settings.notifications.posts}
                                onChange={(value) => updateNotificationSetting('posts', value)}
                                label="Post Interactions"
                                description="Get notified about likes and comments on your posts"
                            />

                            <ToggleSwitch
                                enabled={settings.notifications.reviews}
                                onChange={(value) => updateNotificationSetting('reviews', value)}
                                label="Review Notifications"
                                description="Get notified when you receive reviews"
                            />
                        </div>
                    </SettingsSection>

                    {/* Privacy Settings */}
                    <SettingsSection title="Privacy" icon={<FaLock />}>
                        <div className="space-y-2">
                            <ToggleSwitch
                                enabled={settings.privacy.showEmail}
                                onChange={(value) => updatePrivacySetting('showEmail', value)}
                                label="Show Email on Profile"
                                description="Allow others to see your email address"
                            />

                            <ToggleSwitch
                                enabled={settings.privacy.showPhone}
                                onChange={(value) => updatePrivacySetting('showPhone', value)}
                                label="Show Phone on Profile"
                                description="Allow others to see your phone number"
                            />

                            <ToggleSwitch
                                enabled={settings.privacy.showOnlineStatus}
                                onChange={(value) => updatePrivacySetting('showOnlineStatus', value)}
                                label="Show Online Status"
                                description="Let others see when you're online"
                            />

                            <ToggleSwitch
                                enabled={settings.privacy.allowMessages}
                                onChange={(value) => updatePrivacySetting('allowMessages', value)}
                                label="Allow Messages"
                                description="Allow other users to send you messages"
                            />
                        </div>
                    </SettingsSection>

                    {/* Preferences */}
                    <SettingsSection title="Preferences" icon={<FaCog />}>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Theme</label>
                                <select
                                    value={settings.preferences.theme}
                                    onChange={(e) => updatePreferenceSetting('theme', e.target.value)}
                                    className="input-style w-full"
                                >
                                    <option value="light">Light</option>
                                    <option value="dark">Dark</option>
                                    <option value="system">System</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">Language</label>
                                <select
                                    value={settings.preferences.language}
                                    onChange={(e) => updatePreferenceSetting('language', e.target.value)}
                                    className="input-style w-full"
                                >
                                    <option value="en">English</option>
                                    <option value="es">Spanish</option>
                                    <option value="fr">French</option>
                                    <option value="de">German</option>
                                </select>
                            </div>
                        </div>
                    </SettingsSection>

                    {/* Danger Zone */}
                    <SettingsSection title="Danger Zone" icon={<FaTrash />}>
                        <div className="border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h3 className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">
                                Delete Account
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">
                                Once you delete your account, there is no going back. Please be certain.
                            </p>
                            <Button
                                onClick={handleDeleteAccount}
                                variant="outline"
                                className="text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <FaTrash className="w-4 h-4 mr-2" />
                                Delete Account
                            </Button>
                        </div>
                    </SettingsSection>

                    {/* Save Button */}
                    <div className="flex justify-end">
                        <Button
                            onClick={handleSaveSettings}
                            disabled={saving}
                            isLoading={saving}
                            className="flex items-center space-x-2"
                        >
                            <FaSave className="w-4 h-4" />
                            <span>Save Settings</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsPage;