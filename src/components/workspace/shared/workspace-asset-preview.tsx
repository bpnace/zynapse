/* eslint-disable @next/next/no-img-element */

type WorkspaceAssetPreviewProps = {
  assetType: string;
  title: string;
  previewUrl: string | null;
  posterUrl: string | null;
  className?: string;
  mediaClassName?: string;
  fallbackClassName?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  "data-testid"?: string;
};

export function WorkspaceAssetPreview({
  assetType,
  title,
  previewUrl,
  posterUrl,
  className,
  mediaClassName,
  fallbackClassName,
  controls = false,
  autoPlay = false,
  loop = false,
  muted = false,
  "data-testid": dataTestId,
}: WorkspaceAssetPreviewProps) {
  const fallback = (
    <div
      data-testid={dataTestId}
      className={fallbackClassName ?? className}
    >
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--workspace-copy-muted)]">
        Vorschau folgt
      </span>
    </div>
  );

  if (assetType.includes("video")) {
    if (previewUrl) {
      return (
        <video
          data-testid={dataTestId}
          src={previewUrl}
          poster={posterUrl ?? undefined}
          controls={controls}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline
          preload="metadata"
          aria-label={`${title} Vorschau`}
          className={mediaClassName ?? className}
        />
      );
    }

    if (posterUrl) {
      return (
        <img
          data-testid={dataTestId}
          src={posterUrl}
          alt={`${title} Poster`}
          className={mediaClassName ?? className}
        />
      );
    }

    return fallback;
  }

  if (previewUrl ?? posterUrl) {
    return (
      <img
        data-testid={dataTestId}
        src={previewUrl ?? posterUrl ?? undefined}
        alt={`${title} Vorschau`}
        className={mediaClassName ?? className}
      />
    );
  }

  return fallback;
}
