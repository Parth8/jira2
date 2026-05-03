// ============================================================================
// CENTRAL STATE MANAGEMENT
// ============================================================================

const STATE = {
  mode: 'today',           // 'today' or '2.0'
  view: 'home',            // home, project, board, backlog, ticket, dashboards, create
  currentProject: null,    // 'ATLAS' etc
  currentTicketKey: null,  // 'ATLAS-1245' etc
  persona: 'pm',           // pm, engineer, manager (Jira 2.0 only)
  draftTicket: null,
  currentDashboardConfig: null,
  searchQuery: '',
  filters: { status: null, assignee: null, priority: null },
  // Persistent additions during session (comments, status changes, new tickets)
  sessionEdits: {
    addedComments: {},     // ticketKey -> [comment, comment, ...]
    statusChanges: {},     // ticketKey -> newStatus
    addedTickets: [],
    readNotifications: new Set(),
  },
};

// ---- HELPERS ----

function getTicket(key) {
  // Find the ticket in DATA, or in session-added tickets
  let t = DATA.tickets.find(t => t.key === key) ||
          STATE.sessionEdits.addedTickets.find(t => t.key === key);
  if (!t) return null;

  // Apply session status changes
  if (STATE.sessionEdits.statusChanges[key]) {
    t = { ...t, status: STATE.sessionEdits.statusChanges[key] };
  }

  // Apply session comments
  const sessionComments = STATE.sessionEdits.addedComments[key] || [];
  t = { ...t, comments: [...(t.comments || []), ...sessionComments] };

  return t;
}

function getAllTickets() {
  return [
    ...DATA.tickets.map(t => {
      const updated = STATE.sessionEdits.statusChanges[t.key] ? { ...t, status: STATE.sessionEdits.statusChanges[t.key] } : t;
      const sessionComments = STATE.sessionEdits.addedComments[t.key] || [];
      return { ...updated, comments: [...(updated.comments || []), ...sessionComments] };
    }),
    ...STATE.sessionEdits.addedTickets,
  ];
}

function getTicketsByProject(projectKey) {
  return getAllTickets().filter(t => t.project === projectKey);
}

function getTicketsForUser(userId) {
  return getAllTickets().filter(t => t.assignee === userId);
}

function getTicketsByStatus(status) {
  return getAllTickets().filter(t => t.status === status);
}

function getUser(id) {
  return DATA.users[id] || { name: 'Unknown', initials: '??', avatar: '#999' };
}

function getProject(key) {
  return DATA.projects[key] || null;
}

function setMode(mode) {
  STATE.mode = mode;
  localStorage.setItem('jira-mode', mode);
  render();
}

function navigateTo(view, options = {}) {
  STATE.view = view;
  if (options.project !== undefined) STATE.currentProject = options.project;
  if (options.ticketKey !== undefined) STATE.currentTicketKey = options.ticketKey;
  if (options.persona) STATE.persona = options.persona;
  window.scrollTo(0, 0);
  render();
}

function addComment(ticketKey, text) {
  if (!STATE.sessionEdits.addedComments[ticketKey]) {
    STATE.sessionEdits.addedComments[ticketKey] = [];
  }
  STATE.sessionEdits.addedComments[ticketKey].push({
    author: STATE.currentUserId || 'parth',
    text,
    timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
    isNew: true,
  });
}

function changeStatus(ticketKey, newStatus) {
  STATE.sessionEdits.statusChanges[ticketKey] = newStatus;
}

function addTicket(ticket) {
  STATE.sessionEdits.addedTickets.push(ticket);
}

function generateTicketKey(projectKey) {
  const projectTickets = getTicketsByProject(projectKey);
  const maxNum = projectTickets.reduce((max, t) => {
    const num = parseInt(t.key.split('-')[1]);
    return num > max ? num : max;
  }, 0);
  return `${projectKey}-${maxNum + 1}`;
}

// ---- TOAST NOTIFICATIONS ----
function toast(message, type = 'info') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.className = 'toast toast-' + type;
  el.textContent = message;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('toast-show'));
  setTimeout(() => {
    el.classList.remove('toast-show');
    setTimeout(() => el.remove(), 300);
  }, 2800);
}

