// ============================================================================
// JIRA TODAY — the friction-heavy current state
// ============================================================================

const JiraToday = {

  render(view) {
    const root = document.getElementById('app-root');
    root.innerHTML = `
      <div class="jt">
        ${this.renderTopnav()}
        <div class="jt-layout">
          ${this.renderSidebar()}
          <main class="jt-content">
            ${this.renderView(view)}
          </main>
        </div>
        <div class="jt-footer">
          Jira · Sample data shown for demonstration
        </div>
      </div>
    `;
    this.attachHandlers();
  },

  // ---------- TOP NAV ----------
  renderTopnav() {
    const unreadCount = DATA.notifications.filter(n => !n.read && !STATE.sessionEdits.readNotifications.has(n.id)).length;
    return `
      <header class="jt-topnav">
        <div class="logo" onclick="navigateTo('home')" style="cursor:pointer">
          <div class="logo-mark">J</div>
          <span>Jira</span>
        </div>
        <nav class="nav-items">
          <button class="nav-item">Your work ${ICONS.chevron_down}</button>
          <button class="nav-item">Projects ${ICONS.chevron_down}</button>
          <button class="nav-item">Filters ${ICONS.chevron_down}</button>
          <button class="nav-item">Dashboards ${ICONS.chevron_down}</button>
          <button class="nav-item">Teams ${ICONS.chevron_down}</button>
          <button class="nav-item">Apps ${ICONS.chevron_down}</button>
        </nav>
        <div class="search-box">
          ${ICONS.search}
          <input type="text" id="jt-search" placeholder="Search" />
        </div>
        <button class="create-btn" onclick="JiraToday.openCreateModal()">${ICONS.plus} Create</button>
        <button class="icon-btn" onclick="JiraToday.toggleNotif(event)">
          ${ICONS.notif}
          ${unreadCount > 0 ? `<span class="badge">${unreadCount}</span>` : ''}
        </button>
        <button class="icon-btn">${ICONS.settings}</button>
        <button class="icon-btn" style="margin-left:8px;width:auto;padding:0 4px">${avatar('parth', 28)}</button>
      </header>
    `;
  },

  // ---------- SIDEBAR ----------
  renderSidebar() {
    const projectKey = STATE.currentProject;
    return `
      <aside class="jt-sidebar">
        <div class="section">
          <div class="section-title">For you</div>
          <div class="nav-link ${STATE.view === 'home' ? 'active' : ''}" onclick="navigateTo('home')">
            🏠 <span>Home</span>
          </div>
          <div class="nav-link" onclick="toast('Opening Recent...')">
            🕐 <span>Recent</span>
          </div>
          <div class="nav-link" onclick="toast('Opening Starred...')">
            ⭐ <span>Starred</span>
          </div>
          <div class="nav-link ${STATE.view === 'dashboards' ? 'active' : ''}" onclick="navigateTo('dashboards')">
            📊 <span>Dashboards</span>
          </div>
        </div>
        <div class="section">
          <div class="section-title">
            <span>Projects</span>
            <button style="background:none;border:none;cursor:pointer;color:var(--jt-text-3)">${ICONS.plus}</button>
          </div>
          ${Object.values(DATA.projects).map(p => `
            <div class="nav-link ${projectKey === p.key ? 'active' : ''}" onclick="navigateTo('project', { project: '${p.key}' })">
              <div class="project-icon" style="background:${p.color}20;color:${p.color}">${p.icon}</div>
              <span>${p.name}</span>
            </div>
          `).join('')}
          <div class="nav-link" onclick="toast('Browse all projects...')" style="color:var(--jt-text-3);font-size:13px">
            View all projects
          </div>
        </div>
        <div class="section">
          <div class="section-title">Apps</div>
          <div class="nav-link" onclick="toast('Opening Confluence...')">
            📚 <span>Confluence</span>
          </div>
          <div class="nav-link" onclick="toast('Opening Bitbucket...')">
            🔧 <span>Bitbucket</span>
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

  // ---------- HOME (the noise-heavy default) ----------
  renderHome() {
    const user = getUser('parth');
    return `
      <div class="jt-page-header">
        <h1 class="jt-page-title">${this.greeting()}, ${user.name.split(' ')[0]}</h1>
      </div>

      <div class="jt-banner">
        <div class="icon">⚡</div>
        <div class="content">
          <h3>Try Jira Service Management</h3>
          <p>Connect support teams with development teams to get the full picture, from request to resolution.</p>
        </div>
        <div class="actions">
          <button onclick="toast('Opening Service Management...')" class="primary">Try it now</button>
          <button onclick="toast('Learn more...')">Learn more</button>
        </div>
      </div>

      <h2 style="font-size:16px;font-weight:600;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between">
        <span>Recommended spaces</span>
        <a href="javascript:toast('Opening all spaces...')" style="font-size:13px;font-weight:400">View all spaces</a>
      </h2>
      <div class="jt-recommended-spaces">
        ${[
          { name: 'Engineering Wiki', type: 'Confluence space', icon: '📘', color: '#0052CC' },
          { name: 'Design Library', type: 'Confluence space', icon: '🎨', color: '#FF8B00' },
          { name: 'Onboarding Hub', type: 'Confluence space', icon: '🚀', color: '#00875A' },
        ].map(s => `
          <div class="jt-space-card" onclick="toast('Opening ${s.name}...')">
            <div class="icon" style="background:${s.color}20;color:${s.color}">${s.icon}</div>
            <div class="info">
              <div class="name">${s.name}</div>
              <div class="type">${s.type}</div>
            </div>
          </div>
        `).join('')}
      </div>

      <div style="margin-bottom:16px">
        <h2 style="font-size:16px;font-weight:600;margin-bottom:12px">For you</h2>
        <div class="jt-tabs">
          <button class="jt-tab active">Recommended</button>
          <button class="jt-tab" onclick="navigateTo('home')">Assigned to me <span class="count">${getTicketsForUser('parth').filter(t => t.status !== 'done').length}</span></button>
          <button class="jt-tab" onclick="toast('Switching tab...')">Starred</button>
          <button class="jt-tab" onclick="toast('Switching tab...')">Worked on</button>
          <button class="jt-tab" onclick="toast('Switching tab...')">Viewed</button>
        </div>
      </div>

      ${this.renderMentionCard()}

      <div class="jt-card">
        <div class="jt-card-title">👥 Join a team</div>
        <p style="font-size:13px;color:var(--jt-text-2);margin-bottom:12px">People you work with are part of these teams. Join their team to stay connected and collaborate on work.</p>
        <div style="display:flex;flex-direction:column;gap:8px">
          <div class="clickable" style="padding:8px 12px;border-radius:3px;display:flex;align-items:center;gap:12px" onclick="toast('Joining team...')">
            <div style="width:32px;height:32px;background:#0052CC20;color:#0052CC;border-radius:4px;display:flex;align-items:center;justify-content:center">👥</div>
            <div>
              <div style="font-weight:500;font-size:14px">Atlas-CP</div>
              <div style="font-size:12px;color:var(--jt-text-3)">Arjun Mehta, Dev Patel, and 9 others</div>
            </div>
          </div>
          <div class="clickable" style="padding:8px 12px;border-radius:3px;display:flex;align-items:center;gap:12px" onclick="toast('Joining team...')">
            <div style="width:32px;height:32px;background:#6554C020;color:#6554C0;border-radius:4px;display:flex;align-items:center;justify-content:center">👥</div>
            <div>
              <div style="font-weight:500;font-size:14px">Beacon BI</div>
              <div style="font-size:12px;color:var(--jt-text-3)">Neha Sharma, Karan Verma, and 3 others</div>
            </div>
          </div>
        </div>
      </div>

      <div style="text-align:center;padding:16px;font-size:13px;color:var(--jt-text-3)">
        Were these recommendations useful?
        <button class="jt-btn jt-btn-subtle" style="margin-left:8px" onclick="toast('Thanks for the feedback')">💬 Give us feedback</button>
      </div>
    `;
  },

  renderMentionCard() {
    return `
      <div class="jt-mention-card">
        <div class="header">
          ${avatar('arjun', 32)}
          <div>
            <div style="font-weight:500;font-size:14px">Reply to mentions</div>
            <div style="font-size:12px;color:var(--jt-text-3)">You were mentioned in a comment. See if you need to reply or action something.</div>
          </div>
        </div>
        <div class="ticket-link">
          <strong>Arjun Mehta</strong> mentioned you on
          <a href="javascript:navigateTo('ticket', { ticketKey: 'ATLAS-1245' })">🐛 Auth Tables and Clearance tables — schema mismatch blocking demo</a>
          <span style="color:var(--jt-text-3)"> · ATLAS · ATLAS-1245 · 3 days ago</span>
        </div>
        <div class="body">
          <span class="mention-tag">@Parth Aggarwal</span>
          — Let's connect to understand this issue. Even if it's common across tenants, if it's blocking client delivery, we need to prioritize.
          <a href="javascript:navigateTo('ticket', { ticketKey: 'ATLAS-1245' })" style="display:block;margin-top:8px;font-size:13px">View 12 more comments</a>
        </div>
        <div class="reactions">
          <button onclick="toast('🔥 reacted')">🔥</button>
          <button onclick="toast('❤️ reacted')">❤️</button>
          <button onclick="toast('👏 reacted')">👏</button>
          <button onclick="toast('👍 reacted')">👍</button>
          <button onclick="toast('Add reaction')">😊</button>
        </div>
        <div class="suggest-reply" onclick="toast('AI suggesting reply...')">
          ${avatar('parth', 24)}
          <span>Leave a reply</span>
          <button class="jt-btn jt-btn-subtle" style="margin-left:auto;padding:4px 8px">${ICONS.sparkle} Suggest a reply</button>
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
      <div class="jt-page-header">
        <div class="jt-breadcrumb">
          <a href="javascript:navigateTo('home')">Projects</a>
          ${ICONS.chevron_right}
          <span>${project.name}</span>
        </div>
        <h1 class="jt-page-title">
          <span style="color:${project.color};margin-right:8px">${project.icon}</span>
          ${project.name}
        </h1>
        <div class="jt-page-actions">
          <button class="jt-btn">${ICONS.filter} Filters</button>
          <button class="jt-btn">Group by ${ICONS.chevron_down}</button>
          <button class="jt-btn">Insights</button>
          <button class="jt-btn jt-btn-subtle" style="margin-left:auto">Sprint 16 ${ICONS.chevron_down}</button>
          <button class="jt-btn">Complete sprint</button>
        </div>
      </div>

      <div class="jt-board">
        ${[
          ['todo', 'To Do'],
          ['inprog', 'In Progress'],
          ['review', 'In Review'],
          ['blocked', 'Blocked'],
          ['done', 'Done'],
        ].map(([key, label]) => `
          <div class="jt-column">
            <div class="jt-column-header">
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
    const assignee = getUser(ticket.assignee);
    return `
      <div class="jt-card-ticket" onclick="navigateTo('ticket', { ticketKey: '${ticket.key}' })">
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

    return `
      <div class="jt-page-header">
        <div class="jt-breadcrumb">
          <a href="javascript:navigateTo('home')">Projects</a>
          ${ICONS.chevron_right}
          <a href="javascript:navigateTo('project', { project: '${ticket.project}' })">${project.name}</a>
          ${ICONS.chevron_right}
          <span>${ticket.key}</span>
        </div>
      </div>

      <div class="jt-ticket-detail">
        <div class="main">
          <div class="key-row">
            ${ICONS[ticket.type]}
            <a href="javascript:navigateTo('project', { project: '${ticket.project}' })">${ticket.key}</a>
          </div>
          <h1>${ticket.title}</h1>

          <div class="actions-row">
            <button class="jt-btn jt-btn-primary" onclick="JiraToday.changeStatus('${ticket.key}')">
              <span class="jt-status-pill" style="background:${status.bg};color:${status.color}">${status.name}</span>
              ${ICONS.chevron_down}
            </button>
            <button class="jt-btn">${ICONS.attach} Attach</button>
            <button class="jt-btn">${ICONS.link} Link</button>
            <button class="jt-btn">+ Add</button>
            <button class="jt-btn jt-btn-subtle" style="margin-left:auto">${ICONS.more}</button>
          </div>

          <div class="section-heading">Description</div>
          <div class="description">${ticket.description}</div>

          <div class="section-heading">Activity · Comments (${ticket.comments.length})</div>
          <div class="jt-comments-list">
            ${ticket.comments.map(c => {
              const u = getUser(c.author);
              return `
                <div class="jt-comment">
                  ${avatar(c.author, 32)}
                  <div class="body">
                    <div class="header">
                      <span class="name">${u.name}</span>
                      <span class="time">${relativeTime(c.timestamp)}</span>
                    </div>
                    <div class="text">${this.formatCommentText(c.text)}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <div class="jt-comment-input">
            <div style="display:flex;gap:12px">
              ${avatar('parth', 32)}
              <div style="flex:1">
                <textarea id="jt-comment-text" placeholder="Add a comment..."></textarea>
                <div class="actions">
                  <button class="jt-btn jt-btn-primary" onclick="JiraToday.addComment('${ticket.key}')">Save</button>
                  <button class="jt-btn jt-btn-subtle" onclick="document.getElementById('jt-comment-text').value=''">Cancel</button>
                  <span style="margin-left:auto;font-size:12px;color:var(--jt-text-3)">Pro tip: press M to comment</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <aside class="jt-ticket-sidebar">
          <div class="field-group">
            <div class="field-label">Status</div>
            <div class="field-value">
              <span class="jt-status-pill" style="background:${status.bg};color:${status.color}">${status.name}</span>
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
              ${ticket.labels.map(l => `<span style="display:inline-block;background:var(--jt-bg);padding:2px 8px;border-radius:3px;font-size:12px;margin-right:4px;margin-bottom:4px">${l}</span>`).join('') || '—'}
            </div>
          </div>
          <div class="field-group">
            <div class="field-label">Created</div>
            <div class="field-value" style="font-size:13px;color:var(--jt-text-2)">${ticket.created}</div>
          </div>
          <div class="field-group">
            <div class="field-label">Updated</div>
            <div class="field-value" style="font-size:13px;color:var(--jt-text-2)">${ticket.updated}</div>
          </div>
        </aside>
      </div>
    `;
  },

  formatCommentText(text) {
    return text.replace(/@(\w+\s\w+)/g, '<span style="background:var(--jt-blue-bg);color:var(--jt-blue-dark);padding:1px 5px;border-radius:3px;font-weight:500">@$1</span>');
  },

  // ---------- DASHBOARDS (the painful flow) ----------
  renderDashboards() {
    return `
      <div class="jt-page-header">
        <div class="jt-breadcrumb">
          <span>Dashboards</span>
        </div>
        <h1 class="jt-page-title">Dashboards</h1>
        <div class="jt-page-actions">
          <button class="jt-btn jt-btn-primary" onclick="JiraToday.openDashboardWizard()">Create dashboard</button>
          <button class="jt-btn">Manage filters</button>
        </div>
      </div>

      <div class="jt-jql-builder">
        <h3>Build a dashboard — the current way</h3>
        <p style="color:var(--jt-text-2);font-size:13px;margin-bottom:16px">To create a dashboard with the data you want, follow these steps:</p>

        <div class="step">
          <div class="step-num">1</div>
          <div style="flex:1">
            <div style="font-weight:500;margin-bottom:4px">Build a JQL filter</div>
            <div style="font-size:13px;color:var(--jt-text-3)">Navigate to Filters → Advanced filter, write JQL syntax, save the filter.</div>
          </div>
          <button class="jt-btn" onclick="JiraToday.simulateStep(1)">Open filter builder</button>
        </div>

        <div class="step">
          <div class="step-num">2</div>
          <div style="flex:1">
            <div style="font-weight:500;margin-bottom:4px">Create the dashboard</div>
            <div style="font-size:13px;color:var(--jt-text-3)">Go to Dashboards → Create new dashboard. Pick layout (1 column, 2 columns, 3 columns).</div>
          </div>
          <button class="jt-btn" onclick="JiraToday.simulateStep(2)">Open dashboard creator</button>
        </div>

        <div class="step">
          <div class="step-num">3</div>
          <div style="flex:1">
            <div style="font-weight:500;margin-bottom:4px">Add a gadget</div>
            <div style="font-size:13px;color:var(--jt-text-3)">From 30+ gadget options, choose one (e.g., "Filter Results"). Configure it with your saved filter.</div>
          </div>
          <button class="jt-btn" onclick="JiraToday.simulateStep(3)">Browse gadgets</button>
        </div>

        <div class="step">
          <div class="step-num">4</div>
          <div style="flex:1">
            <div style="font-weight:500;margin-bottom:4px">Configure visualization</div>
            <div style="font-size:13px;color:var(--jt-text-3)">For charts: choose chart type, configure axis, save layout.</div>
          </div>
          <button class="jt-btn" onclick="JiraToday.simulateStep(4)">Configure</button>
        </div>

        <div style="margin-top:24px;padding:12px;background:var(--jt-bg);border-radius:3px;border-left:3px solid var(--jt-yellow);font-size:13px;color:var(--jt-text-2)">
          ⏱️ <strong>Average time for an analyst to answer one ad-hoc question:</strong> 12-18 minutes (filter creation, dashboard creation, gadget configuration, layout)
        </div>
      </div>

      <div style="margin-top:32px">
        <h3 style="font-size:14px;font-weight:600;margin-bottom:12px">Your existing dashboards</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
          <div class="jt-card clickable" onclick="toast('Opening Sprint Health dashboard...')" style="margin:0">
            <div style="font-weight:500;margin-bottom:8px">Sprint 16 Health</div>
            <div style="font-size:12px;color:var(--jt-text-3)">2 gadgets · last viewed 2d ago</div>
          </div>
          <div class="jt-card clickable" onclick="toast('Opening Bug Triage dashboard...')" style="margin:0">
            <div style="font-weight:500;margin-bottom:8px">Bug Triage Q1</div>
            <div style="font-size:12px;color:var(--jt-text-3)">4 gadgets · last viewed 1w ago</div>
          </div>
          <div class="jt-card clickable" onclick="toast('Opening Team Velocity dashboard...')" style="margin:0">
            <div style="font-weight:500;margin-bottom:8px">Team Velocity</div>
            <div style="font-size:12px;color:var(--jt-text-3)">3 gadgets · last viewed 3w ago</div>
          </div>
        </div>
      </div>
    `;
  },

  // ---------- CREATE MODAL (the painful one) ----------
  openCreateModal() {
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop';
    backdrop.onclick = (e) => { if (e.target === backdrop) backdrop.remove(); };
    backdrop.innerHTML = `
      <div class="modal" onclick="event.stopPropagation()">
        <div class="jt-create-form">
          <div class="form-header">
            <h2>Create issue</h2>
          </div>
          <div class="form-body">
            <div class="jt-form-field">
              <label>Project <span class="required">*</span></label>
              <select id="cf-project">
                <option value="">-- Select a project --</option>
                ${Object.values(DATA.projects).map(p => `<option value="${p.key}">${p.name}</option>`).join('')}
              </select>
            </div>
            <div class="jt-form-field">
              <label>Issue type <span class="required">*</span></label>
              <select id="cf-type">
                <option value="">-- Select issue type --</option>
                <option value="task">Task</option>
                <option value="bug">Bug</option>
                <option value="story">Story</option>
                <option value="epic">Epic</option>
              </select>
            </div>
            <div class="jt-form-field">
              <label>Summary <span class="required">*</span></label>
              <input type="text" id="cf-summary" placeholder="Enter a summary" />
            </div>
            <div class="jt-form-field">
              <label>Description</label>
              <textarea id="cf-description" rows="4" placeholder="Describe the issue..."></textarea>
            </div>
            <div class="jt-form-field">
              <label>Assignee</label>
              <select id="cf-assignee">
                <option value="">Unassigned</option>
                ${Object.values(DATA.users).map(u => `<option value="${u.id}">${u.name}</option>`).join('')}
              </select>
            </div>
            <div class="jt-form-field">
              <label>Priority</label>
              <select id="cf-priority">
                <option value="P2">Medium</option>
                <option value="P0">Highest</option>
                <option value="P1">High</option>
                <option value="P3">Low</option>
              </select>
            </div>
            <div class="jt-form-field">
              <label>Labels</label>
              <input type="text" id="cf-labels" placeholder="Add labels (comma-separated)" />
            </div>
            <div class="jt-form-field">
              <label>Sprint</label>
              <select id="cf-sprint">
                <option value="">None</option>
                <option value="Sprint 16">Sprint 16 (active)</option>
                <option value="Sprint 17">Sprint 17 (planning)</option>
              </select>
            </div>
            <div class="jt-form-field">
              <label>Due date</label>
              <input type="text" id="cf-due" placeholder="YYYY-MM-DD" />
            </div>
            <div class="jt-form-field">
              <label>Story points</label>
              <input type="text" id="cf-points" placeholder="e.g., 3" />
            </div>
            <div class="jt-form-field">
              <label>Components</label>
              <input type="text" id="cf-components" placeholder="Add components" />
            </div>
            <div class="jt-form-field">
              <label>Linked issues</label>
              <input type="text" id="cf-linked" placeholder="Search for issues" />
            </div>
          </div>
          <div class="form-footer">
            <label style="display:flex;align-items:center;gap:6px;font-size:13px;color:var(--jt-text-2);margin-right:auto">
              <input type="checkbox" /> Create another
            </label>
            <button class="jt-btn" onclick="this.closest('.modal-backdrop').remove()">Cancel</button>
            <button class="jt-btn jt-btn-primary" onclick="JiraToday.submitCreate(this)">Create</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(backdrop);
  },

  submitCreate(btn) {
    const project = document.getElementById('cf-project').value;
    const type = document.getElementById('cf-type').value;
    const summary = document.getElementById('cf-summary').value;
    if (!project || !type || !summary) {
      toast('Project, issue type, and summary are required', 'warning');
      return;
    }
    const newKey = generateTicketKey(project);
    const ticket = {
      key: newKey,
      project,
      type,
      priority: document.getElementById('cf-priority').value || 'P2',
      status: 'todo',
      title: summary,
      description: document.getElementById('cf-description').value,
      assignee: document.getElementById('cf-assignee').value || null,
      reporter: 'parth',
      sprint: document.getElementById('cf-sprint').value || null,
      created: '2026-05-03',
      updated: '2026-05-03',
      labels: document.getElementById('cf-labels').value.split(',').map(s => s.trim()).filter(Boolean),
      mentions: [],
      comments: [],
      worklog: [],
    };
    addTicket(ticket);
    btn.closest('.modal-backdrop').remove();
    toast('✓ Created ' + newKey, 'success');
    setTimeout(() => navigateTo('ticket', { ticketKey: newKey }), 400);
  },

  // ---------- COMMENT ----------
  addComment(ticketKey) {
    const text = document.getElementById('jt-comment-text').value.trim();
    if (!text) { toast('Type a comment first', 'warning'); return; }
    addComment(ticketKey, text);
    toast('Comment added', 'success');
    render();
  },

  // ---------- STATUS CHANGE ----------
  changeStatus(ticketKey) {
    const ticket = getTicket(ticketKey);
    const next = {
      todo: 'inprog',
      inprog: 'review',
      review: 'done',
      blocked: 'inprog',
      done: 'todo',
    }[ticket.status];
    changeStatus(ticketKey, next);
    toast(`Status → ${DATA.statuses[next].name}`, 'success');
    render();
  },

  // ---------- DASHBOARD WIZARD ----------
  openDashboardWizard() {
    toast('Opening dashboard creation wizard... step 1 of 4');
  },

  simulateStep(num) {
    const messages = {
      1: 'Filter builder opened. Now write JQL like: project = ATLAS AND created >= "2026-01-01"...',
      2: 'Now navigate to Dashboards menu and click Create...',
      3: 'Pick from 30+ gadgets... most users pick "Filter Results" or "Pie Chart"...',
      4: 'Configure visualization... pick chart type, set axes, save layout...',
    };
    toast(messages[num]);
  },

  // ---------- NOTIFICATION DROPDOWN ----------
  toggleNotif(e) {
    e.stopPropagation();
    const existing = document.querySelector('.jt-notif-dropdown');
    if (existing) { existing.remove(); return; }

    const btn = e.currentTarget;
    const dd = document.createElement('div');
    dd.className = 'jt-notif-dropdown';
    dd.innerHTML = `
      <div style="padding:12px 16px;border-bottom:1px solid var(--jt-border);font-weight:600">
        Notifications
      </div>
      ${DATA.notifications.map(n => `
        <div class="jt-notif-item ${!n.read && !STATE.sessionEdits.readNotifications.has(n.id) ? 'unread' : ''}" onclick="JiraToday.openNotifTicket(${n.id}, '${n.ticketKey}')">
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
    document.querySelector('.jt-notif-dropdown')?.remove();
    navigateTo('ticket', { ticketKey: key });
  },

  // ---------- ATTACH HANDLERS ----------
  attachHandlers() {
    const search = document.getElementById('jt-search');
    if (search) {
      search.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const q = search.value.trim();
          if (q) toast(`Searching for "${q}"... (results would appear in a search modal)`);
        }
      });
    }
  },
};

window.JiraToday = JiraToday;
