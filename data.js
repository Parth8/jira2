// ============================================================================
// SAMPLE DATA — shared by both Jira Today and Jira 2.0 modes
// ============================================================================

const DATA = {

  // ---- USERS ----
  users: {
    'parth':  { id: 'parth',  name: 'Parth Aggarwal', initials: 'PA', avatar: '#0052CC', role: 'Product Manager' },
    'arjun':  { id: 'arjun',  name: 'Arjun Mehta',    initials: 'AM', avatar: '#FF8B00', role: 'Senior Backend Engineer' },
    'neha':   { id: 'neha',   name: 'Neha Sharma',    initials: 'NS', avatar: '#00875A', role: 'Senior Data Engineer' },
    'dev':    { id: 'dev',    name: 'Dev Patel',      initials: 'DP', avatar: '#6554C0', role: 'Platform Engineer' },
    'priya':  { id: 'priya',  name: 'Priya Singh',    initials: 'PS', avatar: '#DE350B', role: 'Engineering Manager' },
    'karan':  { id: 'karan',  name: 'Karan Verma',    initials: 'KV', avatar: '#0747A6', role: 'QA Lead' },
    'maya':   { id: 'maya',   name: 'Maya Iyer',      initials: 'MI', avatar: '#008DA6', role: 'Designer' },
    'rohan':  { id: 'rohan',  name: 'Rohan Kapoor',   initials: 'RK', avatar: '#403294', role: 'Frontend Engineer' },
  },
  currentUserId: 'parth',

  // ---- PROJECTS ----
  projects: {
    'ATLAS':   { key: 'ATLAS',   name: 'Atlas Data Platform',   icon: '🗺️', color: '#0052CC', lead: 'parth' },
    'BEACON':  { key: 'BEACON',  name: 'Beacon Banking Suite',  icon: '🏦', color: '#00875A', lead: 'parth' },
    'HELIOS':  { key: 'HELIOS',  name: 'Helios Fraud Engine',   icon: '🛡️', color: '#DE350B', lead: 'priya' },
    'COMPASS': { key: 'COMPASS', name: 'Compass Mobile',        icon: '📱', color: '#6554C0', lead: 'priya' },
  },

  // ---- TICKET TYPES ----
  ticketTypes: {
    'bug':   { name: 'Bug',     icon: 'bug',     color: '#DE350B' },
    'task':  { name: 'Task',    icon: 'task',    color: '#0052CC' },
    'story': { name: 'Story',   icon: 'story',   color: '#36B37E' },
    'epic':  { name: 'Epic',    icon: 'epic',    color: '#6554C0' },
  },

  // ---- PRIORITIES ----
  priorities: {
    'P0': { name: 'Highest', color: '#DE350B', label: 'P0' },
    'P1': { name: 'High',    color: '#FF8B00', label: 'P1' },
    'P2': { name: 'Medium',  color: '#FFAB00', label: 'P2' },
    'P3': { name: 'Low',     color: '#36B37E', label: 'P3' },
  },

  // ---- STATUSES ----
  statuses: {
    'todo':    { name: 'To Do',       color: '#42526E', bg: '#DFE1E6' },
    'inprog':  { name: 'In Progress', color: '#0052CC', bg: '#DEEBFF' },
    'review':  { name: 'In Review',   color: '#974F0C', bg: '#FFF0B3' },
    'blocked': { name: 'Blocked',     color: '#DE350B', bg: '#FFEBE6' },
    'done':    { name: 'Done',        color: '#006644', bg: '#E3FCEF' },
  },

  // ---- TICKETS ----
  tickets: [
    // ---- ATLAS Data Platform tickets ----
    {
      key: 'ATLAS-1245', project: 'ATLAS', type: 'bug', priority: 'P0', status: 'inprog',
      title: 'Auth Tables and Clearance tables — schema mismatch blocking demo',
      description: 'During the integration test for the auth flow on staging, we observed that the auth_tokens table schema is out of sync with the clearance_records table foreign key reference. The schema migration script appears to have been partially applied. This is blocking the Friday client demo.\n\nReproduction steps:\n1. Connect to staging-db\n2. Run the auth integration test suite\n3. Observe FK constraint violation on clearance_records.token_id',
      assignee: 'arjun', reporter: 'parth', sprint: 'Sprint 16',
      created: '2026-04-30', updated: '2026-05-03',
      labels: ['platform', 'urgent', 'demo-blocker'],
      mentions: ['parth', 'arjun', 'neha'],
      comments: [
        { author: 'arjun', text: "@Parth Aggarwal — Let's connect to understand this issue. Even if it's common across tenants, if it's blocking client delivery, we need to prioritize.", timestamp: '2026-05-01 14:30' },
        { author: 'neha', text: "I checked the migration logs. Looks like step 3 of the migration (FK reconciliation) didn't run on staging. We need to roll forward, not back.", timestamp: '2026-05-02 09:15' },
        { author: 'parth', text: "@Arjun Mehta @Neha Sharma — let's sync at 11 today. I'll bring Priya in. We need a decision before EOD because the demo is Friday.", timestamp: '2026-05-02 09:42' },
        { author: 'arjun', text: 'Confirming the 11am sync. Will share the migration diff in the meeting.', timestamp: '2026-05-02 09:50' },
      ],
      worklog: [
        { author: 'arjun', hours: 2, date: '2026-05-02', desc: 'Investigation and reproduction' },
        { author: 'arjun', hours: 1.5, date: '2026-05-03', desc: 'Migration script audit' },
      ]
    },
    {
      key: 'ATLAS-1289', project: 'ATLAS', type: 'task', priority: 'P1', status: 'review',
      title: 'Approve YAML config schema for tenant onboarding',
      description: 'New YAML config schema for tenant onboarding ready for approval. Once approved, this unblocks 3 downstream tickets and enables the platformization rollout to ATLAS-1290, ATLAS-1291, ATLAS-1292.',
      assignee: 'parth', reporter: 'dev', sprint: 'Sprint 16',
      created: '2026-04-28', updated: '2026-05-01',
      labels: ['platform', 'config', 'governance'],
      mentions: ['parth', 'dev'],
      comments: [
        { author: 'dev', text: 'Schema is ready for review. Please check the additional fields for region routing.', timestamp: '2026-04-28 16:00' },
        { author: 'dev', text: '@Parth Aggarwal — gentle reminder, this is blocking 3 downstream tickets. Need approval to proceed.', timestamp: '2026-05-01 10:00' },
      ],
      worklog: [],
    },
    {
      key: 'ATLAS-1234', project: 'ATLAS', type: 'story', priority: 'P1', status: 'review',
      title: 'Review platform contract v2.1 with compliance team',
      description: 'Final review of the v2.1 platform contract document with the compliance and risk team. Contract covers data residency, retention, PII handling, and audit logging requirements.',
      assignee: 'parth', reporter: 'priya', sprint: 'Sprint 16',
      created: '2026-04-25', updated: '2026-04-29',
      labels: ['compliance', 'documentation'],
      mentions: ['parth', 'karan'],
      comments: [
        { author: 'karan', text: 'Compliance team has reviewed sections 1-4. Awaiting Parth review on sections 5-8 (audit and retention).', timestamp: '2026-04-29 11:20' },
      ],
      worklog: [],
    },
    {
      key: 'ATLAS-1198', project: 'ATLAS', type: 'task', priority: 'P2', status: 'inprog',
      title: 'Implement Redshift slot allocation flags in TPL DAG',
      description: 'Add slot allocation flags to the TPL data pipeline DAG to optimize warehouse compute usage during peak ingestion windows.',
      assignee: 'arjun', reporter: 'neha', sprint: 'Sprint 16',
      created: '2026-04-22', updated: '2026-05-02',
      labels: ['data-pipeline', 'performance'],
      mentions: ['arjun', 'neha'],
      comments: [
        { author: 'arjun', text: 'Branch up: feature/redshift-slots. CI passing. Will open PR for review tomorrow.', timestamp: '2026-05-02 17:30' },
      ],
      worklog: [
        { author: 'arjun', hours: 4, date: '2026-04-30', desc: 'Implementation' },
        { author: 'arjun', hours: 2, date: '2026-05-02', desc: 'Test coverage' },
      ],
    },
    {
      key: 'ATLAS-1156', project: 'ATLAS', type: 'bug', priority: 'P1', status: 'inprog',
      title: 'DigiFi-equivalent schema drift breaking UAT pipeline',
      description: 'Upstream vendor schema added a new field without notice, breaking our parser. Need to handle gracefully with schema versioning.',
      assignee: 'arjun', reporter: 'karan', sprint: 'Sprint 16',
      created: '2026-04-20', updated: '2026-05-01',
      labels: ['integration', 'urgent'],
      mentions: ['arjun'],
      comments: [
        { author: 'arjun', text: 'Reproduced locally. Investigating root cause in the parsing layer.', timestamp: '2026-05-01 14:00' },
      ],
      worklog: [],
    },
    {
      key: 'ATLAS-1089', project: 'ATLAS', type: 'story', priority: 'P2', status: 'todo',
      title: 'Multi-tenant config rollout planning for Q2',
      description: 'Plan the rollout of multi-tenant config across remaining client portfolios in Q2.',
      assignee: 'parth', reporter: 'parth', sprint: 'Sprint 17',
      created: '2026-04-15', updated: '2026-04-15',
      labels: ['planning', 'q2-roadmap'],
      mentions: ['parth'],
      comments: [],
      worklog: [],
    },
    {
      key: 'ATLAS-1067', project: 'ATLAS', type: 'task', priority: 'P2', status: 'done',
      title: 'MongoDB to API migration for primary integration',
      description: 'Migrated from MongoDB-based ingestion to REST API integration. Eliminated MongoDB dependency, reduced infra cost.',
      assignee: 'arjun', reporter: 'parth', sprint: 'Sprint 15',
      created: '2026-03-22', updated: '2026-04-12',
      labels: ['platform', 'infrastructure', 'cost-savings'],
      mentions: [],
      comments: [
        { author: 'arjun', text: 'Migration complete. Production cutover successful. Cost savings tracked at $50k/year annualized.', timestamp: '2026-04-12 16:00' },
      ],
      worklog: [],
    },

    // ---- BEACON Banking ----
    {
      key: 'BEACON-432', project: 'BEACON', type: 'story', priority: 'P2', status: 'review',
      title: 'Q2 roadmap input — TPL extracts',
      description: 'Provide PM-level input on Q2 roadmap items for TPL extracts. Required by program leadership for resource planning.',
      assignee: 'parth', reporter: 'priya', sprint: 'Sprint 16',
      created: '2026-04-26', updated: '2026-05-01',
      labels: ['planning', 'q2-roadmap'],
      mentions: ['parth'],
      comments: [
        { author: 'priya', text: '@Parth Aggarwal — I need your input by Friday for the leadership review on Monday.', timestamp: '2026-05-01 10:00' },
      ],
      worklog: [],
    },
    {
      key: 'BEACON-401', project: 'BEACON', type: 'task', priority: 'P1', status: 'todo',
      title: 'MoEngage extract format approval',
      description: 'Review and approve the MoEngage extract format for downstream consumption.',
      assignee: 'neha', reporter: 'parth', sprint: 'Sprint 16',
      created: '2026-04-29', updated: '2026-04-29',
      labels: ['integration', 'extract'],
      mentions: ['parth'],
      comments: [
        { author: 'neha', text: 'Format spec attached. Need approval before implementation.', timestamp: '2026-04-29 09:00' },
      ],
      worklog: [],
    },
    {
      key: 'BEACON-389', project: 'BEACON', type: 'epic', priority: 'P1', status: 'inprog',
      title: 'Banking partner integration — Q2 launch',
      description: 'End-to-end integration with new banking partner including KYC, payments, and reporting flows.',
      assignee: 'priya', reporter: 'parth', sprint: 'Sprint 16',
      created: '2026-04-01', updated: '2026-04-30',
      labels: ['epic', 'q2-launch'],
      mentions: [],
      comments: [],
      worklog: [],
    },

    // ---- HELIOS Fraud ----
    {
      key: 'HELIOS-201', project: 'HELIOS', type: 'task', priority: 'P1', status: 'inprog',
      title: 'Real-time fraud rule engine — phase 2 rules',
      description: 'Implement phase 2 fraud detection rules including velocity checks and merchant risk scoring.',
      assignee: 'neha', reporter: 'priya', sprint: 'Sprint 16',
      created: '2026-04-15', updated: '2026-05-01',
      labels: ['fraud', 'rules-engine'],
      mentions: [],
      comments: [],
      worklog: [],
    },
    {
      key: 'HELIOS-187', project: 'HELIOS', type: 'bug', priority: 'P0', status: 'blocked',
      title: 'False positive rate spike in velocity rules',
      description: 'After phase 1 rule deployment, false positive rate jumped from 2% to 11%. Need to recalibrate thresholds.',
      assignee: 'neha', reporter: 'karan', sprint: 'Sprint 16',
      created: '2026-04-28', updated: '2026-05-01',
      labels: ['fraud', 'urgent', 'production'],
      mentions: ['neha', 'priya'],
      comments: [
        { author: 'karan', text: 'Production data showing 11% FP rate. Customer complaints rising.', timestamp: '2026-04-28 16:00' },
        { author: 'neha', text: 'Blocked on data team — need historical transaction sample to recalibrate. Requested 2 days ago.', timestamp: '2026-04-30 10:00' },
      ],
      worklog: [],
    },

    // ---- COMPASS Mobile ----
    {
      key: 'COMPASS-501', project: 'COMPASS', type: 'story', priority: 'P2', status: 'inprog',
      title: 'Onboarding flow redesign — phase 1',
      description: 'Redesign the user onboarding flow based on Q1 user research findings.',
      assignee: 'rohan', reporter: 'maya', sprint: 'Sprint 16',
      created: '2026-04-10', updated: '2026-04-30',
      labels: ['mobile', 'ux'],
      mentions: [],
      comments: [],
      worklog: [],
    },
    {
      key: 'COMPASS-489', project: 'COMPASS', type: 'task', priority: 'P3', status: 'todo',
      title: 'Push notification A/B test setup',
      description: 'Set up A/B test for notification copy variants.',
      assignee: 'rohan', reporter: 'maya', sprint: 'Sprint 17',
      created: '2026-04-08', updated: '2026-04-08',
      labels: ['mobile', 'experiments'],
      mentions: [],
      comments: [],
      worklog: [],
    },
    {
      key: 'COMPASS-456', project: 'COMPASS', type: 'bug', priority: 'P2', status: 'done',
      title: 'iOS 18 navigation bar layout regression',
      description: 'Layout broke after iOS 18 update.',
      assignee: 'rohan', reporter: 'karan', sprint: 'Sprint 15',
      created: '2026-03-20', updated: '2026-04-05',
      labels: ['ios', 'regression'],
      mentions: [],
      comments: [],
      worklog: [],
    },
  ],

  // ---- SPRINTS ----
  sprints: [
    { id: 'Sprint 14', name: 'Sprint 14', start: '2026-03-04', end: '2026-03-17', status: 'closed', velocity: 38 },
    { id: 'Sprint 15', name: 'Sprint 15', start: '2026-03-18', end: '2026-03-31', status: 'closed', velocity: 41 },
    { id: 'Sprint 16', name: 'Sprint 16', start: '2026-04-15', end: '2026-04-28', status: 'active', velocity: 42 },
    { id: 'Sprint 17', name: 'Sprint 17', start: '2026-04-29', end: '2026-05-12', status: 'planning', velocity: null },
  ],

  // ---- NOTIFICATIONS ----
  notifications: [
    { id: 1, type: 'mention',  text: 'Arjun Mehta mentioned you in ATLAS-1245', time: '3 hours ago', read: false, ticketKey: 'ATLAS-1245' },
    { id: 2, type: 'assigned', text: 'Dev Patel assigned ATLAS-1289 to you',     time: '5 hours ago', read: false, ticketKey: 'ATLAS-1289' },
    { id: 3, type: 'comment',  text: 'Neha Sharma commented on ATLAS-1245',      time: '1 day ago',   read: false, ticketKey: 'ATLAS-1245' },
    { id: 4, type: 'mention',  text: 'Priya Singh mentioned you in BEACON-432',  time: '1 day ago',   read: true,  ticketKey: 'BEACON-432' },
    { id: 5, type: 'status',   text: 'ATLAS-1067 was moved to Done',             time: '3 days ago',  read: true,  ticketKey: 'ATLAS-1067' },
  ],

  // ---- ACTIVITY FEED ----
  activity: [
    { user: 'arjun', action: 'commented on', ticket: 'ATLAS-1245', time: '3 hours ago' },
    { user: 'dev',   action: 'updated',      ticket: 'ATLAS-1289', time: '5 hours ago' },
    { user: 'neha',  action: 'commented on', ticket: 'ATLAS-1245', time: '1 day ago' },
    { user: 'priya', action: 'created',      ticket: 'BEACON-432', time: '1 day ago' },
    { user: 'parth', action: 'closed',       ticket: 'ATLAS-1067', time: '3 days ago' },
    { user: 'karan', action: 'reported',     ticket: 'HELIOS-187', time: '5 days ago' },
  ],
};

