
import pandas as pd
import sys

def filter_title_basics():
    """
    Filtre le fichier title.basics.tsv en gardant seulement les lignes
    dont le tconst existe dans rating_filtered.csv
    """
    
    try:
        print("Chargement du fichier rating_filtered.csv...")
        # Charger le fichier des ratings pour obtenir les tconst à garder
        ratings_df = pd.read_csv('rating_filtered.csv', sep='\t')
        
        # Extraire les tconst uniques du fichier ratings
        valid_tconst = set(ratings_df['tconst'].unique())
        print(f"Nombre de tconst dans rating_filtered.csv: {len(valid_tconst)}")
        
        print("Traitement du fichier title.basics.tsv...")
        # Lire le fichier title.basics.tsv par chunks pour économiser la mémoire
        chunk_size = 100000  # Ajustez selon votre RAM disponible
        filtered_chunks = []
        total_rows = 0
        kept_rows = 0
        
        # Traiter le fichier par chunks
        for chunk in pd.read_csv('title.basics.tsv', sep='\t', chunksize=chunk_size, 
                                na_values=['\\N'], keep_default_na=True):
            total_rows += len(chunk)
            
            # Filtrer le chunk pour garder seulement les tconst valides
            filtered_chunk = chunk[chunk['tconst'].isin(valid_tconst)]
            kept_rows += len(filtered_chunk)
            
            if not filtered_chunk.empty:
                filtered_chunks.append(filtered_chunk)
            
            print(f"Traité: {total_rows:,} lignes, gardé: {kept_rows:,} lignes", end='\r')
        
        if filtered_chunks:
            print(f"\nConcaténation des résultats...")
            # Combiner tous les chunks filtrés
            final_df = pd.concat(filtered_chunks, ignore_index=True)
            
            # Sauvegarder le résultat
            output_file = 'title_basics_filtered_v2.tsv'
            final_df.to_csv(output_file, sep='\t', index=False, na_rep='\\N')
            
            print(f"\n✅ Traitement terminé!")
            print(f"   - Lignes totales dans title.basics.tsv: {total_rows:,}")
            print(f"   - Lignes gardées: {kept_rows:,}")
            print(f"   - Taux de filtrage: {(kept_rows/total_rows)*100:.2f}%")
            print(f"   - Fichier de sortie: {output_file}")
            
            # Afficher un aperçu des résultats
            print(f"\n📋 Aperçu des premières lignes du fichier filtré:")
            print(final_df.head())
            
        else:
            print("\n⚠️ Aucune ligne correspondante trouvée!")
            
    except FileNotFoundError as e:
        print(f"❌ Erreur: Fichier non trouvé - {e}")
        print("Assurez-vous que les fichiers suivants existent dans le répertoire courant:")
        print("  - rating_filtered.csv")
        print("  - title.basics.tsv")
        
    except Exception as e:
        print(f"❌ Erreur inattendue: {e}")
        return False
    
    return True

def main():
    """Fonction principale"""
    print("🎬 Filtrage de title.basics.tsv basé sur rating_filtered.csv")
    print("=" * 60)
    
    success = filter_title_basics()
    
    if success:
        print("\n🎉 Vous pouvez maintenant importer le fichier 'title_basics_filtered.tsv' dans pgAdmin!")
    else:
        print("\n💡 Vérifiez que les fichiers sont dans le bon répertoire et réessayez.")

if __name__ == "__main__":
    main()