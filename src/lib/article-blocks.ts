export interface TextBlock {
  id: string;
  type: "text";
  value: string;
}

export interface ImageBlock {
  id: string;
  type: "image";
  url: string;
  title: string;
  caption: string;
}

export type ContentBlock = TextBlock | ImageBlock;

export function createBlockId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createTextBlock(value = ""): TextBlock {
  return { id: createBlockId(), type: "text", value };
}

export function createImageBlock(): ImageBlock {
  return { id: createBlockId(), type: "image", url: "", title: "", caption: "" };
}

interface LegacyMediaItem {
  url: string;
  title?: string | null;
  caption?: string | null;
}

type StoredBlock =
  | { type: "text"; value: string }
  | { type: "image"; url: string; title?: string; caption?: string };

function isStoredBlock(value: unknown): value is StoredBlock {
  if (!value || typeof value !== "object") return false;
  const block = value as StoredBlock;
  if (block.type === "text") {
    return typeof block.value === "string";
  }
  if (block.type === "image") {
    return typeof block.url === "string";
  }
  return false;
}

function withId(block: StoredBlock): ContentBlock {
  const id = createBlockId();
  if (block.type === "text") {
    return { id, type: "text", value: block.value };
  }
  return {
    id,
    type: "image",
    url: block.url,
    title: block.title ?? "",
    caption: block.caption ?? "",
  };
}

export function parseArticleContent(
  raw: string,
  legacyMedia: LegacyMediaItem[] = [],
): ContentBlock[] {
  const trimmed = raw.trim();

  if (trimmed.startsWith("[")) {
    try {
      const parsed = JSON.parse(trimmed) as unknown;
      if (Array.isArray(parsed) && parsed.length > 0 && parsed.every(isStoredBlock)) {
        return parsed.map((block) => withId(block));
      }
    } catch {
      // Fall through to legacy plain-text parsing.
    }
  }

  const blocks: ContentBlock[] = [];

  if (trimmed) {
    trimmed
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean)
      .forEach((paragraph) => {
        blocks.push(createTextBlock(paragraph));
      });
  }

  legacyMedia.forEach((item) => {
    blocks.push({
      id: createBlockId(),
      type: "image",
      url: item.url,
      title: item.title ?? "",
      caption: item.caption ?? "",
    });
  });

  if (blocks.length === 0) {
    blocks.push(createTextBlock());
  }

  return blocks;
}

export function serializeArticleContent(blocks: ContentBlock[]): string {
  const normalized = blocks
    .map((block) => {
      if (block.type === "text") {
        return { type: "text" as const, value: block.value.trim() };
      }
      return {
        type: "image" as const,
        url: block.url.trim(),
        title: block.title.trim(),
        caption: block.caption.trim(),
      };
    })
    .filter((block) => {
      if (block.type === "text") return block.value.length > 0;
      return block.url.length > 0;
    });

  return JSON.stringify(normalized);
}

export function contentBlocksAreValid(blocks: ContentBlock[]): boolean {
  return blocks.some((block) => {
    if (block.type === "text") return block.value.trim().length > 0;
    return block.url.trim().length > 0;
  });
}

export function blocksToPlainText(blocks: ContentBlock[]): string {
  return blocks
    .filter((block): block is TextBlock => block.type === "text")
    .map((block) => block.value.trim())
    .filter(Boolean)
    .join("\n\n");
}
