import { type ImgHTMLAttributes } from 'react';

interface Props extends ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    alt: string;
}

export default function LazyImage({ src, alt, className, ...rest }: Props) {
    return (
        <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className={className}
            {...rest}
        />
    );
}
