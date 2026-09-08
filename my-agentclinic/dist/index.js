"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
const agents_1 = require("./agents");
const Layout_1 = require("./components/Layout");
const Main_1 = require("./components/Main");
(0, db_1.runMigrations)();
const app = (0, express_1.default)();
const PORT = Number((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 3000);
app.use(express_1.default.json());
app.use(express_1.default.static(node_path_1.default.join(__dirname, '..', 'public')));
app.use('/api/agents', agents_1.agentsRouter);
app.get('/', (_req, res) => {
    const agents = db_1.db.prepare('SELECT * FROM agents ORDER BY id').all();
    const rows = agents
        .map((a) => `<tr>
  <td>${a.id}</td>
  <td>${(0, Main_1.escapeHtml)(a.name)}</td>
  <td>${(0, Main_1.escapeHtml)(a.species)}</td>
  <td>${a.created_at}</td>
</tr>`)
        .join('');
    const table = `<h1>Agents</h1>
<table>
  <thead><tr><th>ID</th><th>Name</th><th>Species</th><th>Created</th></tr></thead>
  <tbody>${rows === '' ? '<tr><td colspan="4">No agents yet</td></tr>' : rows}</tbody>
</table>`;
    res.set('Content-Type', 'text/html').send((0, Layout_1.layout)({ title: 'Agents', body: table }));
});
app.listen(PORT, () => {
    console.log(`AgentClinic listening on http://localhost:${PORT}`);
});
