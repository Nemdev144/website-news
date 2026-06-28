interface ArticleCaptionProps {
  text: string;
}

export default function ArticleCaption({ text }: ArticleCaptionProps) {
  return (
    <figcaption className="article-caption">
      <p className="article-caption-text">{text.trim()}</p>
      <span className="article-caption-rule" aria-hidden="true" />
    </figcaption>
  );
}
