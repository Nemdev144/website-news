import type { Article } from "@/types/news";

export function generateArticleBody(article: Article): string[] {
  return [
    article.excerpt,
    `Reporting from our ${article.category} desk — ${article.author} examines the latest developments surrounding this story, speaking with officials, analysts, and citizens affected by the unfolding events.`,
    `According to sources familiar with the matter, the situation has evolved rapidly over the past several days. Stakeholders across government, industry, and civil society are monitoring developments closely as new information continues to emerge.`,
    `Experts note that the implications extend well beyond immediate headlines. Policy makers are weighing a range of responses, while public debate has intensified on social platforms and in editorial pages nationwide.`,
    `"This is a defining moment for how we understand the issue," said one senior analyst who requested anonymity to speak freely. "The decisions made in the coming weeks will shape outcomes for years to come."`,
    `Meanwhile, communities directly impacted by these events are calling for transparency and accountability. Local leaders have organized forums to ensure residents' voices are heard in the policy conversation.`,
    `International observers are also tracking the story closely. Diplomatic channels remain active as allies and partners share assessments and coordinate potential joint responses where appropriate.`,
    `As Website News continues to follow this story, our editorial team is committed to providing clear, fact-based reporting. We will update this article as significant new details become available.`,
  ];
}
