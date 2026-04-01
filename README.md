# human.md

**Keep humans in the loop.**

`claude.md` gives AI context about your project. `human.md` gives *you* that same understanding.

A [Claude Code](https://claude.ai/code) skill that generates a visual, plain-English guide to your codebase — so you always know what AI built, how it connects, and why.

## The Problem

You're a vibe coder. You describe features, AI builds them, things work. But after a dozen features, you realize you don't actually know how your own project works anymore. You can't debug issues, you can't explain your app to others, and you're scared to change anything because you don't know what might break.

**human.md** fixes this by keeping you in the loop as your project grows.

## What It Does

After major changes, Claude automatically generates (or updates) a single HTML file — `human/index.html` — that you open in your browser. It contains:

- **The Big Picture** — A plain-English narrative of what your project does
- **Architecture Diagram** — A visual map of all the moving parts (Mermaid JS)
- **User Flow Diagrams** — Step-by-step visuals: *user clicks button → frontend → API → database → response*
- **Key Decisions** — Why things were built this way, what the trade-offs are
- **What Changed** — A narrative of recent changes (not a git log — a story)

Everything is written for humans, not programmers. No jargon. No file paths. No function signatures. Just the story of your project.

```mermaid
graph TD
    User["🧑 You"]
    Claude["🤖 Claude Code"]
    Skill["📄 human.md skill"]
    HTML["🌐 human/index.html"]
    Browser["🖥️ Your Browser"]

    User -->|"builds features with"| Claude
    Claude -->|"auto-triggers"| Skill
    Skill -->|"generates"| HTML
    HTML -->|"opens in"| Browser
    Browser -->|"you understand your project"| User
```

## Install

```
/install github:tsengtinghan/human.md
```

## Usage

### Automatic
Just build features as normal. After major changes (new routes, schema changes, integrations, structural refactors), Claude will automatically update your docs and open them in the browser.

### Manual

```
/human
```
Generates a full project overview (or refreshes an existing one).

```
/human auth flow
```
Updates just the auth flow section.

```
/human payments
```
Updates just the payments section.

## What You Get

A single `human/index.html` file at your project root. Double-click it (or Claude opens it for you automatically). It looks like this:

- Clean, readable page with a table of contents
- Interactive Mermaid diagrams that render live in the browser
- Collapsible sections for each user flow
- Works offline — no server needed
- Bookmark the URL to come back anytime

## Philosophy

AI is great at building. Humans are great at deciding *what* to build. But that only works if the human understands the current state of things. 

**human.md** is based on a simple idea: the human should always have a clear mental model of their project, even if AI wrote every line of code. Not because they need to read the code — but because they need to *own* the product.

This means:
- **Involve, don't inform.** The docs should make you feel like you understand your project, not like you're reading someone else's.
- **Show, don't tell.** Diagrams over descriptions. Flows over file trees.
- **Story, not spec.** Written like you're explaining to a smart friend, not documenting for a team of engineers.
- **Honest about trade-offs.** If something is hacky, say so. If a decision has downsides, explain them.

## License

MIT
