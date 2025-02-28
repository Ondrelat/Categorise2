'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type ContentSection = 'classement' | 'forum' | 'apprentissage' | 'media';

const NavigatorSection: React.FC = () => {
    const [activeSection, setActiveSection] = useState<ContentSection>('classement');
    const router = useRouter();
    const pathname = usePathname();
    
    // Fonction pour obtenir l'URL de base actuelle (sans la dernière partie du chemin)
    const getBaseUrl = () => {
        // Si le pathname contient déjà une des sections, on remonte d'un niveau
        const sections = ['classement', 'forum', 'apprentissage', 'media'];
        if(!pathname) return '';
        const lastSegment = pathname.split('/').pop();
        
        if (sections.includes(lastSegment || '')) {
            return pathname.substring(0, pathname.lastIndexOf('/'));
        }
        
        return pathname;
    };

    const handleSectionClick = (section: ContentSection) => {
        setActiveSection(section);
        const baseUrl = getBaseUrl();
        router.push(`${baseUrl}/${section}`);
    };

    return (
        <div>
            <div className="flex mb-4 justify-between items-center">
                <div>
                    {(['classement', 'forum', 'apprentissage', 'media'] as ContentSection[]).map((section) => (
                        <button
                            key={section}
                            className={`mr-2 px-4 py-2 rounded-md ${
                                activeSection === section ? 'bg-blue-400 text-white' : 'bg-gray-200'
                            }`}
                            onClick={() => handleSectionClick(section)}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default NavigatorSection;