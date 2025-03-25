import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { FiLock, FiBell, FiGlobe, FiToggleLeft, FiToggleRight, FiTrash2 } from 'react-icons/fi';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSaveSettings: (settings: any) => Promise<boolean>;
  onDeleteAccount?: () => void;
  className?: string;
}

export const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  profile,
  onSaveSettings,
  onDeleteAccount,
  className = "",
}) => {
  // Default settings - would be populated from the user's profile in a real app
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleSaveSettings = async () => {
    setIsSubmitting(true);
    setError(null);
    setShowSuccessMessage(false);

    try {
      const settings = {
        emailNotifications,
        pushNotifications,
        language,
      };

      const success = await onSaveSettings(settings);
      if (!success) {
        throw new Error('Failed to update settings');
      }
      
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      setError('Error updating settings. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Notifications Settings */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex items-center mb-6">
          <FiBell className="text-indigo-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-neutral-800">Notifications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-neutral-700">Email Notifications</div>
              <p className="text-neutral-500 text-sm">Receive emails about your activity, promotions, and updates</p>
            </div>
            <button 
              onClick={() => setEmailNotifications(!emailNotifications)}
              className="text-indigo-600"
              aria-pressed={emailNotifications}
            >
              {emailNotifications ? (
                <FiToggleRight className="w-8 h-8" />
              ) : (
                <FiToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-neutral-700">Push Notifications</div>
              <p className="text-neutral-500 text-sm">Receive notifications about bookings, reviews, and messages</p>
            </div>
            <button 
              onClick={() => setPushNotifications(!pushNotifications)}
              className="text-indigo-600"
              aria-pressed={pushNotifications}
            >
              {pushNotifications ? (
                <FiToggleRight className="w-8 h-8" />
              ) : (
                <FiToggleLeft className="w-8 h-8" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Language Settings */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex items-center mb-6">
          <FiGlobe className="text-indigo-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-neutral-800">Language & Region</h3>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="ar">العربية</option>
          </select>
        </div>
      </div>
      
      {/* Security Settings */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex items-center mb-6">
          <FiLock className="text-indigo-600 w-5 h-5 mr-2" />
          <h3 className="text-lg font-medium text-neutral-800">Security</h3>
        </div>
        
        <div className="space-y-4">
          <button 
            className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-700"
          >
            Change Password
          </button>
          
          <button 
            className="w-full text-left px-4 py-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors text-neutral-700"
          >
            Two-Factor Authentication
          </button>
        </div>
      </div>
      
      {/* Save Button */}
      <div className="flex justify-between items-center">
        <div>
          {error && (
            <div className="text-rose-600">
              {error}
            </div>
          )}
          
          {showSuccessMessage && (
            <div className="text-green-600">
              Settings saved successfully!
            </div>
          )}
        </div>
        
        <button
          onClick={handleSaveSettings}
          className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors flex items-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
      
      {/* Delete Account */}
      {onDeleteAccount && (
        <div className="border-t border-neutral-200 pt-8 mt-8">
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
            <h3 className="text-lg font-medium text-rose-700 flex items-center">
              <FiTrash2 className="w-5 h-5 mr-2" />
              Delete Account
            </h3>
            <p className="text-neutral-700 mt-2">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            
            {!showDeleteConfirmation ? (
              <button
                onClick={() => setShowDeleteConfirmation(true)}
                className="mt-4 px-4 py-2 bg-rose-600 rounded-lg text-white hover:bg-rose-700 transition-colors"
              >
                Delete Account
              </button>
            ) : (
              <div className="mt-4 space-y-4">
                <p className="text-rose-600 font-medium">Are you sure you want to delete your account?</p>
                <div className="flex space-x-4">
                  <button
                    onClick={onDeleteAccount}
                    className="px-4 py-2 bg-rose-600 rounded-lg text-white hover:bg-rose-700 transition-colors"
                  >
                    Yes, Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirmation(false)}
                    className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings; 