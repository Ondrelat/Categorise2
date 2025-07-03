import React, { Suspense } from 'react';
import SideBar from '@/components/Category/Sidebar';
import NavigatorSection from '@/components/Category/NavigatorSection';
import { getMissingArticleTypes } from '@/lib/articles';

async function MissingTypesLoader({ name }: { name: string }) {
  const missingTypes = await getMissingArticleTypes(name);
  return <NavigatorSection missingTypes={missingTypes} categoryName={name} />;
}

async function SidebarLoader({ name }: { name: string }) {
  return <SideBar categoryName={name} />;
}

async function ContentLoader({ children }: { children: React.ReactNode }) {
  // Simule un petit délai pour le contenu principal
  await new Promise(resolve => setTimeout(resolve, 200));
  return <>{children}</>;
}

export default async function CategoryLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const name = decodeURIComponent(resolvedParams.name);

  return (
    <div className="flex flex-1 h-full mt-4 justify-center">
      <div className="relative">
        <div className="absolute -translate-x-full">
          <Suspense fallback={<div className="w-64 h-full bg-gray-100 animate-pulse">Chargement sidebar...</div>}>
            <SidebarLoader name={name} />
          </Suspense>
        </div>
        <div className="w-[800px] ml-4">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{name}</h1>

            <Suspense fallback={<div className="h-12 mb-4 bg-gray-100 animate-pulse">Chargement navigation...</div>}>
              <MissingTypesLoader name={name} />
            </Suspense>

            <Suspense fallback={
              <div className="min-h-[400px] bg-gray-50 animate-pulse rounded-lg mt-4">
                Chargement du contenu...
              </div>
            }>
              <ContentLoader>
                {children}
              </ContentLoader>
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}