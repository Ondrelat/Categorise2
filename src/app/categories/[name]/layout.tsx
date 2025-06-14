// app/categories/[name]/layout.tsx
import React from 'react';
import SideBar from '@/components/Category/Sidebar';
import NavigatorSection from '@/components/Category/NavigatorSection';
import { getMissingArticleTypes } from '@/lib/actions';

export default async function CategoryLayout({ 
  children,
  params 
}: { 
  children: React.ReactNode, 
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);
  const missingTypes = await getMissingArticleTypes(name);

  return (
    <div className="flex flex-1 h-full mt-4 justify-center">
      <div className="relative">
        <div className="absolute -translate-x-full">
          <SideBar categoryName={name} />
        </div>
        <div className="w-[800px] ml-4">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{name}</h1>
              <NavigatorSection missingTypes={missingTypes} />
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}