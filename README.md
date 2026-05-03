# Jira 2.0 — Interactive Prototype

**From configurability to cognitive efficiency.**

A working two-mode prototype demonstrating the contrast between Jira's current friction-heavy experience and an AI-native reimagining. Built for the Qure.ai Senior Product Manager case study.

🔗 **Live demo:** [your-username.github.io/jira-2-0](https://your-username.github.io/jira-2-0)

---

## What's inside

### Mode 1 — Jira Today
A faithful recreation of Jira's current visual language and friction-heavy workflows. Includes:
- The "noise-heavy" home with recommended spaces, mention widgets, "Try Jira Service Management" upsells
- 12-field create modal requiring manual project + issue type + summary + assignee + priority entry
- Dashboard creation showing the actual 4-step JQL filter → save → dashboard → gadget configuration flow
- Full ticket detail with comments, status changes, sidebar fields
- Persistent navigation between projects, boards, tickets

### Mode 2 — Jira 2.0
The AI-native reimagining. Same Atlassian color palette, modern interaction patterns. Includes:

**Action-first home with persona switching**
- Same data layer, three different views (PM / Engineer / Engineering Manager)
- Each persona surfaces what's relevant: blockers for PM, code/PRs for Engineer, team health for Manager
- Every surfaced item explains why it appears (mentions, dependencies, urgency signals)
- Quick actions inline (Reply, Approve, Escalate, Nudge) without opening tickets

**Conversational ticket creation with AI uncertainty handling**
- Plain English input → drafted ticket with project, assignee, priority, due date inferred
- Confidence scoring shown for every field
- AI clarification flow when ambiguity is detected (rather than guessing silently)
- User confirms before anything is filed — assisted structuring, not autonomous creation

**Natural language dashboards**
- Type a question, get JQL + visualization
- Multiple visualization types: table, bar chart, line chart, pie chart (Chart.js)
- AI selects the right viz automatically; user can switch with one click
- Generated JQL displayed for validation, refinement, or correction
- AI insight summary explains what the data means
- 5 example queries pre-loaded for demo flow

**Cross-cutting AI features**
- Smart search bar (top nav) that routes intent — questions go to dashboards, "create" intent opens the ticket modal
- Notification grouping — related notifications collapsed by AI
- Smart suggestions in tickets — find similar issues, suggest replies
- Sprint planning — capacity insights with reassignment suggestions

### What works end-to-end
- Click any ticket → opens full detail view with comments
- Add comments that persist during the session
- Change ticket status (workflow buttons)
- Switch between modes via toggle (top of page) — preference persists in localStorage
- Switch personas (Jira 2.0 only) — entire home reorganizes
- Create new tickets in either mode — they appear in boards and queries
- Notifications panel with mark-as-read

---

## Three theses demonstrated

**Thesis 1: Action-first home, not activity feed.** Compare the Jira Today home (recommended spaces, mention widgets, upsells) with the Jira 2.0 home (only what blocks others, only what's overdue, only what needs your decision).

**Thesis 2: Conversational ticket creation.** Compare the 12-field create modal in Jira Today with the conversational input in Jira 2.0 — including the AI clarification flow when input is ambiguous.

**Thesis 3: Natural language dashboards.** Compare the 4-step dashboard creation flow in Jira Today with the single-question input in Jira 2.0 — and note the JQL transparency that keeps users in control.

---

## How it's built

Multi-file architecture with zero build process:

```
jira-2-0/
├── index.html              # Entry point
├── styles/
│   ├── base.css            # Shared base + mode toggle bar
│   ├── jira-today.css      # Atlassian-faithful styling
│   └── jira-2-0.css        # Modern AI-native styling, same palette
├── scripts/
│   ├── data.js             # Sample data (4 projects, 8 users, ~17 tickets)
│   ├── state.js            # Central state, helpers, icons
│   ├── jira-today.js       # Jira Today mode logic
│   ├── jira-2-0.js         # Jira 2.0 mode logic
│   └── router.js           # Mode toggle, navigation, init
└── README.md
```

- Vanilla JavaScript with object-based modules
- Chart.js via CDN for dashboard visualizations
- No npm, no React, no build step
- Deploys to GitHub Pages with one click

---

## Deploy to GitHub Pages

**1. Create a new public GitHub repo** named `jira-2-0` (or whatever you want — the URL just changes).

**2. Upload these files** — drag the entire folder contents into GitHub's web upload interface, or use git:

```bash
cd path/to/jira-2-0
git init
git add .
git commit -m "Jira 2.0 case study prototype"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/jira-2-0.git
git push -u origin main
```

**3. Enable Pages**
- Go to repo **Settings → Pages**
- Source: **Deploy from a branch**
- Branch: `main`, folder: `/ (root)`
- Click **Save**

**4. Wait 1-2 minutes** for GitHub to build. Your site goes live at `https://YOUR-USERNAME.github.io/jira-2-0`.

---

## Run locally (for testing before deploying)

```bash
cd jira-2-0
python3 -m http.server 8000
# Open http://localhost:8000
```

Or just double-click `index.html` — should work in modern browsers.

---

## Demo walkthrough

When presenting in the case discussion:

**Step 1.** Open in Jira Today mode. Show the home noise — recommended spaces, mention widgets, upsells. Click into a ticket to show the comment thread, status change flow.

**Step 2.** Open the create modal. Count the fields: 12+. Show how a simple bug requires manual selection of every dimension.

**Step 3.** Open Dashboards. Show the 4-step JQL filter → save → dashboard → gadget creation flow.

**Step 4.** Toggle to Jira 2.0. Show the action-first home — only blockers, overdue, and decisions waiting on you. Switch personas — same data, different views.

**Step 5.** Open the create modal in 2.0. Try the bug example — see all fields auto-drafted with explainability tags. Try the ambiguous example — see the AI ask for clarification rather than guess.

**Step 6.** Open Dashboards in 2.0. Type a query like "Sprint velocity for the last 4 sprints" — see JQL generated, line chart rendered automatically, AI insight summary. Switch between table / bar / line views.

**Step 7.** Land on the closing principle slide — Jira 2.0 is an AI interaction layer on top of Jira's existing system of record, not a rebuild.

---

## Built for

**Qure.ai Senior Product Manager case study — May 2026**
By Parth Aggarwal

Sample data uses fictional companies and people — no real client or colleague information.
