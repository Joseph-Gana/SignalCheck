---
doc: prd
status: approved
---

# SignalCheck — Product Requirements

SignalCheck is an evidence-first reading tool for an everyday person who wants to understand an important written offer before deciding how to respond.

Source: `scope.md > Who It's For`, `scope.md > The Unique Kernel`.

## The Core Journey

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. A person opens the single-page SignalCheck experience and immediately sees its purpose and a large place to paste an important offer or message.
2. They paste one written communication and select **Analyze**.
3. SignalCheck validates the input. For usable text, it shows an in-progress state while analysis runs; it does not show partial or unverified results.
4. SignalCheck replaces the input view with a results view containing four clearly separated categories: Facts, Ambiguities, Information Not Stated, and Questions to Ask.
5. The person scans concise finding cards. For a supported fact or ambiguity, they select **View evidence** to reveal the exact relevant source passage inline beneath that finding.
6. The person uses the source text and the clearly labeled AI-generated analysis or questions to investigate the offer without receiving an accept/reject recommendation.
7. When ready to examine a different message, they select **Analyze another**, which resets the current one-time analysis and returns them to the empty input view.

Success is a person seeing what the supplied text explicitly establishes, what remains unclear or not stated, and why a finding was made—especially through the inline source-passage reveal.

## Screens and Layout

### Input View

The first and only entry view is a calm, single-page input surface focused on paste → analyze.

- Header: the **SignalCheck** name/logo and the tagline **“Understand before you decide.”**
- Main content: a short explanation that SignalCheck identifies what is clear, ambiguous, not stated, and what questions the person may want to ask.
- A large text area with the placeholder **“Paste your offer, message, or announcement here…”**.
- A prominent **Analyze** button below the text area.
- No navigation-heavy sections, accounts, uploads, history, chat, or unrelated controls.

### Results View

The results remain within the same single-page workflow.

- A clear **Analyze another** control at the top resets the analysis and returns to the empty input view.
- The original supplied text remains accessible because it is the source of truth.
- Four vertically arranged, clearly distinct sections/cards: **Facts**, **Ambiguities**, **Information Not Stated**, and **Questions to Ask**.
- Each section contains scannable finding cards or list items. A finding shows a concise title or statement and, where useful, a short explanation.
- Findings supported by a passage include **View evidence**. Questions show the practical question directly.
- No overall verdict, recommendation, or decision UI appears.

### Inline Evidence Reveal

Selecting **View evidence** expands content directly beneath the associated finding without a modal, new page, or loss of scroll/review context.

- The expanded content is labeled **Source passage** and displays the exact relevant passage from the original supplied text.
- The matched passage is visually highlighted with a restrained treatment.
- The control changes to **Hide evidence** and collapses the content when selected again.
- The person can continue reviewing other findings and open evidence for another item.
- For an Information Not Stated finding with no specific supporting passage, the UI explains that it is based on the absence of that information in the supplied text; it must not invent a quote or imply certainty that the information should exist.

## Look and Feel

Source: `scope.md > Inspiration & Identity`.

- Calm, trustworthy, editorial, and evidence-focused—like a well-designed research or reading tool, not an AI chatbot.
- Mostly white or off-white backgrounds; deep navy or charcoal primary text; restrained amber/gold for highlights and evidence; subtle neutral borders.
- Clean, modern, highly readable sans-serif body typography with strong hierarchy and a slightly editorial character for headings.
- Moderate whitespace and generous spacing; organized and scannable rather than a dense analytics dashboard.
- Simple cards, restrained shadows, clear labels, and strong distinction between the four categories.
- Source passages must look visibly different from AI analysis through subtle highlighting and labeling.
- Avoid neon gradients, heavy dark mode, purple/blue AI styling, unnecessary animations, avatars, chat bubbles, and decorative AI imagery.

## Features and Behavior

### Text Submission and Analysis

Source: `scope.md > The POC Boundary`.

- The product accepts one pasted text communication at a time.
- Selecting **Analyze** begins analysis only when the text is sufficiently detailed for meaningful findings.
- During analysis, the person remains on the same page, the Analyze button is temporarily disabled to prevent duplicate submissions, and a subtle progress indicator with **“Analyzing…”** is visible.
- Results are shown only once analysis is complete.

### Evidence-First Results

Source: `scope.md > The Unique Kernel`, `scope.md > What "Working" Looks Like`.

- **Facts** contain only statements explicitly established by the supplied text.
- **Ambiguities** identify statements or conditions whose meaning is unclear.
- **Information Not Stated** identifies information absent from the supplied text. It does not claim that the information necessarily should exist.
- **Questions to Ask** provides practical questions derived from ambiguities and information not stated.
- The interface clearly distinguishes the original text, which is the source of truth, from AI-generated findings and questions.
- SignalCheck does not present inferred information as fact and does not recommend a decision.

