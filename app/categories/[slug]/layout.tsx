import React from 'react';
import { notFound } from 'next/navigation';
import SideBar from '@/app/components/Category/Sidebar';
import { getCategoryBySlug } from '@/app/lib/categories';
import dynamic from "next/dynamic";
import NavigatorSection from '@/app/components/Category/NavigatorSection';

const FilmPage = dynamic(() => import("@/app/components/Cinema/FilmPage"), { ssr: true });
type ContentSection = 'classement' | 'forum' | 'apprentissage' | 'media';


interface Article {
    id: string;
    title: string;
    type: ContentSection;
}

export default async function CategoryLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode, 
  params: { slug: string } 
}) {
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
            <div className="absolute -translate-x-full">
              <SideBar initialSlug={params.slug} />
            </div>
            <div className="w-[800px] ml-4">
              <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
                <NavigatorSection />
                {children}
              </div>
            </div>
          </div>
        </div>
    );
}