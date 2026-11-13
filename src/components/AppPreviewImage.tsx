import { useEffect, useState } from 'react';
import type { SyntheticEvent } from 'react';
import { getDeterministicGradient, getInitials } from '../utils/image';

interface AppPreviewImageProps {
  name: string;
  imageUrl?: string;
  className?: string;
}

export function AppPreviewImage({
  name,
  imageUrl,
  className = '',
}: AppPreviewImageProps) {
  const [imgError, setImgError] = useState(false);
  const [isLogoLike, setIsLogoLike] = useState(false);

  useEffect(() => {
    setImgError(false);
    setIsLogoLike(false);
  }, [imageUrl]);

  const handleLoad = (e: SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      const ratio = img.naturalWidth / img.naturalHeight;
      setIsLogoLike(ratio < 1.35);
    }
  };

  const hasImage = Boolean(imageUrl?.trim()) && !imgError;

  return (
    <div
      className={`relative aspect-video w-full overflow-hidden bg-gradient-to-b from-slate-50/70 via-white to-sky-50/40 ${className}`}
    >
      {hasImage ? (
        <div
          className={`flex h-full w-full items-center justify-center transition-[padding] duration-150 ${
            isLogoLike ? 'p-5' : 'p-2.5'
          }`}
        >
          <img
            src={imageUrl}
            alt={`Giao diện ứng dụng ${name}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={handleLoad}
            onError={() => setImgError(true)}
            className={`max-h-full max-w-full object-contain transition-transform duration-200 ease-out ${
              isLogoLike
                ? 'rounded-xl drop-shadow-sm group-hover:scale-[1.04]'
                : 'rounded-lg shadow-sm group-hover:scale-[1.02]'
            }`}
          />
        </div>
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${getDeterministicGradient(
            name || 'App',
          )}`}
        >
          <span className="font-display text-3xl font-bold tracking-tight text-white/95 select-none">
            {getInitials(name || 'App')}
          </span>
        </div>
      )}
    </div>
  );
}
