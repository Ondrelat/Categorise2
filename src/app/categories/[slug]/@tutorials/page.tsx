// app/categories/[slug]/@tutorials/page.tsx
import React from 'react';
import { getTutorialsByCategoryGroupedByLevel } from '@/lib/articles';
import TutorialTabs from '../apprentissage/TutorialTabs';

export default async function TutorialsPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const categorySlug = decodeURIComponent(resolvedParams.slug);
  
  try {
    const tutorialsByLevel = await getTutorialsByCategoryGroupedByLevel(categorySlug);

    // Si pas de tutoriels, retourner null
    if (!tutorialsByLevel || Object.keys(tutorialsByLevel).length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-4">
        <TutorialTabs tutorialsByLevel={tutorialsByLevel} />
      </div>
    );
  } catch (error: unknown) {
    console.error('Erreur lors du chargement des tutoriels:', error);
    return null;
  }
}