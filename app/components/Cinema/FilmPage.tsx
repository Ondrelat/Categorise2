'use client';

import { useEffect, useState } from 'react';
import FilmCard from './FilmCard';
import { Film } from '@/app/types';
import Modal from '@/app/components/Modal'; // Adjust path as needed
import RankingModalContent from '@/app/components/RankingModalContent'; // Adjust path as needed

export default function FilmsPage({ categoryName }: { categoryName: string }) {
  const [ratingSource, setRatingSource] = useState<'imdb' | 'categorise'>('categorise');
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [tempRanking, setTempRanking] = useState<Film[]>([]);
  const [showRanking, setShowRanking] = useState(false);

  useEffect(() => {
    const fetchFilms = async () => {
      setLoading(true);
      const res = await fetch(`/api/films?category=${categoryName}&sort=${ratingSource}`);
      const data = await res.json();
      setFilms(data);
      setLoading(false);
    };

    fetchFilms();
  }, [categoryName, ratingSource]);

  const toggleRatingSource = () => {
    setRatingSource((prev) => (prev === 'imdb' ? 'categorise' : 'imdb'));
  };

  // Handlers pour les interactions de notation
  const handleLike = async (filmId: string, liked: boolean) => {
    try {
      await fetch('/api/films/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmId, liked })
      });
      console.log(`Film ${filmId} ${liked ? 'aimé' : 'retiré des favoris'}`);
    } catch (error) {
      console.error('Erreur lors du like:', error);
    }
  };

  const handleRateSlider = async (filmId: string, rating: number) => {
    try {
      await fetch('/api/films/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filmId, rating })
      });
      console.log(`Film ${filmId} noté ${rating}/100`);
    } catch (error) {
      console.error('Erreur lors de la notation:', error);
    }
  };

  const handleAddToRanking = (film: Film) => {
    // Vérifier si le film n'est pas déjà dans le classement
    if (!tempRanking.find(f => f.id === film.id)) {
      setTempRanking(prev => [...prev, film]);
      console.log(`Film ${film.id} ajouté au classement temporaire`);
    }
  };

  const handleRemoveFromRanking = (filmId: string) => {
    setTempRanking(prev => prev.filter(f => f.id !== filmId));
    console.log(`Film ${filmId} retiré du classement temporaire`);
  };

  const handleShowRanking = () => {
    setShowRanking(true);
  };

  const handleCloseRankingModal = () => {
    setShowRanking(false);
  };

  const handleReorderRanking = (newRanking: Film[]) => {
    setTempRanking(newRanking);
  };

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center">
      <div className="max-w-6xl px-4 py-8 w-full">
        <h1 className="text-4xl font-bold mb-4 text-center">
          {categoryName} les mieux notés ({ratingSource === 'imdb' ? 'IMDB' : 'Catégorisé'})
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setRatingSource('categorise')}
            className={`px-4 py-2 rounded transition ${
              ratingSource === 'categorise' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Voir par Catégorisation
          </button>
          <button
            onClick={() => setRatingSource('imdb')}
            className={`px-4 py-2 rounded transition ${
              ratingSource === 'imdb' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Voir par IMDB
          </button>
          
          {tempRanking.length > 0 && (
            <button
              onClick={handleShowRanking}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              Voir mon classement ({tempRanking.length})
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-center">Chargement...</p>
        ) : (
          <div className="flex flex-col items-center gap-6">
            {films.map((film: Film) => (
              <FilmCard
                key={film.id}
                film={film}
                ratingSource={ratingSource}
                onLike={handleLike}
                onRateSlider={handleRateSlider}
                onAddToRanking={() => handleAddToRanking(film)}
                onShowRanking={handleShowRanking}
                isInRanking={tempRanking.some(f => f.id === film.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Utilisation du composant Modal */}
      <Modal
        isOpen={showRanking}
        onClose={handleCloseRankingModal}
        title="Mon Classement Personnel"
      >
        <RankingModalContent
          ranking={tempRanking}
          onRemoveFromRanking={handleRemoveFromRanking}
          onReorderRanking={handleReorderRanking}
        />
      </Modal>
    </main>
  );
}