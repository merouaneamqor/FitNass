import React from 'react';
import { UserProfile } from '@/types/user';
import { FiUser, FiMail, FiMapPin, FiCalendar } from 'react-icons/fi';
import Image from 'next/image';

interface ProfileHeaderProps {
  profile: UserProfile;
  isOwnProfile?: boolean;
  onEditClick?: () => void;
  className?: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  profile,
  isOwnProfile = false,
  onEditClick,
  className = "",
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    });
  };

  return (
    <div className={`bg-white border-b border-neutral-100 ${className}`}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="relative">
            <Image
              src={profile.image || '/default-avatar.png'}
              alt="Profile photo"
              width={96}
              height={96}
              className="h-24 w-24 rounded-full object-cover border-4 border-white"
            />
            {profile.role === 'gym-owner' && (
              <span className="absolute bottom-0 right-0 bg-indigo-600 text-white text-xs px-2 py-1 rounded-full">
                Gym Owner
              </span>
            )}
            {profile.role === 'admin' && (
              <span className="absolute bottom-0 right-0 bg-rose-600 text-white text-xs px-2 py-1 rounded-full">
                Admin
              </span>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-neutral-900">{profile.name}</h1>
                <div className="mt-1 flex items-center text-neutral-600">
                  <FiMail className="h-4 w-4 mr-1.5" />
                  <span>{profile.email}</span>
                </div>
                {profile.city && (
                  <div className="mt-1 flex items-center text-neutral-600">
                    <FiMapPin className="h-4 w-4 mr-1.5" />
                    <span>{profile.city}</span>
                  </div>
                )}
                <div className="mt-1 flex items-center text-neutral-600">
                  <FiCalendar className="h-4 w-4 mr-1.5" />
                  <span>Member since {formatDate(profile.memberSince || profile.createdAt)}</span>
                </div>
              </div>
              
              {isOwnProfile && onEditClick && (
                <button
                  onClick={onEditClick}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-all"
                >
                  Edit Profile
                </button>
              )}
            </div>
            
            {profile.bio && (
              <div className="mt-4 text-neutral-700">
                <p>{profile.bio}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 