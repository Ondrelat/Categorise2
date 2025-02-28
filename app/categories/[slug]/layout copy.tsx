// app/categories/[slug]/layout.tsx
'use client'; // Conversion en Client Component

import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import CategoryLayout from '@/app/components/Category/CategoryLayout';

interface CategoryLayoutProps {
  children: React.ReactNode;
  params: { 
    slug: string;
  }
}

async function fetchCategory(slug: string) {
    try {
        const { getCategoryBySlug } = await import('@/app/lib/categories');
        return getCategoryBySlug(slug);
    } catch (error) {
        console.error('Error fetching category:', error);
        return null;
    }
}

export default function CategoryPageLayout({ 
  children,
  params 
}: CategoryLayoutProps) {
    const [category, setCategory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        fetchCategory(params.slug).then(categoryData => {
            if (!categoryData) {
                notFound();
            } else {
                setCategory(categoryData);
            }
            setLoading(false);
        });
    }, [params.slug]);

    if (loading) {
        return <div>Chargement...</div>;
    }

    if (!category) {
        return null;
    }

    // Si c'est la catégorie film, ne pas utiliser notre layout personnalisé
    if (category.slug === "film") {
        return <>{children}</>;
    }

    return (
        <CategoryLayout 
          categorySlug={params.slug}
          categoryName={category.name}
        >
          {children}
        </CategoryLayout>
    );
}