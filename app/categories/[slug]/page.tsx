import React from 'react';
import { notFound } from 'next/navigation';
import CategoryContent from '@/app/components/CategoryContent';
import { getCategoryBySlug } from '@/app/lib/categories';
import dynamic from "next/dynamic";

const FilmPage = dynamic(() => import("./FilmPage"), { ssr: true });

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await getCategoryBySlug(params.slug);
    
    if (!category) {
        notFound();
    }

    if (category.slug === "film") {
        return <FilmPage />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
            <CategoryContent
                categoryId={category.id.toString()}
                slug={params.slug}
            />
        </div>
    );
}
