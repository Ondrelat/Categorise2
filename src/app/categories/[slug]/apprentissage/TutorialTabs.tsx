'use client';

import { useState } from 'react';

interface Article {
    id: string;
    title?: string;
    content?: string;
    level?: string;
}

export default function TutorialTabs({
    tutorialsByLevel
}: {
    tutorialsByLevel: Record<string, Article[]>;
}) {
    const levels = Object.keys(tutorialsByLevel);
    const [activeLevel, setActiveLevel] = useState(levels[0] || '');

    const tutorials = tutorialsByLevel[activeLevel] || [];

    return (
        <div>
            <div className="flex gap-2 mb-4">
                {levels.map((level) => (
                    <button
                        key={level}
                        onClick={() => setActiveLevel(level)}
                        className={`px-3 py-1 rounded border ${level === activeLevel ? 'bg-blue-600 text-white' : 'bg-gray-200'
                            }`}
                    >
                        {level}
                    </button>
                ))}
            </div>

            {tutorials.length === 0 ? (
                <p>Aucun tutoriel disponible pour ce niveau.</p>
            ) : (
                <div className="space-y-6">
                    {tutorials.map((tuto) => (
                        <article key={tuto.id} className="bg-white border rounded-lg p-4 shadow-sm">
                            <div className="prose mt-2">{tuto.content}</div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
