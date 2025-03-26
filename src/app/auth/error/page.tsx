'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function ErrorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const errorCode = searchParams.get('error');
    
    // Map error codes to user-friendly messages
    const errorMessages: Record<string, string> = {
      'OAuthSignin': 'Error in the OAuth sign-in process.',
      'OAuthCallback': 'Error in the OAuth callback process.',
      'OAuthCreateAccount': 'Error creating user account via OAuth.',
      'EmailCreateAccount': 'Error creating user account via Email.',
      'Callback': 'Error in the callback handler.',
      'OAuthAccountNotLinked': 'Email already in use with different provider.',
      'EmailSignin': 'Error sending the verification email.',
      'CredentialsSignin': 'Invalid email or password.',
      'SessionRequired': 'Please sign in to access this page.',
      'Default': 'An unexpected error occurred.'
    };
    
    // Set the error message based on the error code
    setError(errorMessages[errorCode || ''] || errorMessages.Default);
  }, [searchParams]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4">
          <button
            onClick={() => router.back()}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Back
          </button>
          <Link
            href="/auth/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
} 