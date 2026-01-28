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

export interface NavItem {
  label: string;
  url: string;
  external?: boolean;
  highlighted?: boolean;
  children?: NavItem[];
}

export interface QuickAccessItem {
  label: string;
  url: string;
  icon: string;
  external?: boolean;
  highlighted?: boolean;
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

export interface NewsArticle {
  title: string;
  date: Date;
  image?: string;
  excerpt?: string;
  tags?: string[];
  draft: boolean;
}

export interface ContactConfig {
  address: string;
  city: string;
  postalCode?: string;
  phone: string;
  tollFree?: string;
  email: string;
  emailNotifications?: string;
  schedule: string;
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    youtube?: string;
    instagram?: string;
  };
}

export interface SiteConfig {
  name: string;
  fullName: string;
  description: string;
  keywords?: string[];
  featuredVideo?: {
    url: string;
    title: string;
  };
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
