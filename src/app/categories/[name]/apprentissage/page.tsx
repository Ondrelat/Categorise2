// app/categories/[name]/apprentissage/page.tsx
import React from 'react';
import { getTutorialsByCategoryGroupedByLevel } from '@/lib/articles';
import TutorialTabs from './TutorialTabs';

export default async function ApprentissagePage({
  params
}: {
  params: Promise<{ name: string }>;
}) {
  const resolvedParams = await params;
  const categoryName = decodeURIComponent(resolvedParams.name);
  const tutorialsByLevel = await getTutorialsByCategoryGroupedByLevel(categoryName);

  return (
    <div className="mt-6">
      <h1 className="text-2xl font-bold mb-4">Ressources d&apos;apprentissage</h1>
      <TutorialTabs tutorialsByLevel={tutorialsByLevel} />
    </div>
  );
}
