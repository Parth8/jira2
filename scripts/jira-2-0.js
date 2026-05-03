// ============================================================================
// JIRA 2.0 — AI-NATIVE REIMAGINING
// ============================================================================

const Jira20 = {

  // Track active chart instances so we can destroy them on re-render
  _chartInstances: {},
  _activeVizType: 'bar',
  _lastQueryResult: null,

  render(view) {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="j2">
        ${this.renderTopnav()}
        ${this.renderPersonaBar()}
        <div class="j2-layout">
          ${this.renderSidebar()}
          <main class="j2-content">
            ${this.renderView(view)}
          </main>
        </div>
        <div class="j2-footer">
          Jira 2.0 — interactive prototype · From configurability to cognitive efficiency
          <div class="principles">
            <span>Action-first home</span>
            <span>Conversational creation</span>
            <span>NL dashboards</span>
          </div>
        </div>
      </div>
    `;
    this.attachHandlers();
    // Render charts after DOM is ready
    if (view === 'dashboards' && this._lastQueryResult) {
      this.renderActiveChart();
    }
  },

  // ---------- TOP NAV ----------
  renderTopnav() {
    const unreadCount = DATA.notifications.filter(n => !n.read && !STATE.sessionEdits.readNotifications.has(n.id)).length;
    return `
      <header class="j2-topnav">
        <div class="logo" onclick="navigateTo('home')">
          <div class="logo-mark">J</div>
          <span>Jira</span>
          <span class="version">2.0</span>
        </div>
        <nav class="nav-items">
          <button class="nav-item ${STATE.view === 'home' ? 'active' : ''}" onclick="navigateTo('home')">Home</button>
          <button class="nav-item" onclick="Jira20.openCreateModal()">Create</button>
          <button class="nav-item ${STATE.view === 'dashboards' ? 'active' : ''}" onclick="navigateTo('dashboards')">Dashboards</button>
          <button class="nav-item" onclick="navigateTo('project', { project: 'ATLAS' })">Boards</button>
        </nav>
        <div class="j2-ai-search">
          <span class="ai-icon">${ICONS.sparkle}</span>
          <input type="text" id="j2-search" placeholder='Ask anything... "show my blocked tickets" or "create a bug for the auth issue"' />
          <span class="shortcut">⌘K</span>
        </div>
        <button class="icon-btn" onclick="Jira20.toggleNotif(event)" title="Notifications">
          ${ICONS.notif}
          ${unreadCount > 0 ? `<span class="badge">${unreadCount}</span>` : ''}
        </button>
        <button class="icon-btn" onclick="toast('Settings panel...')" title="Settings">${ICONS.settings}</button>
        <button class="icon-btn" style="margin-left:8px;width:auto;padding:0 4px" title="Profile">${avatar('parth', 32)}</button>
      </header>
    `;
  },

  // ---------- PERSONA BAR ----------
  renderPersonaBar() {
    return `
      <div class="j2-persona-bar">
        <span class="j2-persona-label">View as:</span>
        <div class="j2-persona-pills">
          <button class="j2-persona-pill ${STATE.persona === 'pm' ? 'active' : ''}" onclick="Jira20.setPersona('pm')">Product Manager</button>
          <button class="j2-persona-pill ${STATE.persona === 'engineer' ? 'active' : ''}" onclick="Jira20.setPersona('engineer')">Engineer</button>
          <button class="j2-persona-pill ${STATE.persona === 'manager' ? 'active' : ''}" onclick="Jira20.setPersona('manager')">Engineering Manager</button>
        </div>
        <span class="info">
          <span class="j2-dot j2-dot-green"></span>
          Same data layer · Different defaults · Override anytime
        </span>
      </div>
    `;
  },

  setPersona(persona) {
    STATE.persona = persona;
    render();
    toast(`View switched to ${persona === 'pm' ? 'Product Manager' : persona === 'engineer' ? 'Engineer' : 'Engineering Manager'}`);
  },

  // ---------- SIDEBAR ----------
  renderSidebar() {
    const projectKey = STATE.currentProject;
    return `
      <aside class="j2-sidebar">
        <div class="section">
          <div class="section-title">For you</div>
          <div class="nav-link ${STATE.view === 'home' ? 'active' : ''}" onclick="navigateTo('home')">
            🏠 <span>Home</span>
          </div>
          <div class="nav-link ${STATE.view === 'dashboards' ? 'active' : ''}" onclick="navigateTo('dashboards')">
            📊 <span>Dashboards</span>
          </div>
          <div class="nav-link" onclick="toast('Opening starred items...')">
            ⭐ <span>Starred</span>
          </div>
          <div class="nav-link" onclick="toast('Opening recent...')">
            🕐 <span>Recent</span>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Projects</div>
          ${Object.values(DATA.projects).map(p => `
            <div class="nav-link ${projectKey === p.key && STATE.view === 'project' ? 'active' : ''}" onclick="navigateTo('project', { project: '${p.key}' })">
              <div class="project-icon" style="background:${p.color}20;color:${p.color}">${p.icon}</div>
              <span>${p.name}</span>
            </div>
          `).join('')}
        </div>
        <div class="section">
          <div class="section-title">AI Suggestions</div>
          <div class="nav-link" onclick="Jira20.openSmartTriage()">
            ${ICONS.sparkle} <span>Smart triage</span>
            <span class="badge">3</span>
          </div>
          <div class="nav-link" onclick="toast('Opening AI insights panel...')">
            ${ICONS.ai} <span>Weekly insights</span>
          </div>
        </div>
      </aside>
    `;
  },

  // ---------- VIEW ROUTER ----------
  renderView(view) {
    switch (view) {
      case 'home':       return this.renderHome();
      case 'project':    return this.renderProject(STATE.currentProject);
      case 'ticket':     return this.renderTicket(STATE.currentTicketKey);
      case 'dashboards': return this.renderDashboards();
      default:           return this.renderHome();
    }
  },

  // ---------- HOME ----------
  renderHome() {
    const persona = STATE.persona;
    if (persona === 'pm') return this.renderHomePM();
    if (persona === 'engineer') return this.renderHomeEngineer();
    if (persona === 'manager') return this.renderHomeManager();
  },

  renderHomePM() {
    const u = getUser('parth');
    return `
      <div class="j2-home-header">
        <h1 class="j2-home-greeting">${this.greeting()}, <span class="name">${u.name.split(' ')[0]}</span>.</h1>
        <p class="j2-home-summary">Three items need your attention. Two block other people's work.</p>
      </div>

      <div class="j2-metric-strip">
        <div class="j2-metric alert" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1245' })">
          <div class="label">Blocking others</div>
          <div class="value alert">2</div>
          <div class="sub">Action needed today</div>
        </div>
        <div class="j2-metric info">
          <div class="label">Awaiting you</div>
          <div class="value">5</div>
          <div class="sub">Reviews & decisions</div>
        </div>
        <div class="j2-metric success">
          <div class="label">Sprint health</div>
          <div class="value success">87%</div>
          <div class="sub">On track</div>
        </div>
        <div class="j2-metric warning" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1234' })">
          <div class="label">Overdue</div>
          <div class="value warning">1</div>
          <div class="sub">Compliance review</div>
        </div>
      </div>

      <div class="j2-section">
        <div class="j2-section-header">
          <div class="j2-section-title">
            <span class="j2-dot j2-dot-red"></span>
            Blocking other people's work
          </div>
          <span style="font-size:12px;color:var(--j2-text-3)">Sorted by impact</span>
        </div>

        <div class="j2-action-card priority-blocker" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1245' })">
          <div class="type-icon">${ICONS.bug}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">ATLAS-1245</span>
              <span class="priority-badge priority-P0">P0</span>
              <span class="project-tag">Atlas Data Platform</span>
            </div>
            <div class="title">Auth Tables and Clearance tables — schema mismatch blocking demo</div>
            <div class="context">Arjun Mehta and Neha Sharma are blocked on review of platform changes. Blocks Friday client demo.</div>
            <div class="why">${ICONS.sparkle} blocks 2 people · demo Friday · 4 comments mention you</div>
          </div>
          <div class="actions" onclick="event.stopPropagation()">
            <button class="quick-action" onclick="Jira20.quickReply('ATLAS-1245')">Reply</button>
            <button class="quick-action secondary" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1245' })">Open</button>
          </div>
        </div>

        <div class="j2-action-card priority-blocker" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1289' })">
          <div class="type-icon">${ICONS.task}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">ATLAS-1289</span>
              <span class="priority-badge priority-P1">P1</span>
              <span class="project-tag">Atlas Data Platform</span>
            </div>
            <div class="title">Approve YAML config schema for tenant onboarding</div>
            <div class="context">Dev Patel waiting on approval to merge the platformization changes. Blocks 3 downstream tickets.</div>
            <div class="why">${ICONS.sparkle} blocks 1 person · 3 dependent tickets · waiting 2 days</div>
          </div>
          <div class="actions" onclick="event.stopPropagation()">
            <button class="quick-action" onclick="Jira20.quickApprove('ATLAS-1289')">Approve</button>
            <button class="quick-action secondary" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1289' })">Review</button>
          </div>
        </div>
      </div>

      <div class="j2-section">
        <div class="j2-section-header">
          <div class="j2-section-title">
            <span class="j2-dot j2-dot-yellow"></span>
            Overdue · waiting on you
          </div>
        </div>

        <div class="j2-action-card priority-overdue" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1234' })">
          <div class="type-icon">${ICONS.story}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">ATLAS-1234</span>
              <span class="priority-badge priority-P1">P1</span>
              <span class="project-tag">Atlas Documentation</span>
              <span style="font-size:11px;background:var(--j2-red-bg);color:var(--j2-red);padding:1px 6px;border-radius:3px;font-weight:600">Overdue 3d</span>
            </div>
            <div class="title">Review platform contract v2.1 with compliance team</div>
            <div class="why">${ICONS.sparkle} due May 1 · Karan Verma waiting for sign-off</div>
          </div>
        </div>
      </div>

      <div class="j2-section">
        <div class="j2-section-header">
          <div class="j2-section-title">
            <span class="j2-dot j2-dot-blue"></span>
            Awaiting your review · 5
          </div>
          <button onclick="toast('Showing all reviews...')" style="background:none;border:none;color:var(--j2-blue);font-size:12px;cursor:pointer;font-weight:500">View all →</button>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${this.renderQuickCard('BEACON-432', 'Q2 roadmap input — TPL extracts', 'priya', '3 hours ago', 'story')}
          ${this.renderQuickCard('BEACON-401', 'MoEngage extract format approval', 'neha', '4 hours ago', 'task')}
          ${this.renderQuickCard('ATLAS-1198', 'Redshift slot allocation flag review', 'arjun', '1 day ago', 'task')}
          ${this.renderQuickCard('ATLAS-1156', 'DigiFi schema drift in UAT', 'arjun', '6 hours ago', 'bug')}
        </div>
      </div>

      <div class="j2-ai-block">
        <div class="ai-badge">${ICONS.sparkle} EXPLAIN</div>
        <div class="body">
          <div class="title">Why these items appear here</div>
          <div class="text">
            Items are ranked using activity signals (mentions, recent comments, due dates, dependency links) — not just the priority field, which is often stale or inconsistent. Each card explains why it surfaced. If the wrong items are surfacing, this feature has failed — so we measure user override rate as a primary quality metric.
          </div>
          <div class="actions">
            <a href="javascript:toast('Customization panel...')">Customize ranking signals →</a>
            <a href="javascript:toast('Feedback recorded')">Was this useful? 👍 👎</a>
          </div>
        </div>
      </div>

      <div class="j2-compare">
        <div class="label">Compare · What you'd see on Jira today</div>
        <div class="text">
          "Recommended spaces" carousel · "Reply to mentions" widget (one item, no priority) · "Join a team" suggestions · "Try Jira Service Management" upsell · "Were these recommendations useful?" feedback
        </div>
        <div class="text" style="margin-top:8px">
          <strong>Average user time-to-first-action on current Jira home: ~3 minutes</strong> (scrolling past noise). Target for Jira 2.0: under 30 seconds.
        </div>
        <a href="javascript:setMode('today')" class="compare-link">Switch to Jira Today to see the contrast →</a>
      </div>
    `;
  },

  renderHomeEngineer() {
    return `
      <div class="j2-home-header">
        <h1 class="j2-home-greeting">${this.greeting()}, <span class="name">Arjun</span>.</h1>
        <p class="j2-home-summary">Two tickets in progress. One PR awaiting your review.</p>
      </div>

      <div class="j2-metric-strip">
        <div class="j2-metric info">
          <div class="label">In progress</div>
          <div class="value">3</div>
          <div class="sub">Active tickets</div>
        </div>
        <div class="j2-metric alert">
          <div class="label">PRs awaiting review</div>
          <div class="value alert">2</div>
          <div class="sub">From your team</div>
        </div>
        <div class="j2-metric warning">
          <div class="label">Code review backlog</div>
          <div class="value warning">4</div>
          <div class="sub">Older than 24h</div>
        </div>
        <div class="j2-metric success">
          <div class="label">Sprint capacity</div>
          <div class="value success">68%</div>
          <div class="sub">Healthy</div>
        </div>
      </div>

      <div class="j2-section">
        <div class="j2-section-header">
          <div class="j2-section-title">
            <span class="j2-dot j2-dot-red"></span>
            Today · in progress
          </div>
        </div>

        <div class="j2-action-card priority-blocker" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1245' })">
          <div class="type-icon">${ICONS.bug}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">ATLAS-1245</span>
              <span class="priority-badge priority-P0">P0</span>
              <span class="project-tag">Atlas Data Platform</span>
            </div>
            <div class="title">Auth Tables and Clearance tables — schema mismatch blocking demo</div>
            <div class="context">
              <span style="color:var(--j2-green)">● 2 commits today</span> ·
              <span style="color:var(--j2-text-3)">PR draft open</span> ·
              <span style="color:var(--j2-text-3)">CI passing</span>
            </div>
            <div class="why">${ICONS.sparkle} linked branch: feature/auth-schema-fix · last commit 1h ago</div>
          </div>
        </div>

        <div class="j2-action-card" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1198' })">
          <div class="type-icon">${ICONS.task}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">ATLAS-1198</span>
              <span class="priority-badge priority-P2">P2</span>
              <span class="project-tag">Atlas Data Platform</span>
            </div>
            <div class="title">Implement Redshift slot allocation flags in TPL DAG</div>
            <div class="context">CI passing · ready for review · 6 hours of work logged</div>
          </div>
        </div>

        <div class="j2-action-card" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1156' })">
          <div class="type-icon">${ICONS.bug}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">ATLAS-1156</span>
              <span class="priority-badge priority-P1">P1</span>
              <span class="project-tag">Atlas Data Platform</span>
            </div>
            <div class="title">DigiFi-equivalent schema drift breaking UAT pipeline</div>
            <div class="context">Reproduced locally · investigating root cause</div>
          </div>
        </div>
      </div>

      <div class="j2-section">
        <div class="j2-section-header">
          <div class="j2-section-title">
            <span class="j2-dot j2-dot-blue"></span>
            PRs awaiting your review · 2
          </div>
        </div>

        <div class="j2-action-card" onclick="toast('Opening PR in code review...')">
          <div class="type-icon">${ICONS.link}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">PR #4521</span>
              <span class="project-tag">Atlas Data Platform</span>
            </div>
            <div class="title">feat: Add multi-tenant config validation</div>
            <div class="context">Dev Patel · 3 files changed, +247/-89 lines · CI passing</div>
            <div class="why">${ICONS.sparkle} requested by Dev Patel · waiting 6 hours</div>
          </div>
        </div>
      </div>

      <div class="j2-ai-block">
        <div class="ai-badge">${ICONS.sparkle} EXPLAIN</div>
        <div class="body">
          <div class="title">Engineer view priorities</div>
          <div class="text">
            Surfaces items with active code linkage, CI status, and PR state. Roadmaps and portfolio views are collapsed by default. Override anytime — these are defaults, not constraints.
          </div>
        </div>
      </div>
    `;
  },

  renderHomeManager() {
    return `
      <div class="j2-home-header">
        <h1 class="j2-home-greeting">${this.greeting()}, <span class="name">Priya</span>.</h1>
        <p class="j2-home-summary">Team velocity is up 12%. Two blockers need escalation.</p>
      </div>

      <div class="j2-metric-strip">
        <div class="j2-metric success">
          <div class="label">Team velocity</div>
          <div class="value success">42pt</div>
          <div class="sub">+12% vs last sprint</div>
        </div>
        <div class="j2-metric alert">
          <div class="label">Blockers across team</div>
          <div class="value alert">4</div>
          <div class="sub">2 need escalation</div>
        </div>
        <div class="j2-metric warning">
          <div class="label">At risk this sprint</div>
          <div class="value warning">3</div>
          <div class="sub">Tickets · 8 story pts</div>
        </div>
        <div class="j2-metric info">
          <div class="label">Capacity utilization</div>
          <div class="value">76%</div>
          <div class="sub">8 engineers</div>
        </div>
      </div>

      <div class="j2-section">
        <div class="j2-section-header">
          <div class="j2-section-title">
            <span class="j2-dot j2-dot-red"></span>
            Needs escalation · 2
          </div>
        </div>

        <div class="j2-action-card priority-blocker" onclick="navigateTo('ticket', { ticketKey: 'HELIOS-187' })">
          <div class="type-icon">${ICONS.bug}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">HELIOS-187</span>
              <span class="priority-badge priority-P0">P0</span>
              <span class="project-tag">Helios Fraud Engine</span>
              <span style="font-size:11px;background:var(--j2-red-bg);color:var(--j2-red);padding:1px 6px;border-radius:3px;font-weight:600">Stuck 5d</span>
            </div>
            <div class="title">False positive rate spike in velocity rules</div>
            <div class="context">Owner: Neha Sharma · Blocked on data team for 2 days · production impact</div>
            <div class="why">${ICONS.sparkle} 11% FP rate in production · customer complaints rising · cross-team dependency unresolved</div>
          </div>
          <div class="actions" onclick="event.stopPropagation()">
            <button class="quick-action" onclick="toast('Escalation drafted: notifying VP Eng + data team lead')">Escalate</button>
          </div>
        </div>

        <div class="j2-action-card priority-blocker" onclick="navigateTo('ticket', { ticketKey: 'ATLAS-1289' })">
          <div class="type-icon">${ICONS.task}</div>
          <div class="body">
            <div class="meta-row">
              <span class="key">ATLAS-1289</span>
              <span class="priority-badge priority-P1">P1</span>
              <span class="project-tag">Atlas Data Platform</span>
              <span style="font-size:11px;background:var(--j2-red-bg);color:var(--j2-red);padding:1px 6px;border-radius:3px;font-weight:600">Stuck 2d</span>
            </div>
            <div class="title">YAML config approval — waiting on Parth</div>
            <div class="context">Owner: Dev Patel · Blocks 3 downstream tickets · sprint commitment at risk</div>
          </div>
          <div class="actions" onclick="event.stopPropagation()">
            <button class="quick-action" onclick="toast('Nudged Parth on Slack')">Nudge owner</button>
          </div>
        </div>
      </div>

      <div class="j2-section">
        <div class="j2-section-header">
          <div class="j2-section-title">
            <span class="j2-dot j2-dot-blue"></span>
            Sprint health by engineer
          </div>
        </div>

        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          ${this.renderEngineerCapacity('arjun', 92, 'On track', 'success')}
          ${this.renderEngineerCapacity('neha', 78, 'On track', 'success')}
          ${this.renderEngineerCapacity('dev', 65, 'Light load', 'info')}
          ${this.renderEngineerCapacity('rohan', 105, 'Over capacity', 'warning')}
        </div>
      </div>

      <div class="j2-ai-block">
        <div class="ai-badge">${ICONS.sparkle} INSIGHT</div>
        <div class="body">
          <div class="title">Pattern detected this sprint</div>
          <div class="text">
            Rohan Kapoor is at 105% capacity while Dev Patel is at 65%. Three of Rohan's tickets are unrelated to mobile work and could be reassigned to Dev for better load balancing.
          </div>
          <div class="actions">
            <a href="javascript:toast('Suggested reassignments saved as draft')">Show suggested reassignments →</a>
          </div>
        </div>
      </div>
    `;
  },

  renderEngineerCapacity(userId, percent, status, type) {
    const u = getUser(userId);
    return `
      <div class="j2-action-card" onclick="toast('Opening ${u.name} workload view...')">
        <div style="flex-shrink:0">${avatar(userId, 36)}</div>
        <div class="body">
          <div style="font-weight:500;font-size:14px;margin-bottom:4px">${u.name}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
            <div style="flex:1;height:6px;background:var(--j2-border);border-radius:3px;overflow:hidden">
              <div style="height:100%;width:${Math.min(percent,100)}%;background:${type === 'warning' ? 'var(--j2-yellow)' : type === 'success' ? 'var(--j2-green)' : 'var(--j2-blue)'};"></div>
            </div>
            <span style="font-size:12px;font-weight:600;color:var(--j2-text-2);min-width:40px;text-align:right">${percent}%</span>
          </div>
          <div style="font-size:12px;color:var(--j2-text-3)">${status}</div>
        </div>
      </div>
    `;
  },

  renderQuickCard(key, title, fromUser, time, type) {
    const u = getUser(fromUser);
    return `
      <div class="j2-action-card" onclick="navigateTo('ticket', { ticketKey: '${key}' })" style="margin-bottom:0">
        <div class="type-icon">${ICONS[type]}</div>
        <div class="body">
          <div class="meta-row">
            <span class="key">${key}</span>
          </div>
          <div class="title" style="font-size:13px;margin-bottom:4px">${title}</div>
          <div style="font-size:11px;color:var(--j2-text-3)">${u.name} · ${time}</div>
        </div>
      </div>
    `;
  },

  greeting() {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  },

  // ---------- PROJECT (board view) ----------
  renderProject(projectKey) {
    const project = getProject(projectKey);
    if (!project) return '<p>Project not found</p>';
    const tickets = getTicketsByProject(projectKey);
    const grouped = {
      todo:    tickets.filter(t => t.status === 'todo'),
      inprog:  tickets.filter(t => t.status === 'inprog'),
      review:  tickets.filter(t => t.status === 'review'),
      blocked: tickets.filter(t => t.status === 'blocked'),
      done:    tickets.filter(t => t.status === 'done'),
    };

    return `
      <div class="j2-page-header">
        <div class="j2-breadcrumb">
          <a href="javascript:navigateTo('home')">Projects</a>
          ${ICONS.chevron_right}
          <span>${project.name}</span>
        </div>
        <h1 class="j2-page-title">
          <span style="color:${project.color};margin-right:8px">${project.icon}</span>
          ${project.name}
        </h1>
        <div style="display:flex;gap:8px;margin-top:12px;align-items:center">
          <button class="j2-btn">${ICONS.filter} Filters</button>
          <button class="j2-btn">Group by ${ICONS.chevron_down}</button>
          <button class="j2-btn j2-btn-ai" onclick="toast('AI sprint planner opening...')">${ICONS.sparkle} AI Plan Sprint</button>
          <span style="margin-left:auto;color:var(--j2-text-2);font-size:13px">Sprint 16 · 8 engineers · 42 pts</span>
        </div>
      </div>

      <div class="j2-board">
        ${[
          ['todo', 'To Do'],
          ['inprog', 'In Progress'],
          ['review', 'In Review'],
          ['blocked', 'Blocked'],
          ['done', 'Done'],
        ].map(([key, label]) => `
          <div class="j2-column">
            <div class="j2-column-header">
              <span>${label}</span>
              <span>${grouped[key].length}</span>
            </div>
            ${grouped[key].map(t => this.renderBoardCard(t)).join('')}
          </div>
        `).join('')}
      </div>
    `;
  },

  renderBoardCard(ticket) {
    return `
      <div class="j2-card-ticket" onclick="navigateTo('ticket', { ticketKey: '${ticket.key}' })">
        <div class="title">${ticket.title}</div>
        <div class="bottom-row">
          <div class="meta">
            ${ICONS[ticket.type]}
            <span class="key">${ticket.key}</span>
          </div>
          <div class="meta">
            ${getPriorityIcon(ticket.priority)}
            ${avatar(ticket.assignee, 20)}
          </div>
        </div>
      </div>
    `;
  },

  // ---------- TICKET DETAIL ----------
  renderTicket(key) {
    const ticket = getTicket(key);
    if (!ticket) return '<p>Ticket not found</p>';
    const project = getProject(ticket.project);
    const status = DATA.statuses[ticket.status];
    const reporter = getUser(ticket.reporter);
    const assignee = getUser(ticket.assignee);

    // AI-suggested similar tickets
    const similar = getAllTickets()
      .filter(t => t.key !== key && t.project === ticket.project && t.type === ticket.type)
      .slice(0, 2);

    return `
      <div class="j2-page-header">
        <div class="j2-breadcrumb">
          <a href="javascript:navigateTo('home')">Projects</a>
          ${ICONS.chevron_right}
          <a href="javascript:navigateTo('project', { project: '${ticket.project}' })">${project.name}</a>
          ${ICONS.chevron_right}
          <span>${ticket.key}</span>
        </div>
      </div>

      <div class="j2-ticket-detail">
        <div class="main">
          <div style="font-size:12px;color:var(--j2-text-3);margin-bottom:8px;display:flex;align-items:center;gap:8px">
            ${ICONS[ticket.type]}
            <a href="javascript:navigateTo('project', { project: '${ticket.project}' })">${ticket.key}</a>
          </div>
          <h1>${ticket.title}</h1>

          <div style="display:flex;gap:8px;margin-bottom:24px;flex-wrap:wrap">
            <button class="j2-btn j2-btn-primary" onclick="Jira20.changeStatus('${ticket.key}')">
              <span class="j2-status-pill" style="background:${status.bg};color:${status.color}">${status.name}</span>
              ${ICONS.chevron_down}
            </button>
            <button class="j2-btn">${ICONS.attach} Attach</button>
            <button class="j2-btn">${ICONS.link} Link</button>
            <button class="j2-btn j2-btn-ai" onclick="Jira20.smartSuggest('${ticket.key}')">${ICONS.sparkle} Smart actions</button>
          </div>

          ${similar.length > 0 ? `
            <div class="j2-suggestions">
              <div class="header">
                ${ICONS.sparkle}
                Similar tickets · AI detected
              </div>
              ${similar.map(s => `
                <div class="item" onclick="navigateTo('ticket', { ticketKey: '${s.key}' })">
                  <strong>${s.key}</strong> · ${s.title}
                  <span style="color:var(--j2-text-3);float:right;font-size:11px">${Math.floor(60 + Math.random() * 30)}% similar</span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div class="section-heading">Description</div>
          <div class="description">${ticket.description}</div>

          <div class="section-heading">Comments (${ticket.comments.length})</div>
          <div class="j2-comments-list">
            ${ticket.comments.map(c => {
              const u = getUser(c.author);
              return `
                <div class="j2-comment">
                  ${avatar(c.author, 32)}
                  <div class="body">
                    <div class="header-row">
                      <span class="name">${u.name}</span>
                      <span class="time">${relativeTime(c.timestamp)}</span>
                    </div>
                    <div class="text">${this.formatCommentText(c.text)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="j2-comment-input">
            <div style="display:flex;gap:12px">
              ${avatar('parth', 32)}
              <div style="flex:1">
                <textarea id="j2-comment-text" placeholder="Add a comment..."></textarea>
                <div class="actions">
                  <button class="j2-btn j2-btn-primary" onclick="Jira20.addComment('${ticket.key}')">Save</button>
                  <button class="j2-btn j2-btn-ai" onclick="Jira20.suggestReply('${ticket.key}')">${ICONS.sparkle} Suggest reply</button>
                  <button class="j2-btn j2-btn-subtle" onclick="document.getElementById('j2-comment-text').value=''">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="j2-ticket-sidebar">
          <div class="field-group">
            <div class="field-label">Status</div>
            <div class="field-value">
              <span class="j2-status-pill" style="background:${status.bg};color:${status.color}">${status.name}</span>
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Assignee</div>
            <div class="field-value with-avatar">
              ${avatar(ticket.assignee, 24)}
              ${assignee.name}
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Reporter</div>
            <div class="field-value with-avatar">
              ${avatar(ticket.reporter, 24)}
              ${reporter.name}
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Priority</div>
            <div class="field-value with-avatar">
              ${getPriorityIcon(ticket.priority)}
              ${DATA.priorities[ticket.priority].name}
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Project</div>
            <div class="field-value">
              <a href="javascript:navigateTo('project', { project: '${ticket.project}' })">${project.name}</a>
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Sprint</div>
            <div class="field-value">${ticket.sprint || '—'}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Labels</div>
            <div class="field-value">
              ${ticket.labels.map(l => `<span style="display:inline-block;background:var(--j2-bg);padding:2px 8px;border-radius:3px;font-size:12px;margin-right:4px;margin-bottom:4px">${l}</span>`).join('') || '—'}
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Created</div>
            <div class="field-value" style="font-size:13px;color:var(--j2-text-2)">${ticket.created}</div>
          </div>
        </aside>
      </div>
    `;
  },

  formatCommentText(text) {
    return text.replace(/@(\w+\s\w+)/g, '<span style="background:var(--j2-blue-bg);color:var(--j2-blue-dark);padding:1px 5px;border-radius:3px;font-weight:500">@$1</span>');
  },

  changeStatus(ticketKey) {
    const ticket = getTicket(ticketKey);
    const next = {
      todo: 'inprog', inprog: 'review', review: 'done',
      blocked: 'inprog', done: 'todo',
    }[ticket.status];
    changeStatus(ticketKey, next);
    toast(`Status → ${DATA.statuses[next].name}`, 'success');
    render();
  },

  addComment(ticketKey) {
    const text = document.getElementById('j2-comment-text').value.trim();
    if (!text) { toast('Type a comment first', 'warning'); return; }
    addComment(ticketKey, text);
    toast('Comment added', 'success');
    render();
  },

  suggestReply(ticketKey) {
    const textarea = document.getElementById('j2-comment-text');
    textarea.value = "Thanks for flagging — I'll review this today and circle back with a decision before EOD.";
    textarea.focus();
    toast('AI drafted a reply — review and send', 'success');
  },

  quickReply(ticketKey) {
    navigateTo('ticket', { ticketKey });
    setTimeout(() => {
      const textarea = document.getElementById('j2-comment-text');
      if (textarea) {
        textarea.value = "Thanks for flagging — I'll review this today and circle back with a decision before EOD.";
        textarea.focus();
        toast('AI drafted a reply — review and send', 'success');
      }
    }, 300);
  },

  quickApprove(ticketKey) {
    addComment(ticketKey, '✓ Approved. Please proceed with the merge and downstream updates.');
    changeStatus(ticketKey, 'done');
    toast('Approved · status moved to Done · downstream tickets unblocked', 'success');
    render();
  },

  smartSuggest(ticketKey) {
    toast('Smart actions: re-prioritize · suggest assignee · auto-link to PR · find duplicates · summarize thread');
  },

  openSmartTriage() {
    toast('Smart triage: 3 untriaged bugs · AI suggested priority and assignee for each');
  },

  // ---------- NOTIFICATIONS ----------
  toggleNotif(e) {
    e.stopPropagation();
    const existing = document.querySelector('.j2-notif-dropdown');
    if (existing) { existing.remove(); return; }

    const btn = e.currentTarget;
    const dd = document.createElement('div');
    dd.className = 'j2-notif-dropdown';
    dd.innerHTML = `
      <div style="padding:14px 16px;border-bottom:1px solid var(--j2-border);font-weight:600;display:flex;justify-content:space-between;align-items:center">
        <span>Notifications</span>
        <button onclick="document.querySelectorAll('.j2-notif-item.unread').forEach(el => el.classList.remove('unread'));toast('All marked as read')" style="background:none;border:none;color:var(--j2-blue);font-size:12px;cursor:pointer">Mark all read</button>
      </div>
      <div style="padding:8px 16px;background:var(--j2-purple-bg);border-bottom:1px solid var(--j2-border);font-size:12px;color:var(--j2-purple);display:flex;align-items:center;gap:6px">
        ${ICONS.sparkle} <span><strong>3 of 5</strong> notifications grouped by AI as related to ATLAS-1245</span>
      </div>
      ${DATA.notifications.map(n => `
        <div class="j2-notif-item ${!n.read && !STATE.sessionEdits.readNotifications.has(n.id) ? 'unread' : ''}" onclick="Jira20.openNotifTicket(${n.id}, '${n.ticketKey}')">
          <div class="text">
            <div>${n.text}</div>
            <div class="time">${n.time}</div>
          </div>
        </div>
      `).join('')}
    `;
    btn.style.position = 'relative';
    btn.appendChild(dd);

    setTimeout(() => {
      const close = (e2) => {
        if (!dd.contains(e2.target)) {
          dd.remove();
          document.removeEventListener('click', close);
        }
      };
      document.addEventListener('click', close);
    }, 0);
  },

  openNotifTicket(id, key) {
    STATE.sessionEdits.readNotifications.add(id);
    document.querySelector('.j2-notif-dropdown')?.remove();
    navigateTo('ticket', { ticketKey: key });
  },

  // ---------- ATTACH HANDLERS ----------
  attachHandlers() {
    const search = document.getElementById('j2-search');
    if (search) {
      search.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = search.value.trim();
          if (!q) return;
          // Smart routing based on intent
          const lower = q.toLowerCase();
          if (lower.match(/create|new|file a|report a/)) {
            this.openCreateModal(q);
          } else if (lower.match(/show|find|list|how many|dashboard|chart|graph/)) {
            navigateTo('dashboards');
            setTimeout(() => {
              const ti = document.getElementById('j2-query-input');
              if (ti) { ti.value = q; ti.focus(); }
            }, 100);
          } else {
            toast(`Searching for "${q}"...`);
          }
          search.value = '';
        }
      });
    }
  },

  // ============================================================================
  // CONVERSATIONAL TICKET CREATION
  // ============================================================================

  openCreateModal(prefilled = '') {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    backdrop.innerHTML = `
      <div class="j2-ai-modal" onclick="event.stopPropagation()">
        <div class="header">
          <div class="icon">${ICONS.sparkle}</div>
          <div>
            <h2>Create a ticket</h2>
            <div class="subtitle">Describe what's happening. We'll draft the ticket — you confirm before it's filed.</div>
          </div>
          <button class="close-btn" onclick="this.closest('.modal-backdrop').remove()">×</button>
        </div>
        <div class="body" id="j2-create-body">
          <div class="j2-ai-input">
            <textarea id="j2-ticket-input" placeholder="Bug in the auth flow on Atlas staging — Arjun needs to look at it, blocking the demo Friday">${prefilled}</textarea>
            <div class="input-footer">
              <div class="examples">
                <span style="color:var(--j2-text-3);margin-right:4px">Try:</span>
                <button onclick="Jira20.loadExample(1)">Bug example</button>
                <button onclick="Jira20.loadExample(2)">Feature example</button>
                <button onclick="Jira20.loadExample(3)">Ambiguous (AI uncertainty)</button>
              </div>
              <span style="font-size:11px;color:var(--j2-text-3);font-family:monospace">⌘+Enter to draft</span>
            </div>
          </div>
          <div id="j2-create-output"></div>
        </div>
        <div class="footer">
          <span style="font-size:12px;color:var(--j2-text-3);display:flex;align-items:center;gap:6px;margin-right:auto">
            <span class="j2-dot j2-dot-green"></span>
            Assisted structuring · You confirm before anything is filed
          </span>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
    setTimeout(() => {
      const input = document.getElementById('j2-ticket-input');
      input.focus();
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          this.draftTicket();
        }
      });
      if (prefilled) this.draftTicket();
    }, 50);
  },

  loadExample(n) {
    const examples = {
      1: 'Bug in the auth flow on Atlas staging — Arjun needs to look at it, blocking the demo Friday',
      2: 'Add support for multi-region S3 buckets in the Atlas data platform — needs to be part of the v2.2 release. Dev can pick this up.',
      3: 'something is wrong with the dashboard, not sure who owns this',
    };
    document.getElementById('j2-ticket-input').value = examples[n];
  },

  draftTicket() {
    const input = document.getElementById('j2-ticket-input').value.trim();
    if (!input) {
      toast('Type a ticket description first', 'warning');
      return;
    }
    const output = document.getElementById('j2-create-output');
    output.innerHTML = `
      <div class="j2-thinking">
        <div class="dots"><span></span><span></span><span></span></div>
        <div class="text" id="j2-thinking-text">Reading your input...</div>
      </div>
    `;

    const states = [
      'Reading your input...',
      'Identifying project from context...',
      'Resolving named entities...',
      'Inferring priority from urgency signals...',
      'Finding similar tickets...',
      'Drafting structured ticket...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      const el = document.getElementById('j2-thinking-text');
      if (el && i < states.length) { el.textContent = states[i]; i++; }
    }, 280);

    setTimeout(() => {
      clearInterval(interval);
      this.renderDraft(input);
    }, 1700);
  },

  renderDraft(input) {
    const lower = input.toLowerCase();
    const output = document.getElementById('j2-create-output');

    // ---------- AMBIGUITY DETECTION ----------
    // If both project AND assignee are missing, route to clarification
    const hasProject = /atlas|beacon|helios|compass/i.test(lower);
    const hasAssignee = /arjun|neha|dev|priya|karan|maya|rohan|parth/i.test(lower);
    const isAmbiguous = !hasProject && !hasAssignee && input.length < 80;

    if (isAmbiguous) {
      output.innerHTML = `
        <div class="j2-clarify">
          <div class="header">
            <span class="icon">⚠️</span>
            <h4>I need a bit more context</h4>
          </div>
          <p>Your input is brief and doesn't clearly identify a project or owner. Rather than guess, here are my best interpretations — which one matches what you meant?</p>
          <div class="options">
            <button class="option" onclick="Jira20.disambiguate('dashboard-atlas')">
              A bug in the <strong>Atlas Data Platform</strong> dashboards · likely owner <strong>Neha Sharma</strong> (data team)
              <div style="font-size:11px;color:var(--j2-text-3);margin-top:4px">Inferred from "dashboard" + recent dashboard work in Atlas</div>
            </button>
            <button class="option" onclick="Jira20.disambiguate('dashboard-beacon')">
              A bug in the <strong>Beacon Banking Suite</strong> reporting · likely owner <strong>Dev Patel</strong>
              <div style="font-size:11px;color:var(--j2-text-3);margin-top:4px">Inferred from "dashboard" + Beacon's reporting module</div>
            </button>
            <button class="option" onclick="Jira20.disambiguate('compass-mobile')">
              A bug in the <strong>Compass Mobile</strong> in-app analytics view · likely owner <strong>Rohan Kapoor</strong>
              <div style="font-size:11px;color:var(--j2-text-3);margin-top:4px">Inferred from "dashboard" + recent mobile analytics work</div>
            </button>
            <button class="option" onclick="Jira20.disambiguate('manual')" style="background:var(--j2-bg)">
              <strong>None of these</strong> — let me fill in the details manually
            </button>
          </div>
          <div style="margin-top:12px;font-size:12px;color:var(--j2-text-3);font-style:italic;display:flex;align-items:center;gap:6px">
            ${ICONS.sparkle} The system asks instead of guessing when confidence is low. Wrong AI answers are costlier than asking.
          </div>
        </div>
      `;
      return;
    }

    // ---------- INFERENCE ----------
    let type = 'task';
    if (/bug|broken|error|fail|not working|issue|drift/i.test(lower)) type = 'bug';
    else if (/feature|build|add|implement|support|epic|migrate/i.test(lower)) type = 'story';

    let title = input.split(/[—–\-]/)[0].trim();
    if (title.length > 90) title = title.substring(0, 87) + '...';
    title = title.charAt(0).toUpperCase() + title.slice(1);

    let confidence = 70;
    if (hasAssignee) confidence += 12;
    if (hasProject) confidence += 10;
    if (/p0|p1|p2|critical|urgent|high|blocking|blocks/i.test(lower)) confidence += 6;
    if (/friday|monday|tomorrow|next week|may \d/i.test(lower)) confidence += 3;
    if (confidence > 92) confidence = 91;

    const confLabel = confidence >= 85 ? 'High' : confidence >= 70 ? 'Medium' : 'Low — review carefully';

    let projectKey = 'ATLAS', projectConf = '⚠ ambiguous — please confirm';
    if (/atlas/i.test(lower))   { projectKey = 'ATLAS';   projectConf = '"Atlas" mentioned · 94% confident'; }
    else if (/beacon/i.test(lower))  { projectKey = 'BEACON';  projectConf = '"Beacon" mentioned · 91% confident'; }
    else if (/helios/i.test(lower))  { projectKey = 'HELIOS';  projectConf = '"Helios" mentioned · 89% confident'; }
    else if (/compass|mobile/i.test(lower)) { projectKey = 'COMPASS'; projectConf = '"Compass" or "mobile" mentioned · 86% confident'; }

    let assigneeId = null, assigneeConf = '⚠ no assignee detected';
    if (/arjun/i.test(lower))      { assigneeId = 'arjun'; assigneeConf = 'named in input'; }
    else if (/neha/i.test(lower))  { assigneeId = 'neha';  assigneeConf = 'named in input'; }
    else if (/dev/i.test(lower))   { assigneeId = 'dev';   assigneeConf = 'named in input'; }
    else if (/priya/i.test(lower)) { assigneeId = 'priya'; assigneeConf = 'named in input'; }
    else if (/rohan/i.test(lower)) { assigneeId = 'rohan'; assigneeConf = 'named in input'; }
    else if (/karan/i.test(lower)) { assigneeId = 'karan'; assigneeConf = 'named in input'; }

    let priority = 'P2', priorityConf = 'default · review';
    if (/p0|critical|urgent/i.test(lower))    { priority = 'P0'; priorityConf = '"critical" detected'; }
    else if (/p1|high|blocking|blocks/i.test(lower)) { priority = 'P1'; priorityConf = 'blocking detected'; }

    let dueDate = 'Not set', dueConf = 'no date detected';
    if (/friday/i.test(lower))     { dueDate = 'Fri, May 8'; dueConf = '"Friday"'; }
    else if (/monday/i.test(lower)) { dueDate = 'Mon, May 11'; dueConf = '"Monday"'; }
    else if (/tomorrow/i.test(lower)) { dueDate = 'Mon, May 4'; dueConf = '"tomorrow"'; }
    else if (/next week/i.test(lower)) { dueDate = 'Fri, May 15'; dueConf = '"next week"'; }

    // Find similar tickets
    const similar = getAllTickets()
      .filter(t => t.project === projectKey && t.type === type)
      .slice(0, 2);

    output.innerHTML = `
      <div class="j2-draft-card">
        <div class="draft-header">
          <span>${ICONS.sparkle} DRAFT PREVIEW · review and edit before filing</span>
          <span style="font-family:monospace;font-size:11px">parsed in 1.7s</span>
        </div>
        <div class="draft-body">
          <div class="j2-draft-field">
            <span class="label">Type</span>
            <select class="value-input" id="j2-d-type">
              <option value="bug" ${type==='bug'?'selected':''}>🐛 Bug</option>
              <option value="task" ${type==='task'?'selected':''}>✓ Task</option>
              <option value="story" ${type==='story'?'selected':''}>📖 Story</option>
              <option value="epic" ${type==='epic'?'selected':''}>⭐ Epic</option>
            </select>
            <span class="confidence-tag">inferred</span>
          </div>

          <div class="j2-draft-field">
            <span class="label">Title</span>
            <input type="text" class="value-input" id="j2-d-title" value="${title.replace(/"/g, '&quot;')}" />
            <span class="confidence-tag">extracted</span>
          </div>

          <div class="j2-draft-field">
            <span class="label">Project</span>
            <select class="value-input" id="j2-d-project">
              ${Object.values(DATA.projects).map(p => `<option value="${p.key}" ${p.key===projectKey?'selected':''}>${p.icon} ${p.name}</option>`).join('')}
            </select>
            <span class="confidence-tag ${projectConf.includes('ambiguous')?'warning':''}">${projectConf}</span>
          </div>

          <div class="j2-draft-field">
            <span class="label">Assignee</span>
            <select class="value-input" id="j2-d-assignee">
              <option value="">Unassigned</option>
              ${Object.values(DATA.users).map(u => `<option value="${u.id}" ${u.id===assigneeId?'selected':''}>${u.name}</option>`).join('')}
            </select>
            <span class="confidence-tag ${assigneeConf.includes('no assignee')?'warning':''}">${assigneeConf}</span>
          </div>

          <div class="j2-draft-field">
            <span class="label">Priority</span>
            <select class="value-input" id="j2-d-priority">
              <option value="P0" ${priority==='P0'?'selected':''}>P0 · Highest</option>
              <option value="P1" ${priority==='P1'?'selected':''}>P1 · High</option>
              <option value="P2" ${priority==='P2'?'selected':''}>P2 · Medium</option>
              <option value="P3" ${priority==='P3'?'selected':''}>P3 · Low</option>
            </select>
            <span class="confidence-tag">${priorityConf}</span>
          </div>

          <div class="j2-draft-field">
            <span class="label">Due date</span>
            <input type="text" class="value-input" id="j2-d-due" value="${dueDate}" />
            <span class="confidence-tag ${dueConf.includes('no date')?'warning':''}">${dueConf}</span>
          </div>

          ${similar.length > 0 ? `
            <div class="j2-draft-field">
              <span class="label">Similar</span>
              <div style="font-size:13px;color:var(--j2-text-2)">
                ${similar.map(s => `<a href="javascript:void(0)" style="display:block;padding:4px 0">${s.key} · ${s.title.substring(0, 60)}${s.title.length > 60 ? '...' : ''}</a>`).join('')}
              </div>
              <span class="confidence-tag">${similar.length} found</span>
            </div>
          ` : ''}

          <div class="j2-draft-field" style="grid-template-columns:100px 1fr">
            <span class="label">Description</span>
            <textarea class="value-input" id="j2-d-description" rows="3" style="resize:vertical">${input}\n\nAuto-drafted from input. Review and edit before filing.</textarea>
          </div>

          <div class="j2-confidence-meter">
            <span class="label">Overall confidence</span>
            <div class="bar"><div class="fill ${confidence < 70 ? 'low' : ''}" style="width:${confidence}%"></div></div>
            <span class="value">${confLabel} · ${confidence}%</span>
          </div>

          <div style="margin-top:16px;display:flex;justify-content:flex-end;gap:8px">
            <button class="j2-btn j2-btn-subtle" onclick="document.getElementById('j2-create-output').innerHTML=''">Discard</button>
            <button class="j2-btn" onclick="toast('All fields above are editable inline')">Edit details</button>
            <button class="j2-btn j2-btn-primary" onclick="Jira20.confirmDraft()">Create ticket</button>
          </div>
        </div>
      </div>

      <div class="j2-ai-block" style="margin-top:16px">
        <div class="ai-badge">${ICONS.sparkle} PRINCIPLE</div>
        <div class="body">
          <div class="title">Assisted structuring, not autonomous creation</div>
          <div class="text">
            The system removes the effort of filling fields. The user remains the final decision-maker. Where ambiguity exists, the system presents options instead of making silent assumptions.
          </div>
        </div>
      </div>
    `;
  },

  disambiguate(choice) {
    const output = document.getElementById('j2-create-output');
    const input = document.getElementById('j2-ticket-input');

    if (choice === 'manual') {
      output.innerHTML = '';
      toast('Continue typing with more context — project name, owner, urgency...');
      input.focus();
      return;
    }

    const choices = {
      'dashboard-atlas':  { project: 'ATLAS',   assignee: 'neha',  text: 'Bug in Atlas Data Platform dashboards — Neha to investigate' },
      'dashboard-beacon': { project: 'BEACON',  assignee: 'dev',   text: 'Bug in Beacon Banking Suite reporting dashboards — Dev to investigate' },
      'compass-mobile':   { project: 'COMPASS', assignee: 'rohan', text: 'Bug in Compass Mobile in-app analytics view — Rohan to investigate' },
    };
    const c = choices[choice];
    input.value = c.text;
    toast('Context received — re-drafting...', 'success');
    setTimeout(() => this.draftTicket(), 200);
  },

  confirmDraft() {
    const projectKey = document.getElementById('j2-d-project').value;
    const newKey = generateTicketKey(projectKey);
    const ticket = {
      key: newKey,
      project: projectKey,
      type: document.getElementById('j2-d-type').value,
      priority: document.getElementById('j2-d-priority').value,
      status: 'todo',
      title: document.getElementById('j2-d-title').value,
      description: document.getElementById('j2-d-description').value,
      assignee: document.getElementById('j2-d-assignee').value || null,
      reporter: 'parth',
      sprint: 'Sprint 16',
      created: '2026-05-03',
      updated: '2026-05-03',
      labels: [],
      mentions: [],
      comments: [],
      worklog: [],
    };
    addTicket(ticket);
    document.querySelector('.modal-backdrop')?.remove();
    toast('✓ Created ' + newKey, 'success');
    setTimeout(() => navigateTo('ticket', { ticketKey: newKey }), 400);
  },

  // ============================================================================
  // NATURAL LANGUAGE DASHBOARDS
  // ============================================================================

  renderDashboards() {
    return `
      <div class="j2-dash-header">
        <h1>Dashboards</h1>
        <p>Ask a question in plain English. We'll generate the JQL and visualization. You validate the JQL before saving.</p>
      </div>

      <div class="j2-query-input">
        <div class="header">
          <div class="ai-icon">${ICONS.sparkle}</div>
          <div class="label">Ask in natural language</div>
        </div>
        <textarea id="j2-query-input" placeholder='Show me all tickets I raised for Atlas Data Platform between January and March 2026, table view with all critical fields'></textarea>
        <div class="footer">
          <div class="examples">
            <button onclick="Jira20.loadQueryExample(1)">My Q1 tickets</button>
            <button onclick="Jira20.loadQueryExample(2)">Sprint velocity</button>
            <button onclick="Jira20.loadQueryExample(3)">Team blockers</button>
            <button onclick="Jira20.loadQueryExample(4)">Bug distribution</button>
            <button onclick="Jira20.loadQueryExample(5)">Status breakdown</button>
          </div>
          <button class="submit-btn" onclick="Jira20.runQuery()">${ICONS.sparkle} Generate</button>
        </div>
      </div>

      <div id="j2-dash-output">
        ${this._lastQueryResult ? this.renderQueryResult(this._lastQueryResult) : this.renderEmptyDashboard()}
      </div>
    `;
  },

  renderEmptyDashboard() {
    return `
      <div style="background:var(--j2-bg);border:1px dashed var(--j2-border-strong);border-radius:8px;padding:48px;text-align:center">
        <div style="font-size:32px;margin-bottom:12px">${ICONS.sparkle}</div>
        <h3 style="font-size:18px;font-weight:500;margin-bottom:8px;color:var(--j2-text)">Ask anything about your work</h3>
        <p style="font-size:14px;color:var(--j2-text-2);max-width:520px;margin:0 auto;line-height:1.5">
          Type a question in plain English. The system generates JQL, picks the right visualization, and shows you the query so you can validate, refine, or correct it.
        </p>
        <div style="margin-top:24px;display:flex;justify-content:center;gap:24px;font-size:12px;color:var(--j2-text-3)">
          <div>📊 Table</div>
          <div>📈 Bar chart</div>
          <div>📉 Line chart</div>
          <div>🥧 Pie chart</div>
        </div>
      </div>

      <div class="j2-compare" style="margin-top:24px">
        <div class="label">Compare · Building a dashboard on Jira today</div>
        <div class="text">
          <strong>Step 1:</strong> Build a JQL filter (requires fluency) · <strong>Step 2:</strong> Save the filter · <strong>Step 3:</strong> Create new dashboard · <strong>Step 4:</strong> Pick from 30+ gadgets · <strong>Step 5:</strong> Configure the gadget with your filter · <strong>Step 6:</strong> Configure visualization (chart type, axes, layout)
        </div>
        <div class="text" style="margin-top:8px">
          <strong>Average time per ad-hoc question on Jira today: 12-18 minutes.</strong> Target on Jira 2.0: under 30 seconds.
        </div>
      </div>
    `;
  },

  loadQueryExample(n) {
    const examples = {
      1: 'Show me all tickets I raised for Atlas Data Platform between January and March 2026, table view with all critical fields',
      2: 'Sprint velocity for the Atlas team over the last 4 sprints',
      3: 'All blocked tickets across Atlas and Beacon with their blocker reasons',
      4: 'Bug count by project this sprint',
      5: 'Status breakdown for Sprint 16 across all projects',
    };
    document.getElementById('j2-query-input').value = examples[n];
  },

  runQuery() {
    const input = document.getElementById('j2-query-input').value.trim();
    if (!input) { toast('Type a question first', 'warning'); return; }

    const output = document.getElementById('j2-dash-output');
    output.innerHTML = `
      <div class="j2-thinking">
        <div class="dots"><span></span><span></span><span></span></div>
        <div class="text" id="j2-q-thinking">Parsing your question...</div>
      </div>
    `;

    const states = [
      'Parsing your question...',
      'Identifying entities and time ranges...',
      'Generating JQL...',
      'Selecting visualization...',
      'Running query...',
    ];
    let i = 0;
    const interval = setInterval(() => {
      const el = document.getElementById('j2-q-thinking');
      if (el && i < states.length) { el.textContent = states[i]; i++; }
    }, 260);

    setTimeout(() => {
      clearInterval(interval);
      const result = this.processQuery(input);
      this._lastQueryResult = result;
      output.innerHTML = this.renderQueryResult(result);
      // Render chart after DOM update
      setTimeout(() => this.renderActiveChart(), 50);
    }, 1500);
  },

  processQuery(input) {
    const lower = input.toLowerCase();

    // Detect intent and build the result
    if (/velocity/i.test(lower) && /sprint/i.test(lower)) {
      return {
        intent: 'sprint_velocity',
        question: input,
        jql: `project = "Atlas Data Platform"\n  AND sprint IN closedSprints()\n  AND status = Done\nGROUP BY sprint\nORDER BY sprint DESC LIMIT 4`,
        title: 'Sprint velocity — last 4 sprints',
        suggestedViz: 'line',
        availableViz: ['table', 'bar', 'line'],
        columns: ['Sprint', 'Story Points', 'Tickets Closed', 'Velocity Trend'],
        rows: [
          ['Sprint 13', 36, 18, '↗'],
          ['Sprint 14', 38, 19, '↗'],
          ['Sprint 15', 41, 20, '↗'],
          ['Sprint 16', 42, 21, '↗ +12%'],
        ],
        chartData: {
          labels: ['Sprint 13', 'Sprint 14', 'Sprint 15', 'Sprint 16'],
          datasets: [{
            label: 'Story points',
            data: [36, 38, 41, 42],
            borderColor: '#0052CC',
            backgroundColor: 'rgba(0, 82, 204, 0.1)',
            fill: true,
            tension: 0.3,
          }],
        },
        insight: 'Velocity is trending upward. Sprint 16 is the highest in the last 4 sprints — 12% above the 4-sprint average. The team is hitting their committed scope consistently.',
      };
    }

    if (/blocked|blocker/i.test(lower)) {
      return {
        intent: 'blockers',
        question: input,
        jql: `project IN ("Atlas Data Platform", "Beacon Banking Suite")\n  AND status = "Blocked"\n  AND resolution = Unresolved\nORDER BY priority DESC, updated DESC`,
        title: 'Blocked tickets across Atlas + Beacon',
        suggestedViz: 'table',
        availableViz: ['table', 'bar', 'pie'],
        columns: ['Key', 'Title', 'Owner', 'Stuck for', 'Blocker reason'],
        rows: [
          ['HELIOS-187', 'False positive rate spike in velocity rules', 'Neha Sharma', '5 days', 'Waiting on data team for sample'],
          ['ATLAS-1289', 'YAML config approval', 'Dev Patel', '2 days', 'Waiting on Parth review'],
        ],
        chartData: {
          labels: ['Waiting on data team', 'Waiting on review', 'Vendor delay', 'Internal review'],
          datasets: [{
            label: 'Blocked tickets',
            data: [1, 1, 0, 0],
            backgroundColor: ['#DE350B', '#FFAB00', '#6554C0', '#36B37E'],
          }],
        },
        insight: 'Most common blocker reason is cross-team dependencies. Both blockers have been stuck >2 days. Suggest escalation for the 5-day blocker (HELIOS-187).',
      };
    }

    if (/bug.*count|bug.*by|bug.*distribution|bug.*project/i.test(lower)) {
      return {
        intent: 'bugs_by_project',
        question: input,
        jql: `type = Bug\n  AND sprint = "Sprint 16"\nGROUP BY project\nORDER BY count DESC`,
        title: 'Bug count by project · Sprint 16',
        suggestedViz: 'bar',
        availableViz: ['table', 'bar', 'pie'],
        columns: ['Project', 'Open bugs', 'P0', 'P1', 'P2'],
        rows: [
          ['Atlas Data Platform', 2, 1, 1, 0],
          ['Helios Fraud Engine', 1, 1, 0, 0],
          ['Compass Mobile', 0, 0, 0, 0],
          ['Beacon Banking Suite', 0, 0, 0, 0],
        ],
        chartData: {
          labels: ['Atlas', 'Helios', 'Compass', 'Beacon'],
          datasets: [{
            label: 'Open bugs',
            data: [2, 1, 0, 0],
            backgroundColor: ['#0052CC', '#DE350B', '#6554C0', '#00875A'],
          }],
        },
        insight: 'Atlas has the highest open bug count this sprint (2 bugs, both high-priority). Helios has 1 P0 (HELIOS-187) blocked for 5 days requiring escalation.',
      };
    }

    if (/status.*breakdown|status.*all|status.*sprint/i.test(lower)) {
      return {
        intent: 'status_breakdown',
        question: input,
        jql: `sprint = "Sprint 16"\nGROUP BY status\nORDER BY count DESC`,
        title: 'Status breakdown · Sprint 16',
        suggestedViz: 'pie',
        availableViz: ['table', 'bar', 'pie'],
        columns: ['Status', 'Count', '% of sprint'],
        rows: [
          ['Done', 12, '46%'],
          ['In Progress', 5, '19%'],
          ['To Do', 5, '19%'],
          ['In Review', 3, '12%'],
          ['Blocked', 1, '4%'],
        ],
        chartData: {
          labels: ['Done', 'In Progress', 'To Do', 'In Review', 'Blocked'],
          datasets: [{
            data: [12, 5, 5, 3, 1],
            backgroundColor: ['#36B37E', '#0052CC', '#5E6C84', '#FFAB00', '#DE350B'],
          }],
        },
        insight: '46% of sprint work is already done with 9 days remaining — strong sprint pacing. Only 1 ticket blocked, which is below average for this team.',
      };
    }

    // Default: my tickets in date range
    return {
      intent: 'my_tickets',
      question: input,
      jql: `project = "Atlas Data Platform"\n  AND reporter = currentUser()\n  AND created >= "2026-01-01"\n  AND created <= "2026-03-31"\nORDER BY created DESC`,
      title: 'My tickets · Atlas Data Platform · Q1 2026',
      suggestedViz: 'table',
      availableViz: ['table', 'bar', 'line'],
      columns: ['Key', 'Type', 'Title', 'Status', 'Assignee', 'Created'],
      rows: getAllTickets()
        .filter(t => t.project === 'ATLAS' && t.reporter === 'parth')
        .slice(0, 8)
        .map(t => [t.key, t.type.toUpperCase(), t.title, DATA.statuses[t.status].name, getUser(t.assignee).name, t.created]),
      chartData: {
        labels: ['Jan', 'Feb', 'Mar'],
        datasets: [{
          label: 'Tickets created',
          data: [2, 3, 4],
          backgroundColor: '#0052CC',
        }],
      },
      insight: 'You created 9 tickets in Q1 2026, with creation rate increasing each month. March had the most tickets, primarily related to platform architecture work.',
    };
  },

  renderQueryResult(result) {
    this._activeVizType = result.suggestedViz;
    return `
      <div class="j2-jql-card">
        <div class="header">
          <span class="label">JQL · auto-generated · validate before saving</span>
          <div class="actions">
            <button onclick="toast('JQL editor opened')">Edit JQL</button>
            <button onclick="toast('Copied to clipboard')">Copy</button>
          </div>
        </div>
        <div class="content">${this.highlightJQL(result.jql)}</div>
      </div>

      <div style="display:grid;grid-template-columns:repeat(3, 1fr);gap:8px;margin-bottom:16px">
        <div style="background:white;border:1px solid var(--j2-border);padding:10px 12px;border-radius:6px">
          <div style="font-size:11px;color:var(--j2-text-3);font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:2px">Question</div>
          <div style="font-size:12px;color:var(--j2-text);font-style:italic">"${result.question}"</div>
        </div>
        <div style="background:white;border:1px solid var(--j2-border);padding:10px 12px;border-radius:6px">
          <div style="font-size:11px;color:var(--j2-text-3);font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:2px">Result rows</div>
          <div style="font-size:14px;color:var(--j2-text);font-weight:500">${result.rows.length}</div>
        </div>
        <div style="background:white;border:1px solid var(--j2-border);padding:10px 12px;border-radius:6px">
          <div style="font-size:11px;color:var(--j2-text-3);font-weight:600;text-transform:uppercase;letter-spacing:0.3px;margin-bottom:2px">Suggested viz</div>
          <div style="font-size:13px;color:var(--j2-blue);font-weight:500">${this.vizName(result.suggestedViz)} · AI selected</div>
        </div>
      </div>

      <div class="j2-viz-container">
        <div class="header">
          <h3>${result.title}<span class="meta">${result.rows.length} rows · ${result.intent.replace(/_/g, ' ')}</span></h3>
          <div class="j2-viz-tabs">
            ${result.availableViz.includes('table') ? `<button class="j2-viz-tab ${this._activeVizType==='table'?'active':''}" onclick="Jira20.switchViz('table')">📊 Table</button>` : ''}
            ${result.availableViz.includes('bar') ? `<button class="j2-viz-tab ${this._activeVizType==='bar'?'active':''}" onclick="Jira20.switchViz('bar')">📈 Bar</button>` : ''}
            ${result.availableViz.includes('line') ? `<button class="j2-viz-tab ${this._activeVizType==='line'?'active':''}" onclick="Jira20.switchViz('line')">📉 Line</button>` : ''}
            ${result.availableViz.includes('pie') ? `<button class="j2-viz-tab ${this._activeVizType==='pie'?'active':''}" onclick="Jira20.switchViz('pie')">🥧 Pie</button>` : ''}
          </div>
        </div>
        <div class="j2-viz-content" id="j2-viz-content">
          ${this.renderVizContent(result, this._activeVizType)}
        </div>
      </div>

      <div class="j2-insight">
        <div class="icon">${ICONS.sparkle}</div>
        <div class="body">
          <h4>AI Insight</h4>
          <p>${result.insight}</p>
        </div>
      </div>

      <div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:8px">
        <button class="j2-btn j2-btn-primary" onclick="toast('Saved as personal dashboard')">Save dashboard</button>
        <button class="j2-btn" onclick="toast('Refining query — type your refinement')">Refine query</button>
        <button class="j2-btn" onclick="toast('Exported to CSV')">Export CSV</button>
        <button class="j2-btn" onclick="toast('Shared with team')">Share</button>
        <button class="j2-btn j2-btn-subtle" onclick="Jira20._lastQueryResult=null;render()">Discard</button>
      </div>

      <div class="j2-ai-block" style="margin-top:16px">
        <div class="ai-badge">${ICONS.sparkle} PRINCIPLE</div>
        <div class="body">
          <div class="title">Ad-hoc exploration · not replacement for structured reporting</div>
          <div class="text">
            Natural language is a fast layer for exploration. For standardized reporting, compliance dashboards, and org-wide reporting, structured JQL-based dashboards remain the source of truth. This does not solve poor data hygiene — and neither does JQL today. The difference is the time and expertise required to access the data.
          </div>
        </div>
      </div>
    `;
  },

  renderVizContent(result, vizType) {
    if (vizType === 'table') {
      return `
        <table class="j2-result-table">
          <thead>
            <tr>${result.columns.map(c => `<th>${c}</th>`).join('')}</tr>
          </thead>
          <tbody>
            ${result.rows.map(row => `
              <tr onclick="${row[0] && row[0].toString().match(/^[A-Z]+-\d+$/) ? `navigateTo('ticket', { ticketKey: '${row[0]}' })` : `toast('Row clicked')`}">
                ${row.map((cell, idx) => `<td class="${idx===0 && cell.toString().match(/^[A-Z]+-\\d+$/) ? 'key-cell' : ''}">${cell}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    }
    return `<canvas id="j2-chart-canvas"></canvas>`;
  },

  switchViz(vizType) {
    if (this._activeVizType === vizType) return;
    this._activeVizType = vizType;
    document.querySelectorAll('.j2-viz-tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    const content = document.getElementById('j2-viz-content');
    content.innerHTML = this.renderVizContent(this._lastQueryResult, vizType);
    if (vizType !== 'table') {
      setTimeout(() => this.renderActiveChart(), 50);
    }
  },

  renderActiveChart() {
    if (this._activeVizType === 'table') return;
    const canvas = document.getElementById('j2-chart-canvas');
    if (!canvas || !this._lastQueryResult) return;
    if (this._chartInstances['main']) {
      this._chartInstances['main'].destroy();
    }

    const ctx = canvas.getContext('2d');
    const data = this._lastQueryResult.chartData;
    const config = {
      type: this._activeVizType,
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: this._activeVizType === 'pie' ? 'right' : 'top',
            labels: { font: { size: 12 }, color: '#172B4D' },
          },
          tooltip: {
            backgroundColor: '#172B4D',
            titleFont: { size: 13 },
            bodyFont: { size: 13 },
            padding: 10,
            cornerRadius: 4,
          },
        },
        scales: this._activeVizType === 'pie' ? {} : {
          y: {
            beginAtZero: true,
            grid: { color: '#DFE1E6' },
            ticks: { color: '#5E6C84', font: { size: 11 } },
          },
          x: {
            grid: { display: false },
            ticks: { color: '#5E6C84', font: { size: 11 } },
          },
        },
      },
    };
    this._chartInstances['main'] = new Chart(ctx, config);
  },

  vizName(viz) {
    return { table: 'Table', bar: 'Bar chart', line: 'Line chart', pie: 'Pie chart' }[viz] || viz;
  },

  highlightJQL(jql) {
    return jql
      .replace(/\b(project|sprint|status|type|priority|reporter|created|resolution|assignee)\b/g, '<span style="color:#79C0FF">$1</span>')
      .replace(/\b(AND|OR|NOT|IN|ORDER BY|GROUP BY|DESC|ASC|LIMIT)\b/g, '<span style="color:#FF7B72">$1</span>')
      .replace(/("[^"]+")/g, '<span style="color:#A5D6FF">$1</span>')
      .replace(/(currentUser\(\)|closedSprints\(\))/g, '<span style="color:#D2A8FF">$1</span>');
  },
};

window.Jira20 = Jira20;
