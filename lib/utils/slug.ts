/**
 * Generates a URL-friendly slug from a string.
 * Example: "Mon voyage en Écosse !" → "mon-voyage-en-ecosse"
 */
export function generateSlug(input: string): string {
  return input
    .normalize('NFD')                    // décompose les caractères accentués (é → e + ́)
    .replace(/[\u0300-\u036f]/g, '')     // supprime les diacritiques
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')       // supprime tout sauf lettres, chiffres, espaces, tirets
    .replace(/\s+/g, '-')               // remplace les espaces par des tirets
    .replace(/-+/g, '-')                // évite les tirets doublés
}