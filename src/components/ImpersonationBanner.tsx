'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { FiAlertTriangle, FiArrowLeft, FiUser } from 'react-icons/fi';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ImpersonationBanner() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // If the user is not being impersonated, don't show anything
  if (!session?.user?.isImpersonating) {
    return null;
  }

  const stopImpersonating = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/stop-impersonating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to stop impersonating');
      }

      const data = await response.json();
      
      if (data.success) {
        // First sign out of the current impersonated session
        await signOut({ redirect: false });
        
        // Then sign in as the admin
        const signInResult = await signIn('credentials', {
          email: data.user.email,
          password: 'admin-return',
          redirect: false,
        });
        
        if (signInResult?.error) {
          throw new Error(`Failed to sign in as admin: ${signInResult.error}`);
        }
        
        // Redirect to the admin panel
        window.location.href = '/admin/users';
      }
    } catch (error) {
      console.error('Error stopping impersonation:', error);
      alert('Failed to stop impersonating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const viewUserProfile = () => {
    router.push(`/profile/${session.user.id}`);
  };

  return (
    <div className="bg-yellow-500 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <FiAlertTriangle className="mr-2" />
          <span>
            You are signed in as <strong>{session.user.name}</strong> (Impersonated by {session.user.originalAdmin})
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={viewUserProfile}
            className="bg-yellow-400 text-yellow-800 px-3 py-1 rounded-md text-sm font-medium flex items-center hover:bg-yellow-300"
          >
            <FiUser className="mr-1" /> View Profile
          </button>
          <button
            onClick={stopImpersonating}
            disabled={isLoading}
            className="bg-white text-yellow-600 px-3 py-1 rounded-md text-sm font-medium flex items-center hover:bg-yellow-50"
          >
            {isLoading ? (
              'Loading...'
            ) : (
              <>
                <FiArrowLeft className="mr-1" /> Return to Admin
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
} 