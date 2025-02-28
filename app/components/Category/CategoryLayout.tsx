'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type SectionType = 'classement' | 'forum' | 'apprentissage' | 'media';

interface CategoryLayoutProps {
  children: React.ReactNode;
  categoryName: string;
}

const CategoryLayout: React.FC<CategoryLayoutProps> = ({ 
  children, 
  categoryName
}) => {
  const pathname = usePathname();
  
  const sections: SectionType[] = ['classement', 'forum', 'apprentissage', 'media'];
  
  const getActiveSection = (): SectionType => {
    if(!pathname) return 'classement';
    
    // Amélioration de la détection de section active
    const pathParts = pathname.split('/');
    const sectionFromPath = pathParts[pathParts.length - 1];
    
    if (sections.includes(sectionFromPath as SectionType)) {
      return sectionFromPath as SectionType;
    }
    
    return 'classement'; // Section par défaut
  };

  const activeSection = getActiveSection();

  return (
    <div className="flex flex-1 h-full mt-4 justify-center">
      <div className="relative">
        <div className="absolute -translate-x-full">
          {/* Sidebar component here if needed */}
        </div>
        <div className="w-[800px] ml-4">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">{categoryName}</h1>
            
            <div className="flex mb-4 justify-between items-center">
              <div>
                {sections.map((section) => (
                  <Link
                    key={section}
                    href={`/categories/${categoryName}/${section}`}
                    className={`mr-2 px-4 py-2 rounded-md inline-block ${
                      activeSection === section ? 'bg-blue-400 text-white' : 'bg-gray-200'
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </Link>
                ))}
              </div>
              <Link 
                href={`/categories/${categoryName}/create-article`} 
                className="bg-blue-400 text-white font-bold py-2 px-4 rounded"
              >
                Créer un article
              </Link>
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryLayout;