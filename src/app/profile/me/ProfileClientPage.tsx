'use client';

import { useFormState, useFormStatus } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@prisma/client';
import { FiUser, FiSettings, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import { updateProfile, changePassword } from '../actions'; // Corrected path

// --- Helper Components ---

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`w-full sm:w-auto bg-neon-yellow text-black px-8 py-2.5 rounded-md font-bold uppercase tracking-wider text-sm hover:bg-yellow-400 transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed font-poppins ${pending ? 'animate-pulse' : ''}
      `}
    >
      {pending ? 'Saving...' : label}
    </button>
  );
}

function FormResponseMessage({ state }: { state: { success: boolean; message: string } | undefined }) {
  if (!state?.message) return null;

  return (
    <div
      className={`flex items-center gap-2 p-3 rounded-md text-sm font-medium mb-4 ${state.success ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'
        }`}
    >
      {state.success ? <FiCheckCircle className="h-5 w-5" /> : <FiAlertCircle className="h-5 w-5" />}
      {state.message}
    </div>
  );
}

// --- Settings Form Component ---
function SettingsForm({ user }: { user: User }) {
  const [profileFormState, profileFormAction] = useFormState(updateProfile, undefined);
  const [passwordFormState, passwordFormAction] = useFormState(changePassword, undefined);

  return (
    <div className="space-y-10">
      {/* Account Information Section */}
      <section>
        <h2 className="text-2xl font-bebas text-white uppercase tracking-wide mb-5 border-b border-neutral-700 pb-2">Account Information</h2>
        <form action={profileFormAction} className="space-y-4">
          <FormResponseMessage state={profileFormState} />
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-300 mb-1 font-poppins">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={user.name ?? ''}
              className="w-full px-4 py-2.5 rounded-md bg-gunmetal-gray/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow border-2 border-neutral-700 transition-colors duration-200 font-poppins"
            />
            {profileFormState?.errors?.name && (
              <p className="mt-1 text-xs text-red-400">{profileFormState.errors.name[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-300 mb-1 font-poppins">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              disabled // Email change usually requires verification flow
              value={user.email ?? ''}
              className="w-full px-4 py-2.5 rounded-md bg-neutral-800/50 text-neutral-400 border-2 border-neutral-700 cursor-not-allowed font-poppins"
            />
          </div>
           <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-neutral-300 mb-1 font-poppins">Phone Number (Optional)</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={user.phoneNumber ?? ''}
              className="w-full px-4 py-2.5 rounded-md bg-gunmetal-gray/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow border-2 border-neutral-700 transition-colors duration-200 font-poppins"
            />
            {profileFormState?.errors?.phoneNumber && (
              <p className="mt-1 text-xs text-red-400">{profileFormState.errors.phoneNumber[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-neutral-300 mb-1 font-poppins">City (Optional)</label>
            <input
              type="text"
              id="city"
              name="city"
              defaultValue={user.city ?? ''}
              className="w-full px-4 py-2.5 rounded-md bg-gunmetal-gray/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow border-2 border-neutral-700 transition-colors duration-200 font-poppins"
            />
             {profileFormState?.errors?.city && (
              <p className="mt-1 text-xs text-red-400">{profileFormState.errors.city[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-neutral-300 mb-1 font-poppins">Bio (Optional)</label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              defaultValue={user.bio ?? ''}
              className="w-full px-4 py-2.5 rounded-md bg-gunmetal-gray/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow border-2 border-neutral-700 transition-colors duration-200 font-poppins"
            ></textarea>
             {profileFormState?.errors?.bio && (
              <p className="mt-1 text-xs text-red-400">{profileFormState.errors.bio[0]}</p>
            )}
          </div>
          <div className="pt-2">
            <SubmitButton label="Update Profile" />
          </div>
        </form>
      </section>

      {/* Change Password Section */}
      <section>
        <h2 className="text-2xl font-bebas text-white uppercase tracking-wide mb-5 border-b border-neutral-700 pb-2">Change Password</h2>
        <form action={passwordFormAction} className="space-y-4">
          <FormResponseMessage state={passwordFormState} />
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-neutral-300 mb-1 font-poppins">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              required
              className="w-full px-4 py-2.5 rounded-md bg-gunmetal-gray/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow border-2 border-neutral-700 transition-colors duration-200 font-poppins"
            />
            {passwordFormState?.errors?.currentPassword && (
              <p className="mt-1 text-xs text-red-400">{passwordFormState.errors.currentPassword[0]}</p>
            )}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-neutral-300 mb-1 font-poppins">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              className="w-full px-4 py-2.5 rounded-md bg-gunmetal-gray/70 text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neon-yellow focus:border-neon-yellow border-2 border-neutral-700 transition-colors duration-200 font-poppins"
            />
            {passwordFormState?.errors?.newPassword && (
              <p className="mt-1 text-xs text-red-400">{passwordFormState.errors.newPassword[0]}</p>
            )}
          </div>
           {/* Optional: Add confirm password field client-side if desired */}
          <div className="pt-2">
            <SubmitButton label="Change Password" />
          </div>
        </form>
      </section>

      {/* Add other settings sections here (e.g., Notifications, Preferences) */}
    </div>
  );
}

// --- Main Client Page Component ---

interface ProfileClientPageProps {
  user: User;
  initialTab: string;
}

export default function ProfileClientPage({ user, initialTab }: ProfileClientPageProps) {
  // We manage the active tab based on the URL search param provided by the server component
  const activeTab = initialTab;

  const tabs = [
    { name: 'profile', label: 'Profile', icon: FiUser },
    // { name: 'favorites', label: 'Favorites', icon: FiStar }, // Add later if needed
    { name: 'settings', label: 'Settings', icon: FiSettings },
    // Add other tabs like 'billing' if applicable
  ];

  const getTabLinkClass = (tabName: string) => {
    return `flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors duration-150 font-poppins ${activeTab === tabName
        ? 'bg-gunmetal-gray text-neon-yellow'
        : 'text-neutral-400 hover:bg-neutral-800/60 hover:text-neutral-100'
      }`;
  };

  return (
    <div className="min-h-screen bg-jet-black text-neutral-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 md:mb-10 pb-6 border-b border-neutral-800">
          <Image
            src={user.image || '/images/default-avatar.png'} // Provide a default avatar
            alt={user.name || 'User Avatar'}
            width={80}
            height={80}
            className="rounded-full border-4 border-gunmetal-gray object-cover"
          />
          <div>
            <h1 className="text-3xl md:text-4xl font-bebas text-white uppercase tracking-wider">
              {user.name || 'User Profile'}
            </h1>
            <p className="text-neutral-400 font-poppins text-sm mt-1">Manage your profile and settings.</p>
          </div>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <Link key={tab.name} href={`/profile/me?tab=${tab.name}`} scroll={false} className={getTabLinkClass(tab.name)}>
                  <tab.icon className={`h-5 w-5 ${activeTab === tab.name ? 'text-neon-yellow' : 'text-neutral-500'}`} />
                  <span>{tab.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="md:col-span-3">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-2xl font-bebas text-white uppercase tracking-wide mb-4">Profile Overview</h2>
                {/* Display basic profile info here - Build this tab content later */}
                <p className="text-neutral-400 font-poppins italic">Profile details will be shown here.</p>
              </div>
            )}

            {/* {activeTab === 'favorites' && (
              <div>
                <h2 className="text-2xl font-bebas text-white uppercase tracking-wide mb-4">Favorites</h2>
                <p className="text-neutral-400 font-poppins italic">Favorite gyms/clubs will be listed here.</p>
              </div>
            )} */}

            {activeTab === 'settings' && (
              <SettingsForm user={user} />
            )}

            {/* Add content for other tabs here */}
          </main>
        </div>
      </div>
    </div>
  );
} 