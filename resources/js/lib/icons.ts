import {
    Camera,
    Coffee,
    Flower,
    HeartStraight,
    type Icon,
    MagicWand,
    PaintBrush,
    Sparkle,
    Star,
    Sun,
} from '@phosphor-icons/react';

export const FEATURE_ICONS: Record<string, Icon> = {
    Sparkle,
    PaintBrush,
    HeartStraight,
    Star,
    MagicWand,
    Sun,
    Coffee,
    Camera,
    Flower,
};

export const FEATURE_ICON_KEYS = Object.keys(FEATURE_ICONS);

export function resolveIcon(name: string): Icon {
    return FEATURE_ICONS[name] ?? Sparkle;
}
