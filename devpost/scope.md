---
doc: scope
status: approved
---

# SignalCheck

An evidence-first tool that helps a person understand what an important written offer clearly establishes before they act on it.

## The Unique Kernel

SignalCheck goes beyond summarizing a message. It separates clear facts, ambiguities, and information not stated in the supplied text, then turns the gaps into questions the user can investigate. The original user-supplied text is the source of truth: every finding connects back to the relevant passage so the user can verify the basis for it rather than trust an unsupported conclusion. SignalCheck must distinguish explicit statements from AI-generated analysis or questions and must not present inferences as facts.

## Who It's For

An everyday person who has received an important written offer—such as a job, training, service, or business offer—with conditions, deadlines, costs, benefits, or obligations. They want to understand the message before responding or making a decision; today they must reread it, rely on their own interpretation, or ask questions without a clear view of what is established versus unclear.

## The Core Loop

The person opens SignalCheck, pastes one important written communication, and analyzes it. They review facts, ambiguities, information not stated in the supplied text, and questions to ask, then open an individual finding to see the source passage that supports it. They return whenever they need to investigate a consequential message before acting.

## Inspiration & Identity

The product should feel clear, grounded, and nonjudgmental: an investigative aid, not an authority making decisions for the user. No external product or visual references were provided yet.

## Why This Matters to the Learner

The learner wants to build a small, reliable end-to-end proof of concept and practice how requirements and a technical spec translate into implementation decisions in a plan-first AI coding workflow.

## What "Working" Looks Like

In a one-minute demo, someone opens a simple explanation screen, pastes a realistic offer with a fee, deadline, benefits, conditions, and vague or absent details, and clicks **Analyze**. SignalCheck presents Facts, Ambiguities, Information Not Stated, and Questions to Ask. The compelling proof moment is selecting an ambiguity or information-not-stated finding and seeing the exact related passage from the original message. The results make clear that the original text is the source of truth, while analysis and questions are AI-generated aids; SignalCheck informs investigation and does not tell the person what decision to make.

## The POC Boundary

One excellent paste → analyze → review → evidence workflow for one piece of text at a time. The proof of concept accepts pasted text and analyzes important written offers or similar communications, producing evidence-linked findings across the four defined categories. It treats only explicit statements in the supplied text as facts, labels analysis and questions as AI-generated, and identifies only information not stated in that text—not information it claims should necessarily exist.

## Later

File uploads and support for other document types can be considered after the core text-analysis workflow works well.

## Explicitly Cut

- Accounts, authentication, user profiles, saved history, and databases: the demo needs no persistent personal data.
- Sharing, collaboration, payments, subscriptions, notifications, integrations, admin dashboards, and advanced customization: none proves the core analysis workflow.
- PDF/DOCX uploads and multiple-document processing: the proof starts with one pasted message.
- Editing AI results and follow-up chat: the first version is a focused review experience, not a workspace or conversational assistant.
- Browser extensions and mobile apps: a single web proof of concept is sufficient.
- Automated decisions or recommendations such as “accept,” “reject,” or “this is a scam”: SignalCheck should inform the user's judgment, not replace it or make unsupported claims.