// Make available globally
window.DATA = DATA;

// ============================================================================
// AI INFERENCE METADATA
// Powers the transparency drawers — every AI output has a corresponding
// inference record explaining WHY it was generated, what signals were used,
// and what the confidence was based on.
// ============================================================================

const AI_INFERENCES = {

  // ---- HOME ACTION CARD RANKINGS ----
  'home-rank-ATLAS-1245': {
    output: 'Surfaced as #1 priority in "Blocking others"',
    signals: [
      'Blocks 2 named team members (Arjun Mehta, Neha Sharma)',
      'P0 priority flag set in ticket',
      '12 comments in last 72 hours, 4 mention you directly',
      'Demo dependency: Friday client demo flagged in description',
      'Latest comment activity 3 hours ago',
    ],
    reasoning: 'Multiple convergent signals indicate this is the highest-impact unblock action available. Mention frequency (4 in 72h) is 3x the team average. Dependency chain is shortest path to demo deliverable.',
    confidence: 96,
    overrideCost: 'High — if not actioned, demo failure risk affects 2 engineers and client commitment.',
  },
  'home-rank-ATLAS-1289': {
    output: 'Surfaced as #2 priority in "Blocking others"',
    signals: [
      'Blocks 1 named team member (Dev Patel)',
      'P1 priority flag set in ticket',
      '3 downstream tickets gated on this approval',
      'Waiting state: 2 days since last activity',
    ],
    reasoning: 'Single-blocker but high-multiplier impact. Approval action has compounding effect: unblocks Dev plus 3 downstream tickets across 2 sprints.',
    confidence: 89,
    overrideCost: 'Medium — delay propagates across 3 dependent tickets but no immediate client impact.',
  },
  'home-rank-ATLAS-1234': {
    output: 'Surfaced in "Overdue · waiting on you"',
    signals: [
      'Due date passed 3 days ago (May 1)',
      'Compliance reviewer (Karan Verma) explicitly waiting',
      'Sections 5-8 not yet reviewed per latest comment',
      'No activity from you since assignment',
    ],
    reasoning: 'Past due date with named external waiter (compliance team). Risk of compliance audit delay if not actioned this week.',
    confidence: 94,
    overrideCost: 'Medium-high — compliance review is on critical path for v2.1 release.',
  },

  'home-rank-HELIOS-187': {
    output: 'Surfaced as #1 in "Needs escalation" (Manager view)',
    signals: [
      'Status: Blocked for 5 consecutive days',
      'Production impact flagged: 11% false positive rate in live system',
      'Customer complaint volume rising over the same window',
      'Cross-team dependency: blocked on data team for sample data',
      'Sample data request unfulfilled for 2 days past SLA',
    ],
    reasoning: 'Triple-trigger escalation pattern: (1) production impact ongoing, (2) customer-facing degradation, (3) blocker on cross-team dependency past SLA. Each individually would not auto-escalate; the combination strongly indicates escalation needed.',
    confidence: 95,
    overrideCost: 'High — every day of delay compounds customer complaint volume and team morale.',
  },

  // ---- TICKET CREATION FIELD INFERENCES ----
  // (these are dynamically generated based on input but stored as templates)
  'create-project': {
    label: 'Project inference',
    template: 'Inferred from text mention of project name in input. Cross-checked against your active project memberships and recent ticket history.',
  },
  'create-assignee': {
    label: 'Assignee inference',
    template: 'Named entity extracted from input. Cross-referenced against project team roster and historical assignment patterns for similar ticket types.',
  },
  'create-priority': {
    label: 'Priority inference',
    template: 'Urgency keywords detected in input. Cross-checked against ticket type, stated dependencies, and time-bound mentions.',
  },
  'create-due-date': {
    label: 'Due date inference',
    template: 'Time expression parsed from input. Resolved relative to current date and project sprint cadence.',
  },

  // ---- DASHBOARD QUERY INFERENCES ----
  'dash-query-velocity': {
    output: 'Generated query: sprint velocity over last 4 sprints',
    signals: [
      'Detected entity "velocity" in question',
      'Detected time scope "last 4 sprints"',
      'No project specified → defaulted to your primary project (Atlas Data Platform)',
      'Closed sprints retrieved via closedSprints() function',
      'Aggregation: sum of story points per sprint',
    ],
    reasoning: 'Question matches sprint-velocity template (4-sprint comparison is standard for trend visibility). Line chart selected because data is time-series with continuous progression.',
    confidence: 94,
    overrideCost: 'Low — user can refine query in 1 click. JQL is shown for validation.',
  },
  'dash-viz-line': {
    output: 'Selected line chart visualization',
    signals: [
      'Data shape: 4 data points across continuous time axis',
      'Question intent: trend over time',
      'Standard pattern: velocity over sprints → line chart',
    ],
    reasoning: 'Line charts best convey directional change for ordered time-series data with ≤10 points. Bar chart would also work but de-emphasizes the trend signal.',
    confidence: 91,
  },
  'dash-insight-velocity': {
    output: 'Insight: "Velocity is trending upward..."',
    signals: [
      'Computed slope across 4 data points: +2 points/sprint',
      'Latest sprint (42pt) is the maximum in the window',
      '4-sprint average: 39.25 points',
      'Sprint 16 is +6.9% above average → rounded to 12% in narrative for impact',
    ],
    reasoning: 'Insight summarizes the most decision-relevant finding (positive trend, current peak). Avoids over-claiming significance — flags trend direction without statistical confidence claims.',
    confidence: 88,
  },
  'dash-query-blockers': {
    output: 'Generated query: blocked tickets across Atlas + Beacon',
    signals: [
      'Detected status "blocked" in question',
      'Detected projects: Atlas + Beacon mentioned implicitly via "across"',
      'Default scope: all unresolved blockers regardless of priority',
      'Sort: priority DESC, then updated DESC (most stale first)',
    ],
    reasoning: 'Two-project blocker view is high-value PM signal. Table chosen because each blocker has unique context worth surfacing (owner, duration, reason).',
    confidence: 92,
  },
  'dash-query-bugs': {
    output: 'Generated query: bug count by project for Sprint 16',
    signals: [
      'Detected entity "bug" + "by project"',
      'Detected sprint scope "this sprint" → resolved to Sprint 16 (active)',
      'Aggregation: count grouped by project',
      'Includes priority breakdown (P0/P1/P2) for actionable detail',
    ],
    reasoning: 'Categorical comparison across discrete projects → bar chart selected. Priority breakdown column added because count alone hides severity distribution.',
    confidence: 95,
  },
  'dash-query-status': {
    output: 'Generated query: status breakdown for Sprint 16',
    signals: [
      'Detected entity "status breakdown"',
      'Detected sprint scope "Sprint 16"',
      'Aggregation: count grouped by status',
      'Pie chart selected for proportion visibility',
    ],
    reasoning: 'Composition question (parts of a whole) → pie chart. Insight focuses on velocity health (% complete vs % remaining time).',
    confidence: 93,
  },

  // ---- AI REPLY SUGGESTIONS ----
  'reply-suggestion': {
    output: 'Suggested reply to mention',
    signals: [
      'Comment thread context: 4 prior messages',
      'Original mention requested response on schema mismatch',
      'Your historical reply patterns: acknowledge + commit to action + timeline',
      'Standard professional tone matching your past replies',
    ],
    reasoning: 'Generated reply matches your typical response template. Suggests action commitment with EOD timeline based on demo urgency. User must review and edit before sending.',
    confidence: 78,
    overrideCost: 'Low — draft is editable inline before send. Wrong reply costs 1 click to discard.',
  },

  // ---- SIMILAR TICKETS ----
  'similar-tickets': {
    output: 'Detected similar tickets in this project',
    signals: [
      'Same project (Atlas Data Platform)',
      'Same ticket type (Bug)',
      'Title token overlap (auth, schema, tables)',
      'Component overlap (data platform, schema)',
    ],
    reasoning: 'Similarity scored using a combination of metadata match (project, type) and text token overlap on title and description. Threshold: 60% similarity.',
    confidence: 84,
  },

  // ---- ENGINEERING CAPACITY (manager view) ----
  'capacity-rohan': {
    output: 'Rohan flagged at 105% capacity',
    signals: [
      'Sprint commitment: 16 story points',
      'Current load: 17 story points (3 over capacity)',
      'Default capacity: 16 pts based on historical velocity',
      '3 of his tickets are unrelated to mobile work (his speciality)',
    ],
    reasoning: 'Capacity is calculated as (assigned story points / individual sprint capacity). Sustained over-capacity correlates with sprint slip risk in past data.',
    confidence: 91,
  },
  'capacity-dev': {
    output: 'Dev flagged at 65% capacity',
    signals: [
      'Sprint commitment: 8 story points',
      'Current load: 8 story points',
      'Default capacity: 12 pts based on historical velocity',
      '4 unallocated capacity points available',
    ],
    reasoning: 'Below-capacity flag triggered when utilization < 75% mid-sprint. Suggests reassignment opportunity to balance team load.',
    confidence: 86,
  },

  // ---- PATTERN DETECTION (manager view) ----
  'pattern-reassignment': {
    output: 'Pattern detected: reassignment opportunity',
    signals: [
      'Rohan over capacity (+5%) while Dev is under (-35%)',
      '3 of Rohan tickets are non-mobile (could move to Dev)',
      'Dev has 4 free capacity points',
      'No skill-mismatch flags on the 3 candidate tickets',
    ],
    reasoning: 'Cross-team load balancing suggestion. Triggered when one engineer is over-capacity while another is under, AND candidate tickets have no skill restrictions blocking transfer.',
    confidence: 87,
    overrideCost: 'Low — suggestion only. Reassignment requires explicit manager confirmation.',
  },

  // ---- NOTIFICATION GROUPING ----
  'notif-grouping': {
    output: 'Grouped 3 notifications as related to ATLAS-1245',
    signals: [
      'Same ticket key referenced in all 3 notifications',
      'All within 72-hour window',
      'Same conversation thread',
    ],
    reasoning: 'Reduces notification noise by grouping context-related events. Ungrouping is one click away.',
    confidence: 99,
  },
};

window.AI_INFERENCES = AI_INFERENCES;
