"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const agents_1 = require("./agents");
const ailments_1 = require("./ailments");
const therapies_1 = require("./therapies");
const Layout_1 = require("./components/Layout");
const Main_1 = require("./components/Main");
(0, db_1.runMigrations)();
exports.app = (0, express_1.default)();
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.static(node_path_1.default.join(__dirname, '..', 'public')));
exports.app.use('/api/agents', agents_1.agentsRouter);
exports.app.use('/api/ailments', ailments_1.ailmentsRouter);
exports.app.use('/api/therapies', therapies_1.therapiesRouter);
exports.app.get('/', (_req, res) => {
    const agents = db_1.db.prepare('SELECT * FROM agents ORDER BY id').all();
    const ailments = db_1.db.prepare('SELECT * FROM ailments ORDER BY id').all();
    const therapies = db_1.db.prepare('SELECT * FROM therapies ORDER BY id').all();
    const assignments = db_1.db
        .prepare(`SELECT t.*, at.agent_id FROM therapies t
       JOIN agent_therapies at ON at.therapy_id = t.id
       ORDER BY at.agent_id, t.id`)
        .all();
    const assignedFor = (agentId) => {
        const names = assignments.filter((a) => a.agent_id === agentId).map((a) => (0, Main_1.escapeHtml)(a.name));
        return names.length ? names.join(', ') : '<em>none</em>';
    };
    const agentRows = agents
        .map((a) => `<tr>
  <td>${a.id}</td>
  <td>${(0, Main_1.escapeHtml)(a.name)}</td>
  <td>${(0, Main_1.escapeHtml)(a.species)}</td>
  <td>${assignedFor(a.id)}</td>
  <td>${a.created_at}</td>
</tr>`)
        .join('');
    const ailmentRows = ailments
        .map((a) => `<tr>
  <td>${a.id}</td>
  <td>${(0, Main_1.escapeHtml)(a.name)}</td>
  <td>${a.description ? (0, Main_1.escapeHtml)(a.description) : '<em>—</em>'}</td>
  <td>${a.created_at}</td>
</tr>`)
        .join('');
    const therapyRows = therapies
        .map((t) => `<tr>
  <td>${t.id}</td>
  <td>${(0, Main_1.escapeHtml)(t.name)}</td>
  <td>${t.description ? (0, Main_1.escapeHtml)(t.description) : '<em>—</em>'}</td>
  <td>${t.applies_to ? (0, Main_1.escapeHtml)(t.applies_to) : '<em>—</em>'}</td>
  <td>${t.created_at}</td>
</tr>`)
        .join('');
    const section = (title, headers, rows) => `<h2>${title}</h2>
<div class="table-wrap">
  <table>
    <thead><tr>${headers.map((h) => `<th>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows === '' ? `<tr><td colspan="${headers.length}">No ${title.toLowerCase()} yet</td></tr>` : rows}</tbody>
  </table>
</div>`;
    const body = `
${section('Agents', ['ID', 'Name', 'Species', 'Therapies', 'Created'], agentRows)}
${section('Ailments', ['ID', 'Name', 'Description', 'Created'], ailmentRows)}
${section('Therapies', ['ID', 'Name', 'Description', 'Applies to', 'Created'], therapyRows)}`;
    res.set('Content-Type', 'text/html').send((0, Layout_1.layout)({ title: 'Dashboard', body }));
});
