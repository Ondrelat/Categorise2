// app/[name]/layout.tsx
import React from 'react';
import { notFound } from 'next/navigation';
import SideBar from '@/app/components/Category/Sidebar';
import { getCategoryByName } from '@/app/lib/categories';
import dynamic from "next/dynamic";
import NavigatorSection from '@/app/components/Category/NavigatorSection';

const FilmPage = dynamic(() => import("@/app/components/Cinema/FilmPage"), { ssr: true });

export default async function CategoryLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode, 
  params: { name: string } 
}) {
    const category = await getCategoryByName(params.name);

    if (!category) {
        notFound();
    }

    return (
      <div className="flex flex-1 h-full mt-4 justify-center">
        <div className="relative">
          <div className="absolute -translate-x-full">
            {/* La SideBar ne sera pas re-rendue si la catégorie est mise en cache */}
            <SideBar category={category} />
          </div>
          <div className="w-[800px] ml-4">
            <div className="container mx-auto px-4 py-8">
              <h1 className="text-3xl font-bold mb-6">{category.name}</h1>
              <NavigatorSection />
              {category.name === "Film" ? <FilmPage /> : children}
            </div>
          </div>
        </div>
      </div>
    );
}