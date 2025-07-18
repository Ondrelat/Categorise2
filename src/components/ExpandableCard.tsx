'use client';

import * as React from 'react';
import { Suspense, useState } from 'react';
import { ChevronUp, ChevronDown, Trophy, BookOpen, Eye, MessageCircle } from 'lucide-react'; // Importe tous les icônes nécessaires ici

interface ExpandableCardProps {
  title: string;
  iconName: string; // Changé en string pour le nom de l'icône
  children: React.ReactNode;
  previewContent?: React.ReactNode;
  defaultExpanded?: boolean;
  showCount?: number;
  loadingText: string;
}

const iconMap: { [key: string]: React.ComponentType<{ size?: number; className?: string }> } = {
  Trophy,
  BookOpen,
  Eye,
  MessageCircle,
  // Ajoute d'autres icônes si nécessaire
};

export default function ExpandableCard({ 
  title, 
  iconName, 
  children, 
  previewContent,
  defaultExpanded = false,
  showCount,
  loadingText
}: ExpandableCardProps): React.ReactElement | null {
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  const toggleExpanded = (): void => {
    setIsExpanded(!isExpanded);
  };

  // Résoudre l'icône à partir du map
  const Icon = iconMap[iconName];
  if (!Icon) {
    console.error(`Icône non trouvée: ${iconName}`);
    return null; // Ou affiche une icône par défaut
  }

  // Si pas de contenu du tout, ne pas afficher
  if (!children && !previewContent) {
    return null;
  }

  // Si le contenu est explicitement null, ne pas afficher
  if (children === null || (children === undefined && !previewContent)) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden flex-1 min-h-0">
      <div className="p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Icon size={24} className="text-blue-600" />
            <h2 className="text-xl font-bold text-gray-900">{title}</h2>
            {showCount !== undefined && showCount > 0 && (
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                {showCount}
              </span>
            )}
          </div>
          <button
            onClick={toggleExpanded}
            className="flex items-center gap-2 px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
            aria-expanded={isExpanded}
            aria-label={isExpanded ? `Réduire ${title}` : `Développer ${title}`}
            type="button"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} />
                Réduire
              </>
            ) : (
              <>
                <ChevronDown size={16} />
                Voir plus
              </>
            )}
          </button>
        </div>

        {/* Affichage du contenu preview quand replié */}
        {!isExpanded && previewContent && (
          <div className="text-gray-600 flex-1 overflow-hidden">
            {previewContent}
          </div>
        )}

        {/* Affichage du contenu complet quand déplié */}
        {isExpanded && (
          <div className="animate-in slide-in-from-top-2 duration-200 flex-1 overflow-auto">
            <Suspense fallback={
              <div className="flex items-center justify-center py-8 h-full">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">{loadingText}</span>
              </div>
            }>
              {children}
            </Suspense>
          </div>
        )}
      </div>
    </div>
  );
}