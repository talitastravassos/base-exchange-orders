'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/orders');
  }, [router]);

  return <div className="p-10 text-center font-bold text-xl">Redirecting to Dashboard...</div>;
}
