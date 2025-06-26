'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { ARTICLE_TYPES, ContentSection } from '@/app/types';

interface NavigatorSectionProps {
    missingTypes?: ContentSection[];
    categoryName: string;
}

const NavigatorSection: React.FC<NavigatorSectionProps> = ({
    missingTypes = [],
    categoryName
}) => {
    const router = useRouter();
    const pathname = usePathname();

    const [activeSection, setActiveSection] = useState<ContentSection | undefined>(undefined);


    // Calculer les sections disponibles
    const availableSections = ARTICLE_TYPES.filter(section => !missingTypes.includes(section));

    // Fonction pour extraire la section depuis l'URL
    const getSectionFromPath = useCallback((): ContentSection => {
        if (!pathname) return availableSections[0] || 'Classement';

        const lastSegment = pathname.split('/').pop() || '';
        const decodedSegment = decodeURIComponent(lastSegment).toLowerCase();

        const foundSection = availableSections.find(
            (section) => section.toLowerCase() === decodedSegment
        );

        return foundSection || availableSections[0] || 'Classement';
    }, [pathname, availableSections]);



    const [showMissingDropdown, setShowMissingDropdown] = useState(false);

    // Synchroniser activeSection avec l'URL lors des changements
    useEffect(() => {
        if (!pathname || availableSections.length === 0) return;
        setActiveSection(getSectionFromPath());
    }, [pathname, getSectionFromPath, availableSections]);

    const handleSectionClick = (section: ContentSection) => {
        setActiveSection(section);
        router.push(`/categories/${categoryName}/${section.toLowerCase()}`);
    };

    const handleAddMissingType = (missingType: ContentSection) => {
        router.push(`/categories/${categoryName}/create-article?type=${missingType}&category=${encodeURIComponent(categoryName)}`);
        setShowMissingDropdown(false);
    };

    // Si aucune section disponible
    if (availableSections.length === 0) {
        return (
            <div className="flex mb-4 justify-between items-center">
                <div className="text-gray-500">
                    Aucun contenu disponible pour cette catégorie
                </div>
                {missingTypes.length > 0 && (
                    <div className="relative">
                        <button
                            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                            onClick={() => setShowMissingDropdown(!showMissingDropdown)}
                        >
                            + Ajouter du contenu
                        </button>
                        {showMissingDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {missingTypes.map((missingType) => (
                                    <button
                                        key={missingType}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                        onClick={() => handleAddMissingType(missingType)}
                                    >
                                        + {missingType.charAt(0).toUpperCase() + missingType.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="flex mb-4 justify-between items-center">
            <div className="flex items-center">
                {/* Sections disponibles */}
                {availableSections.map((section) => (
                    <button
                        key={section}
                        className={`mr-2 px-4 py-2 rounded-md transition-all duration-200 ${activeSection === section
                            ? 'bg-blue-400 text-white'
                            : 'bg-gray-200 hover:bg-gray-300'
                            }`}
                        onClick={() => handleSectionClick(section)}
                    >
                        {section.charAt(0).toUpperCase() + section.slice(1)}
                    </button>
                ))}

                {/* Bouton pour ajouter des types manquants */}
                {missingTypes.length > 0 && (
                    <div className="relative ml-2">
                        <button
                            className="px-3 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200 transition-colors border-2 border-dashed border-gray-300"
                            onClick={() => setShowMissingDropdown(!showMissingDropdown)}
                            title="Ajouter un nouveau type de contenu"
                        >
                            +
                        </button>
                        {showMissingDropdown && (
                            <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                {missingTypes.map((missingType) => (
                                    <button
                                        key={missingType}
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                                        onClick={() => handleAddMissingType(missingType)}
                                    >
                                        + {missingType.charAt(0).toUpperCase() + missingType.slice(1)}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default NavigatorSection;