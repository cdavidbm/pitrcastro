import type { Document } from '../types/content';

export function groupByCategory(documents: Document[]): Map<string, Document[]> {
  const groups = new Map<string, Document[]>();
  for (const doc of documents) {
    const cat = doc.category || 'General';
    if (!groups.has(cat)) groups.set(cat, []);
    groups.get(cat)!.push(doc);
  }
  return groups;
}
