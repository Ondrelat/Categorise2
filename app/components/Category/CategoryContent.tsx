'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

type ContentSection = 'classement' | 'forum' | 'apprentissage' | 'media';

interface Article {
    id: string;
    title: string;
    type: ContentSection;
}

const CategoryContent: React.FC<{ categoryId: string; slug: string }> = ({ categoryId, slug }) => {
    const [activeSection, setActiveSection] = useState<ContentSection>('classement');
    const [articles, setArticles] = useState<Article[]>([]);

    useEffect(() => {
        // Fetch articles for the active section 
        const fetchArticles = async () => {
            const response = await fetch(`/api/articles?categoryId=${categoryId}&type=${activeSection}`);
            if (response.ok) {
                const data = await response.json();
                setArticles(data);
            }
        };
        fetchArticles();
    }, [categoryId, activeSection]);

    return (
        <div>
            <div className="flex mb-4 justify-between items-center">
                <div>
                    {(['classement', 'forum', 'apprentissage', 'media'] as ContentSection[]).map((section) => (
                        <button
                            key={section}
                            className={`mr-2 px-4 py-2 rounded-md ${activeSection === section ? 'bg-blue-400 text-white' : 'bg-gray-200'
                                }`}
                            onClick={() => setActiveSection(section)}
                        >
                            {section.charAt(0).toUpperCase() + section.slice(1)}
                        </button>
                    ))}
                </div>
                <Link href={`/categories/${slug}/create-article`} className="bg-blue-400 text-white font-bold py-2 px-4 rounded">
                    Créer un article
                </Link>
            </div>
            <div className="mt-4">
                {articles.map((article) => (
                    <div key={article.id} className="mb-2">
                        <Link href={`/categories/${slug}/${article.id}`} className="text-blue-400 hover:underline">
                            {article.title}
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryContent;