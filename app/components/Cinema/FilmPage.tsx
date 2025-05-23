import { getFilmsSortedByRating } from '@/app/lib/articles';
import FilmCard from './FilmCard';
import { Film } from '@/app/types';  


export default async function FilmsPage({ categoryName }: { categoryName: string }) {
  const films = await getFilmsSortedByRating(categoryName);

  return (
<main className="min-h-screen bg-gray-50 flex justify-center"> {/* Ajout du flex et justify-center ici */}
  <div className="max-w-6xl px-4 py-8">
    <h1 className="text-4xl font-bold mb-8 text-center">{ categoryName } les mieux aimés </h1>
    
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