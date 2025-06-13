// components/ListManager.tsx
import React from 'react';
import { articleClassementInMyList } from '@/app/types';

interface ListManagerProps {
  myList: articleClassementInMyList[];
  onImportList: (importedList: articleClassementInMyList[]) => void;
}

export function ListManager({ myList }: ListManagerProps) {

  const exportList = () => {
    // Définir les en-têtes CSV
    const headers = ['id', 'titre_fr', 'titre_en', 'rank', 'rankTierList', 'averageRatingIMDB', 'scoreCategorise'];
    
    // Convertir les données en format CSV
    const csvData = myList.map(article => [
      article.id,
      article.titre_fr,
      article.titre_en,
      article.rank || '',
      article.rankTierList || '',
      article.averageRatingIMDB,
      article.scoreCategorise
    ]);

    // Ajouter les en-têtes au début
    csvData.unshift(headers);

    // Convertir en chaîne CSV
    const csvString = csvData
      .map(row => row.map(cell => 
        // Échapper les virgules et les guillemets si nécessaire
        typeof cell === 'string' && (cell.includes(',') || cell.includes('"'))
          ? `"${cell.replace(/"/g, '""')}"`
          : cell
      ).join(','))
      .join('\n');

    // Créer le blob et télécharger
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `classement-films-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /*
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result !== 'string') return;
        
        const importedData = JSON.parse(result);
        
        if (importedData.movies && Array.isArray(importedData.movies)) {
          onImportList(importedData.movies);
          alert(`${importedData.movies.length} films importés avec succès !`);
        } else {
          alert('Format de fichier invalide');
        }
      } catch (error) {
        alert('Erreur lors de l\'importation du fichier');
        console.error('Import error:', error);
      }
    };
    reader.readAsText(file);
  };
  */

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={exportList}
        className="px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
        title="Télécharger ma liste"
      >
        📥 Exporter
      </button>
      {/*
      <button
        onClick={() => fileInputRef.current?.click()}
        className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        title="Importer une liste"
      >
        📤 Importer
      </button>
 
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImport}
        className="hidden"
      />     */}
    </div>
  );
}