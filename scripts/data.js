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
