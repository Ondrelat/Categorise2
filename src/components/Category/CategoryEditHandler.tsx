'use client';

import { useRouter } from 'next/navigation';

interface CategoryEditHandlerProps {
  isOndrelat: boolean;
  onPermissionError: (message: string) => void;
}

export default function CategoryEditHandler({ 
  isOndrelat, 
  onPermissionError 
}: CategoryEditHandlerProps) {
  const router = useRouter();

  const handleEdit = (categoryId: string) => {
    if (!isOndrelat) {
      onPermissionError("Vous n'avez pas les permissions pour modifier les catégories");
      return;
    }
    router.push(`/admin/categories/edit/${categoryId}`);
  };

  return { handleEdit };
}