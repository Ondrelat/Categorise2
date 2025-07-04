import React, { Suspense } from 'react';
import NavigatorSection from '@/components/Category/NavigatorSection';
import { getMissingArticleTypes } from '@/lib/articles';

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
  params: { name: string };
}) {
  const name = decodeURIComponent(params.name);
  const missingTypes = await getMissingArticleTypes(name);

  return (
    <div className="w-[800px] ml-4">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{name}</h1>

        <NavigatorSection missingTypes={missingTypes} categoryName={name} />

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
  );
}