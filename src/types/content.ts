/**
 * Tipos compartidos para el contenido del sitio
 */

export interface Document {
  name: string;
  file: string;
  anio?: string;
  description?: string;
  category?: string;
  externo?: boolean;
}

export interface DocumentSection {
  sectionTitle: string;
  sectionDescription?: string;
  sectionIcon?: string;
  displayMode?: 'accordion' | 'tabs' | 'list';
  documents: Document[];
}

export interface DocumentPage {
  title: string;
  slug: string;
  description?: string;
  icon?: string;
  order?: number;
  published: boolean;
  sections: DocumentSection[];
}

export interface Slide {
  image: string;
  imageAlt: string;
  title?: string;
  subtitle?: string;
  description?: string;
  link?: string;
  linkText?: string;
  external?: boolean;
  overlay?: boolean;
  active: boolean;
  order: number;
}

export interface CalendarEvent {
  title: string;
  startDate: string;
  endDate?: string;
  location?: string;
  description: string;
  image?: string;
  virtualLink?: string;
  published: boolean;
}

export interface MarkdownModule {
  frontmatter: {
    title: string;
    date: string;
    image?: string;
    excerpt?: string;
    draft?: boolean;
    tags?: string[];
  };
  Content: (_props: Record<string, never>) => unknown;
}

export interface EventModule {
  default: CalendarEvent;
}
