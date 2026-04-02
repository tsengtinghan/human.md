---
name: human
description: >
  Maintain a human-readable project guide in the human/ folder as a self-contained
  HTML file with architecture diagrams, data flow diagrams (Mermaid JS), and
  plain-English explanations. Use this skill after implementing major features,
  adding new API routes, changing database schemas, introducing new integrations,
  or making structural changes to the project. Also use when the user invokes
  /human or asks for a project overview, architecture summary, or documentation
  for non-technical teammates. Even if the change seems small, if it alters how
  components connect or introduces a new user-facing flow, update the human/ docs.
  IMPORTANT: Always delegate the actual generation to a subagent using the Agent
  tool to avoid polluting the main conversation context.
---

# Human — Your Project, Explained

Generate and maintain a self-contained HTML file that helps people understand
what was built and how it all connects — without reading the code.

## Critical: Use a Subagent

Always delegate the documentation generation to a background Agent. This keeps
the main conversation context clean for feature work. Launch the agent like this:

```
Agent tool call:
  description: "Update human docs"
  prompt: [see subagent prompt template below, filled in with context]
  run_in_background: true
```

Before launching the subagent, briefly describe what changed (if auto-triggering)
or what the user asked for (if manual). Include this context in the subagent prompt
so it knows what to focus on.

## After Generation: Open in Browser

Once the subagent finishes and `human/index.html` exists, automatically open it
in the user's browser using Bash:

- **macOS**: `open human/index.html`
- **Linux**: `xdg-open human/index.html`
- **Windows/WSL**: `wslview human/index.html` or `cmd.exe /c start human/index.html`

Tell the user: "Your project docs are open in the browser. You can bookmark the
URL to get back to them anytime."

## When to Run

- **Manually**: The user invokes `/human` or asks for a project overview.
- **Automatically**: After completing work that changes how the project is
  structured or how data moves through it — new features, new routes, new
  database tables, new third-party integrations, significant refactors.

## First Use vs. Updates

**First use in a project (no `human/index.html` exists):**
- The subagent scans the entire project — all source files, configs, routes,
  schemas, integrations, dependencies
- Generates a complete `human/index.html` from scratch covering every section
- This is the full initial documentation for the whole project

**Subsequent uses (`human/index.html` already exists):**
- Do NOT rescan the entire project — this is wasteful
- The caller (you) must tell the subagent exactly what code changed (files
  modified, features added, routes changed, etc.)
- The subagent reads the existing `human/index.html`, then reads only the
  changed files/areas to understand the delta
- Updates only the affected sections of the HTML and adds a "What Changed" entry
- If a `focus` arg is provided, the subagent reads the relevant code for that
  area and updates or creates that section

**When auto-triggering after a feature change:**
- Summarize what you just built/changed and pass that to the subagent
- Include file paths and a description of what changed so the subagent can
  read just those files and update the docs accordingly

## Subagent Prompt Template

Copy and adapt this prompt when launching the subagent. Replace the bracketed
sections with actual context about what changed or what the user asked for.

---

**Start of subagent prompt — copy everything below this line:**

You are generating documentation for humans who are not deeply technical. Your job
is to create or update `human/index.html` at the project root.

