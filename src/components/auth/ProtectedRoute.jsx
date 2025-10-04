'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // जब ऑथेंटिकेशन स्टेट की जाँच पूरी हो जाए और यूज़र लॉग-इन न हो
    if (!loading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  // जब तक हम जाँच कर रहे हैं, एक लोडिंग स्पिनर दिखाएँ
  if (loading || !isAuthenticated) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // अगर यूज़र लॉग-इन है, तो पेज का कंटेंट दिखाएँ
  return children;
};