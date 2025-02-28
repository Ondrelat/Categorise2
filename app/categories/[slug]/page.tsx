import React from 'react';
import { notFound, redirect } from 'next/navigation';

import { getCategoryBySlug } from '@/app/lib/categories';
import dynamic from "next/dynamic";

const FilmPage = dynamic(() => import("@/app/components/Cinema/FilmPage"), { ssr: true });

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await getCategoryBySlug(params.slug);
    
    if (!category) {
        notFound();
    }

    if (category.slug === "film") {
        return <FilmPage />;
    }


    return redirect(`/categories/${params.slug}/classement`);


}