### Resetting the Analysis

- Selecting **Analyze another** clears the existing results and previous pasted text, then returns to the empty, ready-to-use input view.
- The proof of concept stores no analysis history or saved results.

## Acceptance Criteria

- [ ] On arrival, the user sees the SignalCheck identity, the stated purpose, a large paste area, and an Analyze button without unrelated product features.
- [ ] A usable pasted offer can be analyzed in one flow and produces distinct Facts, Ambiguities, Information Not Stated, and Questions to Ask sections.
- [ ] Facts are visually and textually framed as explicit statements from the supplied text, while analysis and questions are identifiable as AI-generated aids.
- [ ] A finding with source support has a View evidence control that expands the exact matching passage inline, labels it as source text, and highlights it; Hide evidence collapses it.
- [ ] An Information Not Stated item without a specific passage explains that it reflects an absence in the supplied text and does not fabricate a quote.
- [ ] The user can access the original supplied text while reviewing results.
- [ ] The result view contains no accept/reject/scam recommendation or overall decision.
- [ ] Analyze another clears both input and results and returns the user to an empty input view.
- [ ] Empty, too-short, loading, and analysis-failure states are recoverable without the user losing entered text (except when they intentionally choose Analyze another).

## States and Boundaries

- **First use** — the empty input view explains the product and invites a paste.
- **Empty input** — analysis does not start. An inline message says **“Paste some text to analyze.”** and the text area remains available and focused.
- **Very short input** — analysis does not start. An inline message says **“Add more detail so SignalCheck can identify facts, ambiguities, and information not stated.”** The person can continue editing and retry.
- **Analyzing** — the input remains on the same page, Analyze is disabled, and a subtle **“Analyzing…”** indicator appears. No partial results appear.
- **Analysis failure** — the original text remains intact. A clear non-technical message says **“We couldn’t analyze this text. Please try again.”** and offers **Try again**. When a specific input issue is known, the message explains that issue clearly instead of being generic.
- **Results review** — the person can expand and collapse evidence inline, review other findings, and access the original text without navigation away from the results.
- **New analysis** — selecting Analyze another intentionally clears the in-memory input and results. Nothing is retained afterward.

## Product Decisions

- The app is a single-page, one-text-at-a-time experience — this keeps the proof focused on paste → analyze → review → evidence.
- Results use four stable categories — they make the difference from a generic summarizer clear.
- Evidence opens inline instead of in a modal or separate view — the user can inspect the source without losing their place.
- The original supplied text is the source of truth — AI output must be visibly presented as analysis or questions, never as unsupported fact.
- Information Not Stated is phrased as absence from the supplied text — this avoids claiming knowledge of what must exist outside that text.
- The interface provides no decision recommendation — SignalCheck informs the person’s judgment rather than making it for them.
- The visual identity is an evidence reader, not an AI chatbot — calm editorial hierarchy and restrained source highlighting carry the product’s trust signal.

## What We're Building

- A responsive single-page web experience with an input view and a results view.
- Pasted-text validation, an analysis-in-progress state, recoverable errors, and intentional reset behavior.
- One completed analysis output organized into the four categories.
- Inline evidence reveal for source-supported findings and clear handling for absent-information findings without quotes.
- Access to the original supplied text during results review.
- The defined calm, editorial, evidence-first visual presentation.

## Deferred From the POC

- File/PDF/DOCX uploads and multi-document analysis — the proof validates pasted text first.
- Accounts, authentication, profiles, saved history, and databases — no persistence is necessary for one analysis at a time.
- Editing results, follow-up analysis chat, sharing, collaboration, notifications, integrations, payments, subscriptions, admin features, and advanced customization — these do not strengthen the core demo.
- Browser extensions and mobile apps — a single web experience is sufficient.

## Possible Later Enhancements

File uploads and broader document-type support could extend the same evidence-first review workflow after the pasted-text version is reliable. Persistence, sharing, and follow-up discussion could be explored later only if they retain the source-of-truth and non-decision safeguards.

## Non-Goals

- SignalCheck will not tell a person to accept, reject, or otherwise decide on an offer.
- SignalCheck will not label text as a scam or make unsupported claims.
- SignalCheck will not present AI inference as a fact established by the source text.
- SignalCheck will not process multiple texts or preserve completed analyses in the proof of concept.

## Open Questions

None that block technical planning. The technical spec will decide how analysis is produced while preserving these product requirements.
