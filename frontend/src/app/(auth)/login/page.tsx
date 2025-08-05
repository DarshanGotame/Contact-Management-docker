"use client";
import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

// Component that uses useSearchParams - must be wrapped in Suspense
const LoginContent = () => {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    const verified = searchParams.get('verified');
    const error = searchParams.get('error');

    if (verified === 'true') {
      setMessage({ type: 'success', text: 'Email verified successfully! You can now sign in.' });
    } else if (error) {
      switch (error) {
        case 'invalid-verification-token':
          setMessage({ type: 'error', text: 'Invalid verification token. Please request a new verification email.' });
          break;
        case 'verification-token-expired':
          setMessage({ type: 'error', text: 'Verification token has expired. Please request a new verification email.' });
          break;
        case 'verification-failed':
          setMessage({ type: 'error', text: 'Email verification failed. Please try again.' });
          break;
        default:
          setMessage({ type: 'error', text: 'An error occurred during verification.' });
      }
    }
  }, [searchParams]);

  return (
    <>
      {/* Verification Messages */}
      {message && (
        <div className={`rounded-md p-4 ${
          message.type === 'success' 
            ? 'bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700' 
            : 'bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700'
        }`}>
          <p className={`text-sm ${
            message.type === 'success' 
              ? 'text-green-800 dark:text-green-200' 
              : 'text-red-800 dark:text-red-200'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <LoginForm />
    </>
  );
};

const LoginPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Welcome back! Please enter your credentials
          </p>
        </div>

        <Suspense fallback={<div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-20 rounded"></div>}>
          <LoginContent />
        </Suspense>

        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              Create one here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
