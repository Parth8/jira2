// ============================================================================
// MAIN ROUTER — controls top-level mode toggle and calls the right renderer
// ============================================================================

function render() {
  renderModeToggle();

  if (STATE.mode === 'today') {
    JiraToday.render(STATE.view);
  } else {
    Jira20.render(STATE.view);
  }

  // Apply content fade animation
  const root = document.getElementById('app-root');
  if (root && root.firstElementChild) {
    root.firstElementChild.classList.add('content-fade');
    // Remove after animation so re-renders re-trigger
    setTimeout(() => {
      if (root.firstElementChild) root.firstElementChild.classList.remove('content-fade');
    }, 280);
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
  const isOn = STATE.mode === '2.0';
  bar.innerHTML = `
    <div class="brand">
      <div class="brand-mark">J</div>
      <span class="brand-name">Jira</span>
    </div>
    <div class="mode-slider">
      <span class="label ${!isOn ? 'active' : ''}">Today</span>
      <div class="mode-slider-track ${isOn ? 'on' : ''}" onclick="toggleMode()">
        <div class="mode-slider-thumb"></div>
      </div>
      <span class="label ${isOn ? 'active' : ''}">2.0</span>
    </div>
  `;
}

function toggleMode() {
  setMode(STATE.mode === 'today' ? '2.0' : 'today');
}

// ---------- INIT ----------
function init() {
  const savedMode = localStorage.getItem('jira-mode');
  if (savedMode === '2.0' || savedMode === 'today') {
    STATE.mode = savedMode;
  }

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

// ---------- AI DRAWER TOGGLE (shared utility) ----------
function toggleAIDrawer(id) {
  const drawer = document.getElementById('ai-drawer-' + id);
  const tag = document.getElementById('ai-tag-' + id);
  if (!drawer) return;
  drawer.classList.toggle('expanded');
  if (tag) tag.classList.toggle('expanded');
}

// Close all open drawers (used when navigating away)
function closeAllDrawers() {
  document.querySelectorAll('.ai-drawer.expanded').forEach(d => d.classList.remove('expanded'));
  document.querySelectorAll('.ai-tag.expanded').forEach(t => t.classList.remove('expanded'));
}

// ---------- KEYBOARD SHORTCUTS ----------
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') return;

  if (e.key === 'c') {
    if (STATE.mode === 'today') JiraToday.openCreateModal();
    else Jira20.openCreateModal();
  }
  if (e.key === '/') {
    e.preventDefault();
    const search = document.getElementById('jt-search') || document.getElementById('j2-search');
    if (search) search.focus();
  }
  if (e.key === 'Escape') {
    document.querySelector('.modal-backdrop')?.remove();
  }
});

window.toggleMode = toggleMode;
window.toggleAIDrawer = toggleAIDrawer;
window.closeAllDrawers = closeAllDrawers;
