// app/categories/[name]/layout.tsx
import React, { Suspense } from 'react';
import NavigatorSection from '@/components/Category/NavigatorSection';
import { getMissingArticleTypes } from '@/lib/articles';

async function ContentLoader({ children }: { children: React.ReactNode }) {
  // Simule un petit délai pour le contenu principal
  await new Promise(resolve => setTimeout(resolve, 200));
  return <>{children}</>;
}

// Créez un composant wrapper asynchrone pour NavigatorSection
async function NavigatorSectionLoader({
  categorySlug
}: {
  categorySlug: string
}) {
  const missingTypes = await getMissingArticleTypes(categorySlug);
  return <NavigatorSection missingTypes={missingTypes} categorySlug={categorySlug} />;
}

export default async function CategoryLayout({
  children,
  params
}: {
  children: React.ReactNode,
  params: { slug: string };
}) {
  const resolvedParams = await params;
  const slug = decodeURIComponent(resolvedParams.slug);


  return (
    <div className="w-[800px] ml-4">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">{slug}</h1>

        <Suspense fallback={
          <div className="h-[56px] bg-gray-50 animate-pulse rounded-lg mb-4">
            Chargement de la navigation...
          </div>
        }>
          <NavigatorSectionLoader categorySlug={slug} />
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
  );
}