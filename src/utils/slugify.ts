export function slugify(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .normalize("NFD") // Supprime les accents
        .replace(/[\u0300-\u036f]/g, "") // Supprime les caractères diacritiques
        .replace(/[^a-z0-9]+/g, "-") // Remplace tout ce qui n’est pas alphanumérique par des tirets
        .replace(/^-+|-+$/g, "") // Supprime les tirets en début et fin
        .substring(0, 50); // Limite à 50 caractères si nécessaire
}