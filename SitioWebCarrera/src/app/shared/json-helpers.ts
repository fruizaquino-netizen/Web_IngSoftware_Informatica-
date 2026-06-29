export function parseJsonWithBom<T>(text: string, fallback: T, context = 'JSON'): T {
  try {
    return JSON.parse(text.replace(/^\uFEFF/, '')) as T;
  } catch (error) {
    console.error(`No se pudo parsear ${context}:`, error);
    return fallback;
  }
}
