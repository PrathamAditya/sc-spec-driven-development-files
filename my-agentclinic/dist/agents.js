"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.agentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
exports.agentsRouter = express_1.default.Router();
exports.agentsRouter.get('/', (_req, res) => {
    const agents = db_1.db.prepare('SELECT * FROM agents ORDER BY id').all();
    res.json(agents);
});
exports.agentsRouter.get('/:id', (req, res) => {
    const agent = db_1.db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id));
    if (!agent)
        return res.status(404).json({ error: 'Agent not found' });
    res.json(agent);
});
exports.agentsRouter.post('/', (req, res) => {
    var _a;
    const { name, species } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'name is required' });
    }
    if (typeof species !== 'string' || species.trim() === '') {
        return res.status(400).json({ error: 'species is required' });
    }
    const result = db_1.db.prepare('INSERT INTO agents (name, species) VALUES (?, ?)').run(name.trim(), species.trim());
    const agent = db_1.db.prepare('SELECT * FROM agents WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(agent);
});
exports.agentsRouter.patch('/:id', (req, res) => {
    var _a;
    const agent = db_1.db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id));
    if (!agent)
        return res.status(404).json({ error: 'Agent not found' });
    const { name, species } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (name !== undefined && (typeof name !== 'string' || name.trim() === '')) {
        return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    if (species !== undefined && (typeof species !== 'string' || species.trim() === '')) {
        return res.status(400).json({ error: 'species must be a non-empty string' });
    }
    const nextName = typeof name === 'string' ? name.trim() : agent.name;
    const nextSpecies = typeof species === 'string' ? species.trim() : agent.species;
    db_1.db.prepare('UPDATE agents SET name = ?, species = ? WHERE id = ?').run(nextName, nextSpecies, agent.id);
    const updated = db_1.db.prepare('SELECT * FROM agents WHERE id = ?').get(agent.id);
    res.json(updated);
});
exports.agentsRouter.delete('/:id', (req, res) => {
    const result = db_1.db.prepare('DELETE FROM agents WHERE id = ?').run(Number(req.params.id));
    if (result.changes === 0)
        return res.status(404).json({ error: 'Agent not found' });
    res.status(204).end();
});
exports.agentsRouter.get('/:id/therapies', (req, res) => {
    const agent = db_1.db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id));
    if (!agent)
        return res.status(404).json({ error: 'Agent not found' });
    const therapies = db_1.db
        .prepare(`SELECT t.* FROM therapies t
       JOIN agent_therapies at ON at.therapy_id = t.id
       WHERE at.agent_id = ?
       ORDER BY t.id`)
        .all(agent.id);
    res.json(therapies);
});
exports.agentsRouter.post('/:id/therapies', (req, res) => {
    var _a;
    const agent = db_1.db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id));
    if (!agent)
        return res.status(404).json({ error: 'Agent not found' });
    const therapyId = ((_a = req.body) !== null && _a !== void 0 ? _a : {}).therapy_id;
    if (!Number.isInteger(therapyId)) {
        return res.status(400).json({ error: 'therapy_id is required' });
    }
    const therapy = db_1.db.prepare('SELECT * FROM therapies WHERE id = ?').get(Number(therapyId));
    if (!therapy)
        return res.status(404).json({ error: 'Therapy not found' });
    const already = db_1.db
        .prepare('SELECT 1 FROM agent_therapies WHERE agent_id = ? AND therapy_id = ?')
        .get(agent.id, therapyId);
    if (already)
        return res.status(409).json({ error: 'Therapy already assigned to agent' });
    db_1.db.prepare('INSERT INTO agent_therapies (agent_id, therapy_id) VALUES (?, ?)').run(agent.id, therapyId);
    res.status(201).json(therapy);
});
exports.agentsRouter.delete('/:id/therapies/:therapyId', (req, res) => {
    const agent = db_1.db.prepare('SELECT * FROM agents WHERE id = ?').get(Number(req.params.id));
    if (!agent)
        return res.status(404).json({ error: 'Agent not found' });
    const result = db_1.db
        .prepare('DELETE FROM agent_therapies WHERE agent_id = ? AND therapy_id = ?')
        .run(agent.id, Number(req.params.therapyId));
    if (result.changes === 0)
        return res.status(404).json({ error: 'Assignment not found' });
    res.status(204).end();
});
