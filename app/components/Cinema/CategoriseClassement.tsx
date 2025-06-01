'use client';

import React, { useState } from 'react';

// À adapter à ta vraie source de données
const mockData = [
  { id: 1, title: "Inception", likes: 120, rating: 4.5, rank: 1 },
  { id: 2, title: "Interstellar", likes: 95, rating: 4.2, rank: 2 },
  { id: 3, title: "Tenet", likes: 80, rating: 3.8, rank: 3 },
];

type Article = {
  id: number;
  title: string;
  likes: number;
  rating: number;
  rank: number;
};

export default function CategoriseClassement({ categoryName }: { categoryName: string }) {
  const [articles, setArticles] = useState<Article[]>(mockData);

  const handleLike = (id: number) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === id ? { ...article, likes: article.likes + 1 } : article
      )
    );
  };

  const handleRating = (id: number, newRating: number) => {
    setArticles(prev =>
      prev.map(article =>
        article.id === id ? { ...article, rating: newRating } : article
      )
    );
  };

  return (
    <div className="space-y-6">
      {articles.map((article) => (
        <div key={article.id} className="border p-4 rounded-xl shadow-sm">
          <h2 className="text-xl font-semibold">{article.title}</h2>
          <p>Rank : #{article.rank}</p>
          <p>Likes : {article.likes}</p>
          <p>Rating : {article.rating.toFixed(1)} / 5</p>

          <div className="mt-2 flex gap-3 items-center">
            <button
              onClick={() => handleLike(article.id)}
              className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
            >
              Like 👍
            </button>

            <select
              value={article.rating}
              onChange={(e) => handleRating(article.id, parseFloat(e.target.value))}
              className="border rounded px-2 py-1"
            >
              {[1, 2, 3, 4, 5].map(r => (
                <option key={r} value={r}>
                  {r} ⭐
                </option>
              ))}
            </select>

            <button className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800">
              Ajouter à ma liste ➕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
