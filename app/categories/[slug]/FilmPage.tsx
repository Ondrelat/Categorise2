import { getFilmsSortedByRating } from '@/app/lib/articles';
import FilmCard from './FilmCard';
import { Film } from '@/app/types';  


export default async function FilmsPage() {
  const films = await getFilmsSortedByRating();

  return (
<main className="min-h-screen bg-gray-50 flex justify-center"> {/* Ajout du flex et justify-center ici */}
  <div className="max-w-6xl px-4 py-8">
    <h1 className="text-4xl font-bold mb-8 text-center">Films Populaires</h1>
    
    {/* Utilisation de flex-col pour empiler verticalement */}
    <div className="flex flex-col items-center gap-6">
      {films.map((film: Film) => (
        <FilmCard 
          key={film.id} 
          film={film}
        />
      ))}
    </div>
  </div>
</main>
  );
}