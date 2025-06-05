// app/categories/[name]/layout.tsx
import React from 'react';
import SideBar from '@/app/components/Category/Sidebar';
import NavigatorSection from '@/app/components/Category/NavigatorSection';

export default async function CategoryLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ name: string }> 
}) {
  // Await the params object before accessing its properties
  const resolvedParams = await params;
  const decodedCategoryName = decodeURIComponent(resolvedParams.name);

  return (
    <div className="flex flex-1 h-full mt-4 justify-center">
      <div className="relative">
        <div className="absolute -translate-x-full">
          <SideBar categoryName={decodedCategoryName} />
        </div>
        <div className="w-[800px] ml-4">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{decodedCategoryName}</h1>
            <NavigatorSection />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}