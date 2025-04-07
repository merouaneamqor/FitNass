import React, { useState } from 'react';
import { UserProfile } from '@/types/user';
import { FiUser, FiImage, FiMapPin, FiAlignLeft } from 'react-icons/fi';
import Image from 'next/image';

interface ProfileEditFormProps {
  profile: UserProfile;
  onSave: (updatedProfile: Partial<UserProfile>) => Promise<boolean>;
  onCancel: () => void;
  className?: string;
}

export const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  profile,
  onSave,
  onCancel,
  className = "",
}) => {
  const [name, setName] = useState(profile.name);
  const [image, setImage] = useState(profile.image || '');
  const [bio, setBio] = useState(profile.bio || '');
  const [city, setCity] = useState(profile.city || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const updatedProfile: Partial<UserProfile> = {
        name,
        image: image || undefined,
        bio: bio || undefined,
        city: city || undefined,
      };

      const success = await onSave(updatedProfile);
      if (!success) {
        throw new Error('Failed to update profile');
      }
    } catch (err) {
      setError('Error updating profile. Please try again.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`bg-white border border-neutral-200 rounded-xl p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
      
      {error && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <FiUser className="inline-block mr-2" />
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              required
            />
          </div>
          
          {/* Profile Image URL */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <FiImage className="inline-block mr-2" />
              Profile Image URL
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="https://example.com/your-image.jpg"
            />
            <div className="relative w-32 h-32 rounded-full overflow-hidden">
              <Image
                src={image || profile.image || '/default-avatar.png'}
                alt={name || profile.name || 'User'}
                width={128}
                height={128}
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          {/* City */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <FiMapPin className="inline-block mr-2" />
              City
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Casablanca"
            />
          </div>
          
          {/* Bio */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              <FiAlignLeft className="inline-block mr-2" />
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className="w-full p-3 rounded-xl border border-neutral-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Tell us about yourself..."
            />
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 hover:bg-neutral-50 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 rounded-lg text-white hover:bg-indigo-700 transition-colors flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></span>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileEditForm; 