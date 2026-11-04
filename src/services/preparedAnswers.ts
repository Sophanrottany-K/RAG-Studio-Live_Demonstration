// Answers written ahead of time for questions the demo must answer word for word (from answer.md).
// The mock server uses them instead of quoting passages, once it has checked the chatbot covers the topic.

const WHAT_IS_KOSIGN = `## What is KOSIGN?

KOSIGN (Korea Software Innovation Global Network) is a South Korean-founded software and IT company established in Cambodia in April 2013 by Webcash Group.

The company focuses on software development, financial technology (FinTech), and digital business solutions.

### Main Business Areas

- **B2B FinTech:** Developing financial technology solutions for businesses.
- **E-Finance Solutions:** Building digital banking and financial systems.
- **Global IT Outsourcing:** Providing software development and IT services for international clients.

KOSIGN also develops business software products such as WABOOKS and WeBill365.`;

const WHY_CAMBODIA = `## Why Was KOSIGN Established in Cambodia?

KOSIGN was established in Cambodia for two main purposes:

### Developing Cambodian IT Talent

Webcash Group wanted to invest in Cambodia's growing IT industry by developing local software engineers.

This initiative also led to the establishment of the Korea Software HRD Center, which provides IT training and scholarship opportunities to Cambodian university students.

### Establishing a Global Software Development Center

KOSIGN was created to build a software development team in Cambodia that could support Webcash Group's Korean businesses while developing financial technology solutions for the Cambodian market.

This allows the company to combine Korean technology and experience with Cambodian IT talent.

## Summary

In simple terms, KOSIGN was established to:

- Develop Cambodian IT talent.
- Provide software development services to international businesses.
- Develop financial technology and digital business solutions.
- Connect Korean technology expertise with Cambodian software engineers.`;

// Keys are questions in lower case, without punctuation.
const PREPARED: Record<string, string> = {
  "what is kosign": WHAT_IS_KOSIGN,
  "what is kosign company": WHAT_IS_KOSIGN,
  "why was kosign established in cambodia": WHY_CAMBODIA,
};

/** The prepared answer (as Markdown) for this question, if there is one. */
export const preparedAnswer = (question: string): string | undefined =>
  PREPARED[
    question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim()
  ];

/** The same answer without Markdown marks, for "Plain text only" chatbots and the chat log. */
export const markdownToPlainText = (markdown: string) => markdown.replace(/^#+\s+/gm, "").replace(/\*\*/g, "");
