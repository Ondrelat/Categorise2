'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';

type ContentSection = 'classement' | 'forum' | 'apprentissage' | 'media';
const SECTIONS = ['classement', 'forum', 'apprentissage', 'media'] as ContentSection[];

const NavigatorSection: React.FC = () => {
    const router = useRouter();
    const pathname = usePathname();
    
    // Mémoriser la fonction avec useCallback
    const getSectionFromPath = useCallback((): ContentSection => {
        if (!pathname) return 'classement';
        
        const lastSegment = pathname.split('/').pop() || '';
        const decodedSegment = decodeURIComponent(lastSegment);
        
        return SECTIONS.includes(decodedSegment as ContentSection) 
            ? (decodedSegment as ContentSection) 
            : 'classement';
    }, [pathname]);
    
    // Initialiser activeSection avec la valeur correcte depuis l'URL
    const [activeSection, setActiveSection] = useState<ContentSection>(getSectionFromPath());
    
    // Mettre à jour activeSection quand getSectionFromPath change
    useEffect(() => {
        setActiveSection(getSectionFromPath());
    }, [getSectionFromPath]);

    // Mémoriser la fonction getBaseUrl avec useCallback
    const getBaseUrl = useCallback(() => {
        if(!pathname) return '';
        const lastSegment = pathname.split('/').pop() || '';
        const decodedSegment = decodeURIComponent(lastSegment);
        
        if (SECTIONS.includes(decodedSegment as ContentSection)) {
            return pathname.substring(0, pathname.lastIndexOf('/'));
        }
        
        return pathname;
    }, [pathname]);

    const handleSectionClick = useCallback((section: ContentSection) => {
        setActiveSection(section);
        const baseUrl = getBaseUrl();
        router.push(`${baseUrl}/${section}`);
    }, [getBaseUrl, router]);

    return (
        <div>
            <div className="flex mb-4 justify-between items-center">
                <div>
                    {SECTIONS.map((section) => (
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