---
doc: checklist
status: approved
---

# SignalCheck Build Checklist

Build mode: learn

## Slices

- [x] **1. Analyze one pasted offer and inspect validated source evidence**
  Becomes usable: A locally running SignalCheck accepts one usable pasted message, calls Gemini through the protected server endpoint, and displays four structured result categories. A fact or ambiguity can reveal its validated, exact source passage inline.
  Why now: This delivers the unique evidence-first kernel end to end before any visual polish. It also proves the highest-risk assumption early: a newly configured Gemini key can produce a structured response that passes exact-substring evidence validation.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Evidence-First Results`, `prd.md > Inline Evidence Reveal`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > Components`, `spec.md > Data Model`, `spec.md > External Services and Dependencies`
  Build: Scaffold the React/Vite and Express project, configure the local `/api` proxy, create the Gemini primary/fallback service and structured analysis schema, implement server-side exact-substring evidence validation, and connect a functional input/results UI with inline evidence toggles.
  Verify (mechanical): Install dependencies; run the server and client; submit the prepared sample offer; confirm a successful `/api/analyze` response contains all four categories; confirm expanded evidence is an exact substring of the submitted text; confirm a deliberately invalid evidence value is rejected by the validation function.
  Learner check: Configure the local key, paste the sample offer, select Analyze, open a source passage under a finding, and tell me whether the evidence connection feels trustworthy and understandable.
  Commit: `Build evidence-backed Gemini analysis flow`

- [x] **2. Make the evidence reader resilient, calm, and demo-ready**
  Becomes usable: The complete flow has the approved editorial presentation, explicit source-versus-AI labeling, original-text access, reset behavior, and recoverable validation/API errors without lost input.
  Why now: The core kernel is already proven; this slice turns it into the polished, safe one-minute experience described by the PRD without adding out-of-scope infrastructure.
  PRD ref: `prd.md > Input View`, `prd.md > Results View`, `prd.md > Look and Feel`, `prd.md > States and Boundaries`, `prd.md > Resetting the Analysis`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Important Failure Modes`, `spec.md > Where It Runs and How Someone Tries It`
  Build: Apply the calm editorial CSS; add the SignalCheck identity and explanatory input copy; add empty, too-short, and 12,000-character validation; loading and Try again behavior; safe server error mapping; original-text access; Analyze another reset; `.env.example`; and a public-ready README with local setup, Gemini limitations, and demo instructions.
  Verify (mechanical): Run the app and test empty, too-short, over-limit, successful, evidence-toggle, Analyze another, and simulated API-error paths; confirm the dev build completes; confirm `.env` and the learner profile are ignored; review the staged diff for secrets and unintended files before committing.
  Learner check: Explore the running app freely with the sample offer and awkward inputs. Check that the result hierarchy feels like an evidence reader, source passages are clearly distinct from AI analysis, and resetting starts cleanly; report anything confusing or worth changing.
  Commit: `Polish SignalCheck and add recovery states`

## Hands-on Checkpoints

- [x] Early usable behavior explored — completed during the original MVP build and local testing.
- [x] Final kick-the-tires exploration and feedback completed — completed before Stage 6; the MVP behavior is now locked.

## Final Review

- [x] Final review complete — MVP behavior was confirmed ready for shipping work before Stage 6.

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: MVP implementation and local testing were completed before Stage 6, per learner report. The code-tour/app-map completion record is not present in this repository.
Route and stops: not recorded
Edit outcome: not recorded
Reflection: not recorded
Activity mode: not recorded

## Stage 6 — Ship (In Progress)

- [x] Production deployment configuration implemented and verified locally — build, static serving, health, validation, live analysis, evidence rejection, and rate-limit checks passed on October 8, 2026.
- [ ] Hosting provider configured with server-side `GEMINI_API_KEY`.
- [ ] Public deployment URL verified with the full paste → analyze → evidence flow.
- [ ] Public GitHub repository reviewed for secrets and published with explicit learner authorization.
- [ ] Accessible demo video recorded and verified.
- [ ] Learner-written Devpost submission fields and exit survey completed.
- [ ] Devpost submission sent.

## Revisions

- Stage 6 deployment preparation began after the completed MVP build, local testing, and polish; production deployment remains in progress until a live URL is verified.
