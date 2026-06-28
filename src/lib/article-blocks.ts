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

export type ArticleTextSegment =
  | { type: "paragraph"; text: string }
  | { type: "gap"; size: "normal" | "wide" };

function normalizeTextBlockValue(value: string): string {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u2028/g, "\n")
    .replace(/\u2029/g, "\n")
    .replace(/^\s+|\s+$/g, "");
}

export function splitTextIntoSegments(text: string): ArticleTextSegment[] {
  const normalized = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\u2028/g, "\n")
    .replace(/\u2029/g, "\n");

  if (!normalized.trim()) return [];

  const lines = normalized.split("\n");
  const segments: ArticleTextSegment[] = [];
  let blankLineCount = 0;
  let currentLine: string | null = null;

  function flushParagraph() {
    if (!currentLine) return;
    segments.push({ type: "paragraph", text: currentLine.trim() });
    currentLine = null;
  }

  function flushBlankLines() {
    if (blankLineCount <= 0) return;

    segments.push({ type: "gap", size: "normal" });
    for (let index = 1; index < blankLineCount; index += 1) {
      segments.push({ type: "gap", size: "wide" });
    }
    blankLineCount = 0;
  }

  for (const line of lines) {
    if (line.trim() === "") {
      flushParagraph();
      blankLineCount += 1;
      continue;
    }

    flushBlankLines();

    if (currentLine !== null) {
      flushParagraph();
    }

    currentLine = line;
  }

  flushParagraph();

  return segments;
}

export function splitTextIntoParagraphs(text: string): string[] {
  return splitTextIntoSegments(text)
    .filter((segment): segment is { type: "paragraph"; text: string } => segment.type === "paragraph")
    .map((segment) => segment.text);
}

export function parseArticleContent(raw: string): ContentBlock[] {
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
    splitTextIntoParagraphs(trimmed).forEach((paragraph) => {
      blocks.push(createTextBlock(paragraph));
    });
  }

  if (blocks.length === 0) {
    blocks.push(createTextBlock());
  }

  return blocks;
}

export function serializeArticleContent(blocks: ContentBlock[]): string {
  const normalized = blocks
    .map((block) => {
      if (block.type === "text") {
        return { type: "text" as const, value: normalizeTextBlockValue(block.value) };
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
