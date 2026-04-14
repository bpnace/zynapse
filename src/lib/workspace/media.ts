type WorkspaceAssetMediaSource =
  | "demo_public"
  | "demo_placeholder"
  | "storage"
  | "unknown";

type WorkspaceAssetMediaInput = {
  assetType: string;
  title: string;
  storagePath: string | null;
  thumbnailPath: string | null;
  source: string | null;
};

export type WorkspaceAssetMedia = {
  previewUrl: string | null;
  posterUrl: string | null;
  mediaSource: WorkspaceAssetMediaSource;
  isVideo: boolean;
  isPlaceholder: boolean;
  hasRenderableMedia: boolean;
};

function normalizeAssetUrl(path: string | null) {
  if (!path) {
    return null;
  }

  if (
    path.startsWith("/") ||
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  return null;
}

function resolveMediaSource(source: string | null): WorkspaceAssetMediaSource {
  if (source === "demo_public" || source === "demo_placeholder" || source === "storage") {
    return source;
  }

  return "unknown";
}

export function resolveWorkspaceAssetMedia(
  asset: WorkspaceAssetMediaInput,
): WorkspaceAssetMedia {
  const mediaSource = resolveMediaSource(asset.source);
  const isVideo = asset.assetType.includes("video");
  const normalizedStoragePath = normalizeAssetUrl(asset.storagePath);
  const normalizedThumbnailPath = normalizeAssetUrl(asset.thumbnailPath);

  if (isVideo) {
    const previewUrl = normalizedStoragePath;
    const posterUrl = normalizedThumbnailPath;

    return {
      previewUrl,
      posterUrl,
      mediaSource,
      isVideo,
      isPlaceholder: mediaSource === "demo_placeholder",
      hasRenderableMedia: Boolean(previewUrl || posterUrl),
    };
  }

  const previewUrl = normalizedStoragePath ?? normalizedThumbnailPath;
  const posterUrl = normalizedThumbnailPath ?? normalizedStoragePath;

  return {
    previewUrl,
    posterUrl,
    mediaSource,
    isVideo,
    isPlaceholder: mediaSource === "demo_placeholder",
    hasRenderableMedia: Boolean(previewUrl || posterUrl),
  };
}

export function decorateWorkspaceAssetMedia<T extends WorkspaceAssetMediaInput>(
  asset: T,
): T & WorkspaceAssetMedia {
  return {
    ...asset,
    ...resolveWorkspaceAssetMedia(asset),
  };
}
