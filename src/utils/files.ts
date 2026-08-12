import type { Acento } from './acento';

/** `acento` acompaña a `color`: es el token que la hoja de estilos sabe pintar
 *  sin necesidad de escribir el color dentro del HTML. */
const fileTypes: Record<string, { icon: string; label: string; color: string; acento: Acento }> = {
  pdf: { icon: 'fa-file-pdf', label: 'PDF', color: 'var(--file-pdf)', acento: 'red' },
  xlsx: { icon: 'fa-file-excel', label: 'Excel', color: 'var(--file-excel)', acento: 'green' },
  xls: { icon: 'fa-file-excel', label: 'Excel', color: 'var(--file-excel)', acento: 'green' },
  doc: { icon: 'fa-file-word', label: 'Word', color: 'var(--file-word)', acento: 'blue' },
  docx: { icon: 'fa-file-word', label: 'Word', color: 'var(--file-word)', acento: 'blue' },
  ppt: { icon: 'fa-file-powerpoint', label: 'PowerPoint', color: 'var(--file-powerpoint)', acento: 'orange' },
  pptx: { icon: 'fa-file-powerpoint', label: 'PowerPoint', color: 'var(--file-powerpoint)', acento: 'orange' },
  zip: { icon: 'fa-file-zipper', label: 'ZIP', color: 'var(--file-zip)', acento: 'purple' },
  rar: { icon: 'fa-file-zipper', label: 'RAR', color: 'var(--file-zip)', acento: 'purple' },
};

export function getFileInfo(filePath: string): { icon: string; label: string; color: string; acento: Acento } {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  return fileTypes[extension] || { icon: 'fa-file', label: extension.toUpperCase() || 'Archivo', color: 'var(--gray-600)', acento: 'gray' };
}
