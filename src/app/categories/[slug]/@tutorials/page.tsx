import React from 'react';
import { getTutorialsByCategoryGroupedByLevel } from '@/lib/articles';
import TutorialTabs from '../apprentissage/TutorialTabs';
import ExpandableCard from '@/components/ExpandableCard'; // Assure-toi que le chemin est correct

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

    // Préparer le contenu complet
    const fullContent = (
      <div className="space-y-4">
        <TutorialTabs tutorialsByLevel={tutorialsByLevel} />
      </div>
    );

    // Préparer une version preview : par exemple, limiter à un certain nombre de tutoriels par niveau
    // Assumons que tutorialsByLevel est un objet comme { beginner: array, intermediate: array, advanced: array }
    // Limiter à 3 tutoriels par niveau pour le preview (ajuste selon tes besoins)
    const previewTutorialsByLevel = Object.fromEntries(
      Object.entries(tutorialsByLevel).map(([level, tutorials]) => [level, tutorials.slice(0, 3)])
    );

    const previewContent = (
      <div className="space-y-4">
        <TutorialTabs tutorialsByLevel={previewTutorialsByLevel} />
      </div>
    );
    
    return (
      <ExpandableCard
        title="Tutoriels & Guides"
        iconName="BookOpen"
        previewContent={
          <div className="h-full overflow-hidden relative">
            {previewContent}
            {/* Gradient fade pour indiquer qu'il y a plus de contenu */}
            <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          </div>
        }
        loadingText="Chargement des tutoriels..."
        // showCount={Object.values(tutorialsByLevel).flat().length} // Optionnel : affiche le nombre total de tutoriels
      >
        {fullContent}
      </ExpandableCard>
    );
  } catch (error: unknown) {
    console.error('Erreur lors du chargement des tutoriels:', error);
    return null;
  }
}