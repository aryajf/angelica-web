export type Locale = 'en' | 'id';

export type Translatable = Partial<Record<Locale, string>>;

export interface Hero {
    name: Translatable;
    profession: Translatable;
    description: Translatable;
    avatar_url: string | null;
    cv_url: string | null;
    email: string | null;
    instagram_url: string | null;
}

export interface Documentation {
    id: number;
    image_url: string;
    title: Translatable;
    description: Translatable;
}

export interface Feature {
    id: number;
    icon: string;
    title: Translatable;
    description: Translatable;
}

export interface Testimonial {
    id: number;
    client_name: string;
    client_role: string | null;
    avatar_url: string | null;
    message: Translatable;
}

export interface AuthUser {
    id: number;
    name: string;
    email: string;
}

export interface SharedProps {
    auth: { user: AuthUser | null };
    locale: Locale;
    fallbackLocale: Locale;
    availableLocales: Locale[];
    flash: { success: string | null; error: string | null };
    seo: { title: string; description: string };
    [key: string]: unknown;
}