// ---- ICONS (inline SVG, Atlassian-style) ----
const ICONS = {
  bug:   '<svg width="14" height="14" viewBox="0 0 16 16" fill="#DE350B"><circle cx="8" cy="8" r="7"/><path d="M8 4v4M8 9.5v.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>',
  task:  '<svg width="14" height="14" viewBox="0 0 16 16" fill="#0052CC"><rect x="1" y="1" width="14" height="14" rx="2"/><path d="M5 8l2 2 4-4" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  story: '<svg width="14" height="14" viewBox="0 0 16 16" fill="#36B37E"><rect x="1" y="1" width="14" height="14" rx="2"/><path d="M5 4h6v8l-3-2-3 2z" fill="white"/></svg>',
  epic:  '<svg width="14" height="14" viewBox="0 0 16 16" fill="#6554C0"><rect x="1" y="1" width="14" height="14" rx="2"/><path d="M8 3l1.5 3 3.5.5-2.5 2.5.5 3.5-3-1.5-3 1.5.5-3.5L3 6.5l3.5-.5z" fill="white"/></svg>',
  arrow_up:    '<svg width="12" height="12" viewBox="0 0 12 12" fill="#DE350B"><path d="M6 2l4 5H8v3H4V7H2z"/></svg>',
  arrow_up_y:  '<svg width="12" height="12" viewBox="0 0 12 12" fill="#FF8B00"><path d="M6 2l4 5H8v3H4V7H2z"/></svg>',
  arrow_eq:    '<svg width="12" height="12" viewBox="0 0 12 12" fill="#FFAB00"><path d="M2 5h8v2H2z"/></svg>',
  arrow_dn:    '<svg width="12" height="12" viewBox="0 0 12 12" fill="#36B37E"><path d="M6 10L2 5h2V2h4v3h2z"/></svg>',
  search: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M11.5 11.5l3 3M10 6.5a3.5 3.5 0 11-7 0 3.5 3.5 0 017 0z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linecap="round"/></svg>',
  notif: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1a4 4 0 014 4v3l1.5 2.5h-11L4 8V5a4 4 0 014-4zM6 12a2 2 0 004 0"/></svg>',
  settings: '<svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><circle cx="8" cy="8" r="2.5"/><path d="M8 1v2M8 13v2M3 8H1M15 8h-2M3.5 3.5l1.5 1.5M11 11l1.5 1.5M3.5 12.5l1.5-1.5M11 5l1.5-1.5" stroke="currentColor" stroke-width="1.5"/></svg>',
  plus: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 3v10M3 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>',
  chevron_down: '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M3 4.5l3 3 3-3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  chevron_right: '<svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor"><path d="M4.5 3l3 3-3 3" stroke="currentColor" stroke-width="1.5" fill="none"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 1l2.2 4.5 5 .7-3.6 3.5.85 5-4.45-2.3-4.45 2.3.85-5L0.7 6.2l5-.7z"/></svg>',
  filter: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M2 2h12l-4.5 6v5l-3 1.5v-6.5z"/></svg>',
  more: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><circle cx="3" cy="8" r="1.5"/><circle cx="8" cy="8" r="1.5"/><circle cx="13" cy="8" r="1.5"/></svg>',
  link: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 10l4-4M6 5h-2a3 3 0 000 6h2M10 11h2a3 3 0 000-6h-2"/></svg>',
  attach: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M11 6l-5 5a2.5 2.5 0 01-3.5-3.5l6-6a4 4 0 015.5 5.5L8 13.5"/></svg>',
  sparkle: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 1l1.5 4 4 1.5-4 1.5L8 12l-1.5-4-4-1.5 4-1.5z"/></svg>',
  ai: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M8 2l1.4 3.6L13 7l-3.6 1.4L8 12l-1.4-3.6L3 7l3.6-1.4z"/><circle cx="13" cy="3" r="1"/><circle cx="3" cy="12" r="1"/></svg>',
  bolt: '<svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor"><path d="M9 1L3 9h4l-1 6 6-8H8z"/></svg>',
  warning: '<svg width="14" height="14" viewBox="0 0 16 16" fill="#FF8B00"><path d="M8 1l7 13H1z"/><path d="M8 6v4M8 11v.5" stroke="white" stroke-width="1.5" stroke-linecap="round"/></svg>',
};

function getPriorityIcon(priority) {
  if (priority === 'P0') return ICONS.arrow_up;
  if (priority === 'P1') return ICONS.arrow_up_y;
  if (priority === 'P2') return ICONS.arrow_eq;
  return ICONS.arrow_dn;
}

function avatar(userId, size = 24) {
  const u = getUser(userId);
  return `<div class="avatar" style="width:${size}px;height:${size}px;background:${u.avatar};font-size:${size * 0.42}px" title="${u.name}">${u.initials}</div>`;
}

function relativeTime(dateStr) {
  const date = new Date(dateStr.replace(' ', 'T'));
  const now = new Date('2026-05-03T10:00:00');
  const diffMs = now - date;
  const diffMin = Math.floor(diffMs / 60000);
  const diffHr = Math.floor(diffMs / 3600000);
  const diffDay = Math.floor(diffMs / 86400000);
  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay === 1) return 'yesterday';
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString();
}

window.STATE = STATE;
window.ICONS = ICONS;
window.getTicket = getTicket;
window.getAllTickets = getAllTickets;
window.getTicketsByProject = getTicketsByProject;
window.getTicketsForUser = getTicketsForUser;
window.getTicketsByStatus = getTicketsByStatus;
window.getUser = getUser;
window.getProject = getProject;
window.setMode = setMode;
window.navigateTo = navigateTo;
window.addComment = addComment;
window.changeStatus = changeStatus;
window.addTicket = addTicket;
window.generateTicketKey = generateTicketKey;
window.toast = toast;
window.getPriorityIcon = getPriorityIcon;
window.avatar = avatar;
window.relativeTime = relativeTime;
