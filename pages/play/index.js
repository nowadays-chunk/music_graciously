import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function PlayIndex() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/play/guitar');
  }, [router]);

  return null;
}
