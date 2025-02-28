import React from 'react';
import { notFound, redirect } from 'next/navigation';

import { getCategoryByName } from '@/app/lib/categories';
import dynamic from "next/dynamic";

const FilmPage = dynamic(() => import("@/app/components/Cinema/FilmPage"), { ssr: true });

export default async function CategoryPage({ params }: { params: { name: string } }) {
    const category = await getCategoryByName(params.name);
    
    if (!category) {
        notFound();
    }

    if (category.name === "film") {
        return <FilmPage />;
    }


    return redirect(`/categories/${params.name}/classement`);


}

