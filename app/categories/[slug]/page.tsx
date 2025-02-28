import React from 'react';
import { notFound } from 'next/navigation';
import CategoryContent from '@/app/components/Category/CategoryContent';
import { getCategoryBySlug } from '@/app/lib/categories';
import dynamic from "next/dynamic";
import SideBar from '@/app/components/Category/Sidebar';

const FilmPage = dynamic(() => import("@/app/components/Cinema/FilmPage"), { ssr: true });

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const category = await getCategoryBySlug(params.slug);
    
    if (!category) {
        notFound();
    }

    if (category.slug === "film") {
        return <FilmPage />;
    }

    return (
        <div className="flex flex-1 h-full mt-4 justify-center">
        <div className="relative">
          <div className="absolute -translate-x-full"> {/* Utilisation de transform pour décaler */}
            <SideBar initialSlug={params.slug} />
          </div>
          <div className="w-[800px] ml-4"> {/* Largeur fixe pour le children */}
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
                <CategoryContent
                    categoryId={category.id.toString()}
                    slug={params.slug}
                />
            </div>
          </div>
    
        </div>
      </div>

    );
}

