// ============================================================================
// MAIN ROUTER — controls top-level mode toggle and calls the right renderer
// ============================================================================

function render() {
  // Render the mode toggle bar (always present)
  renderModeToggle();

  // Render the active mode
  if (STATE.mode === 'today') {
    JiraToday.render(STATE.view);
  } else {
    Jira20.render(STATE.view);
  }
}

function renderModeToggle() {
  let bar = document.getElementById('mode-toggle-bar');
  if (!bar) {
    bar = document.createElement('div');
    bar.id = 'mode-toggle-bar';
    bar.className = 'mode-toggle-bar';
    document.body.insertBefore(bar, document.body.firstChild);
  }
  bar.innerHTML = `
    <div class="brand">
      <div class="brand-mark">J</div>
      <span>Jira 2.0 Case Study Prototype</span>
    </div>
    <div class="mode-toggle">
      <button class="${STATE.mode === 'today' ? 'active' : ''}" onclick="setMode('today')">Jira Today</button>
      <button class="${STATE.mode === '2.0' ? 'active' : ''}" onclick="setMode('2.0')">Jira 2.0</button>
    </div>
    <span class="description">${STATE.mode === 'today' ? 'The current friction-heavy experience' : 'AI-native reimagining'}</span>
    <span class="by">by Parth Aggarwal · for Qure.ai Senior PM case study</span>
  `;
}

// ---------- INIT ----------
function init() {
  // Load saved mode
  const savedMode = localStorage.getItem('jira-mode');
  if (savedMode === '2.0' || savedMode === 'today') {
    STATE.mode = savedMode;
  }

  // Set up app container
  let appRoot = document.getElementById('app-root');
  if (!appRoot) {
    appRoot = document.createElement('div');
    appRoot.id = 'app-root';
    appRoot.className = 'app-container';
    document.body.appendChild(appRoot);
  }

  render();
}

document.addEventListener('DOMContentLoaded', init);

// ---------- KEYBOARD SHORTCUTS ----------
document.addEventListener('keydown', (e) => {
  // Don't intercept when typing in inputs
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  if (e.key === 'c') {
    if (STATE.mode === 'today') JiraToday.openCreateModal();
  }
  if (e.key === 'g' && e.shiftKey === false) {
    // 'g' then 'h' for go home
    document.addEventListener('keydown', function next(e2) {
      if (e2.key === 'h') navigateTo('home');
      document.removeEventListener('keydown', next);
    }, { once: true });
  }
  if (e.key === '/') {
    e.preventDefault();
    const search = document.getElementById('jt-search');
    if (search) search.focus();
  }
});
