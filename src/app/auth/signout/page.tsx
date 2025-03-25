'use client';

import { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOut() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleSignOut = async () => {
      try {
        await signOut({ redirect: false });
        router.push('/');
      } catch (error) {
        console.error('Error signing out:', error);
      } finally {
        setIsLoading(false);
      }
    };

    handleSignOut();
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Signing Out</h2>
          {isLoading ? (
            <p className="text-gray-600">Please wait while we sign you out...</p>
          ) : (
            <div>
              <p className="text-gray-600 mb-4">You have been successfully signed out.</p>
              <button
                onClick={() => router.push('/')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              >
                Return to Home
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 