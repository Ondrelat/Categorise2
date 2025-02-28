// app/categories/[slug]/page.tsx
import React from 'react';
import { notFound, redirect } from 'next/navigation';
import dynamic from "next/dynamic";

const FilmPage = dynamic(() => import("@/app/components/Cinema/FilmPage"), { ssr: true });

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    try {
        // Import à l'intérieur de la fonction pour éviter les références circulaires
        const { getCategoryBySlug } = await import('@/app/lib/categories');
        
        const category = await getCategoryBySlug(params.slug);
        
        if (!category) {
            notFound();
        }

        if (category.slug === "film") {
            return <FilmPage />;
        }

        // Rediriger vers la section par défaut (classement)
        // Utilisation de la redirection côté serveur plus fiable
        return redirect(`/categories/${params.slug}/classement`);
    } catch (error) {
        console.error('Error in CategoryPage:', error);
        notFound();
    }
}