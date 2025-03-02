// app/[name]/layout.tsx
import React from 'react';
import SideBar from '@/app/components/Category/Sidebar';
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
  // Décoder le nom de la catégorie pour restaurer les accents et espaces
  const decodedCategoryName = decodeURIComponent(params.name);

  return (
    <div className="flex flex-1 h-full mt-4 justify-center">
      <div className="relative">
        <div className="absolute -translate-x-full">
          {/* Passer le nom décodé à la SideBar */}
          <SideBar categoryName={decodedCategoryName} />
        </div>
        <div className="w-[800px] ml-4">
          <div className="container mx-auto px-4 py-8">
            {/* Afficher le nom décodé dans le titre */}
            <h1 className="text-3xl font-bold mb-6">{decodedCategoryName}</h1>
            <NavigatorSection />
            {decodedCategoryName === "Film" ? <FilmPage /> : children}
          </div>
        </div>
      </div>
    </div>
  );
}