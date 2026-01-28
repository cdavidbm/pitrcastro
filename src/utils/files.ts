const fileTypes: Record<string, { icon: string; label: string; color: string }> = {
  pdf: { icon: 'fa-file-pdf', label: 'PDF', color: 'var(--file-pdf)' },
  xlsx: { icon: 'fa-file-excel', label: 'Excel', color: 'var(--file-excel)' },
  xls: { icon: 'fa-file-excel', label: 'Excel', color: 'var(--file-excel)' },
  doc: { icon: 'fa-file-word', label: 'Word', color: 'var(--file-word)' },
  docx: { icon: 'fa-file-word', label: 'Word', color: 'var(--file-word)' },
  ppt: { icon: 'fa-file-powerpoint', label: 'PowerPoint', color: 'var(--file-powerpoint)' },
  pptx: { icon: 'fa-file-powerpoint', label: 'PowerPoint', color: 'var(--file-powerpoint)' },
  zip: { icon: 'fa-file-zipper', label: 'ZIP', color: 'var(--file-zip)' },
  rar: { icon: 'fa-file-zipper', label: 'RAR', color: 'var(--file-zip)' },
};

export function getFileInfo(filePath: string): { icon: string; label: string; color: string } {
  const extension = filePath.split('.').pop()?.toLowerCase() || '';
  return fileTypes[extension] || { icon: 'fa-file', label: extension.toUpperCase() || 'Archivo', color: 'var(--gray-600)' };
}