**Context:** [Describe what changed, what the user asked for, or "first-time
generation for the full project"]

**Task:** [One of: "Generate full documentation from scratch" / "Update the
documentation — focus on [area]" / "Update the documentation to reflect these
changes: [description]"]

## Step 1: Understand What Needs Documenting

**If this is the first run (no `human/index.html` exists):**

Scan the entire project. Read the codebase thoroughly before writing anything.

1. Read the project's package.json, requirements.txt, Cargo.toml, or equivalent
   to understand dependencies and project type
2. Use Glob to find all source files and read through the key ones — entry points,
   route definitions, models/schemas, config files, middleware, services
3. Map out: What does this project do? What are the major pieces? How do they
   connect? What can users do?

**If this is an update (human/index.html already exists):**

Do NOT rescan the entire project. Instead:

1. Read the existing `human/index.html` to understand what is already documented
2. Read only the files/areas described in the context provided by the caller
3. Determine which sections of the HTML need updating based on the changes

## Step 2: Write or Update human/index.html

Create a single self-contained HTML file. Use the structure and HTML template below.

### Content Sections

Each section is wrapped in `<!-- SECTION: name -->` comments for easy updates.

1. **The Big Picture** — 2-4 paragraph narrative of what the project is, who it
   is for, and what it does. No code. No file paths. Just the story.

2. **Architecture — What Are the Moving Parts?** — A Mermaid `graph TD` diagram
   showing major components and connections, followed by a Component Guide
   explaining each one in plain English (what it does, where it lives, what it
   talks to).

3. **How Things Flow — Key User Journeys** — For each major user-facing flow,
   a Mermaid `sequenceDiagram` with a one-sentence intro and a narrative
   walkthrough after.

4. **Key Decisions** — Why things were built this way. For each decision: what
   was decided, why, and what it means for the user.

5. **What Changed** (only when updating) — Narrative summary of recent changes.
   Write like a short story, not a git log. No filenames or commit hashes.

### Mermaid Diagram Rules

**Architecture diagrams (`graph TD`):**
- Human-readable labels with emoji: `User["🧑 User"]`, `DB["💾 Database"]`
- Subgraphs to group related components
- Label every arrow with plain English: `-->|"sends login request"|`
- Max 10 nodes — make a separate focused diagram if needed
- External services get a different emoji so "ours" vs "theirs" is clear

**Sequence diagrams (`sequenceDiagram`):**
- Always start with the User actor
- Plain-English arrow labels: `User->>Website: Clicks "Sign Up"` — never HTTP methods
- Show the happy path. Only add error paths if critical to understanding
- Show responses going back — full round trip
- Use `Note over` for non-obvious steps
- Max 8-12 interactions per diagram — break longer flows into phases

### HTML Template

Use this exact HTML structure. The Mermaid JS library will render all diagrams
automatically when the file is opened in a browser.

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>[Project Name] — How It Works</title>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.7;
            color: #1a1a2e;
            background: #fafafa;
            max-width: 900px;
            margin: 0 auto;
            padding: 2rem 1.5rem;
        }

        h1 {
            font-size: 2rem;
            margin-bottom: 0.25rem;
            color: #1a1a2e;
        }

        h1 + p { color: #555; font-size: 1.1rem; margin-bottom: 2rem; }

        h2 {
            font-size: 1.4rem;
            margin-top: 3rem;
            margin-bottom: 1rem;
            padding-bottom: 0.4rem;
            border-bottom: 2px solid #e0e0e0;
            color: #1a1a2e;
        }

        h3 { font-size: 1.15rem; margin-top: 1.8rem; margin-bottom: 0.6rem; color: #2d2d44; }

        p { margin-bottom: 1rem; }

        .subtitle { color: #666; font-size: 0.9rem; margin-bottom: 2rem; }

        /* Table of contents */
        nav {
            background: #f0f0f5;
            border-radius: 8px;
            padding: 1.2rem 1.5rem;
            margin-bottom: 2.5rem;
        }
        nav h2 { margin: 0 0 0.6rem 0; font-size: 1rem; border: none; color: #555; text-transform: uppercase; letter-spacing: 0.05em; }
        nav ul { list-style: none; }
        nav li { margin-bottom: 0.3rem; }
        nav a { color: #4a6cf7; text-decoration: none; font-weight: 500; }
        nav a:hover { text-decoration: underline; }

        /* Mermaid diagrams */
        .mermaid {
            background: #fff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 1.5rem;
            margin: 1.5rem 0;
            text-align: center;
        }

        /* Component guide */
        .component { margin-bottom: 1rem; }
        .component strong { color: #2d2d44; }

        /* Collapsible sections */
        details {
            margin: 1.5rem 0;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
        }
        summary {
            padding: 1rem 1.2rem;
            background: #f8f8fc;
            cursor: pointer;
            font-weight: 600;
            font-size: 1.05rem;
            color: #2d2d44;
            user-select: none;
        }
        summary:hover { background: #f0f0f5; }
        details > div { padding: 1rem 1.2rem; }

        /* What Changed section */
        .changelog {
            background: #fffbeb;
            border-left: 4px solid #f59e0b;
            padding: 1rem 1.2rem;
            border-radius: 0 8px 8px 0;
            margin: 1rem 0;
        }

        /* Decision cards */
        .decision {
            background: #f8f8fc;
            border-radius: 8px;
            padding: 1rem 1.2rem;
            margin-bottom: 1rem;
        }
        .decision strong { display: block; margin-bottom: 0.3rem; }

        /* Responsive */
        @media (max-width: 600px) {
            body { padding: 1rem; }
            h1 { font-size: 1.5rem; }
        }

        html { scroll-behavior: smooth; }
    </style>
</head>
<body>

<h1>[Project Name] — How It Works</h1>
<p>[One-sentence summary of what the project does]</p>
<p class="subtitle">Last updated: [date]</p>

<nav>
    <h2>On This Page</h2>
    <ul>
        <li><a href="#big-picture">The Big Picture</a></li>
        <li><a href="#architecture">Architecture — What Are the Moving Parts?</a></li>
        <li><a href="#flows">How Things Flow — Key User Journeys</a></li>
        <li><a href="#decisions">Key Decisions</a></li>
        <!-- <li><a href="#changed">What Changed</a></li> -->
    </ul>
</nav>

<!-- SECTION: big-picture -->
<h2 id="big-picture">The Big Picture</h2>
<p>[2-4 paragraphs explaining what this project is, who it is for, and what it does]</p>

<!-- SECTION: architecture -->
<h2 id="architecture">Architecture — What Are the Moving Parts?</h2>
<div class="mermaid">
graph TD
    [architecture diagram here]
</div>

<h3>Component Guide</h3>
<div class="component">
    <strong>[Component Name]</strong>
    <p>[What it does, where it lives, what it talks to]</p>
</div>

<!-- SECTION: flows -->
<h2 id="flows">How Things Flow — Key User Journeys</h2>

<details open>
    <summary>[Flow Name, e.g. "Signing Up"]</summary>
    <div>
        <p>[What the user is doing, in their words]</p>
        <div class="mermaid">
sequenceDiagram
    [sequence diagram here]
        </div>
        <p><strong>What happens:</strong> [Step-by-step narrative]</p>
    </div>
</details>

<details>
    <summary>[Next Flow Name]</summary>
    <div>
        [...]
    </div>
</details>

<!-- SECTION: decisions -->
<h2 id="decisions">Key Decisions</h2>

<div class="decision">
    <strong>[What was decided]</strong>
    <p><strong>Why:</strong> [reason]</p>
    <p><strong>What it means for you:</strong> [implication]</p>
</div>

<!-- SECTION: changed -->
<!--
<h2 id="changed">What Changed</h2>
<div class="changelog">
    <p>[Narrative of what changed]</p>
</div>
-->

<script>
    mermaid.initialize({
        startOnLoad: true,
        theme: 'neutral',
        securityLevel: 'loose',
        flowchart: { useMaxWidth: true, htmlLabels: true, curve: 'basis' },
        sequence: { useMaxWidth: true, wrap: true }
    });
</script>

</body>
</html>
```

## Step 3: Tone Guide

- **Friendly, not dumbing down.** The reader is smart but unfamiliar.
- **Specific, not vague.** "The API server checks if the email is already in the
  database" beats "validation occurs."
- **Story, not list.** Narrative over bullet points where possible.
- **Empowering, not intimidating.** The reader should think "Oh, I get it!"
- **Honest about complexity.** If something is complicated, say so — then explain it.
- Avoid jargon. When a technical term is unavoidable, define it in parentheses
  the first time.

## Step 4: Review Checklist

Before finishing, verify:
- Could someone with no coding background follow the Big Picture?
- Does the architecture diagram show all major components?
- Are all arrow labels in plain English (no HTTP methods, no jargon)?
- Does each flow diagram tell a complete story from user action to result?
- Is the Key Decisions section honest about trade-offs?
- If updating, does What Changed explain the change narratively?
- Open the HTML mentally — are all Mermaid blocks syntactically valid?
- Are `<!-- SECTION: name -->` comment markers in place for all sections?

**End of subagent prompt**

---
