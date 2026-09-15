"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ailmentsRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
exports.ailmentsRouter = express_1.default.Router();
function findAilment(id) {
    return db_1.db.prepare('SELECT * FROM ailments WHERE id = ?').get(id);
}
function isValidName(value) {
    return typeof value === 'string' && value.trim() !== '';
}
function normalizeDescription(value) {
    if (value === undefined)
        return value;
    return typeof value === 'string' ? value.trim() || null : null;
}
exports.ailmentsRouter.get('/', (_req, res) => {
    const ailments = db_1.db.prepare('SELECT * FROM ailments ORDER BY id').all();
    res.json(ailments);
});
exports.ailmentsRouter.get('/:id', (req, res) => {
    const ailment = findAilment(Number(req.params.id));
    if (!ailment)
        return res.status(404).json({ error: 'Ailment not found' });
    res.json(ailment);
});
exports.ailmentsRouter.post('/', (req, res) => {
    var _a;
    const { name, description } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (!isValidName(name)) {
        return res.status(400).json({ error: 'name is required' });
    }
    const result = db_1.db
        .prepare('INSERT INTO ailments (name, description) VALUES (?, ?)')
        .run(name.trim(), normalizeDescription(description));
    res.status(201).json(findAilment(Number(result.lastInsertRowid)));
});
exports.ailmentsRouter.patch('/:id', (req, res) => {
    var _a;
    const ailment = findAilment(Number(req.params.id));
    if (!ailment)
        return res.status(404).json({ error: 'Ailment not found' });
    const { name, description } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (name !== undefined && !isValidName(name)) {
        return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    const nextName = isValidName(name) ? name.trim() : ailment.name;
    const desc = description === undefined ? ailment.description : normalizeDescription(description);
    db_1.db.prepare('UPDATE ailments SET name = ?, description = ? WHERE id = ?').run(nextName, desc, ailment.id);
    res.json(findAilment(ailment.id));
});
exports.ailmentsRouter.delete('/:id', (req, res) => {
    const result = db_1.db.prepare('DELETE FROM ailments WHERE id = ?').run(Number(req.params.id));
    if (result.changes === 0)
        return res.status(404).json({ error: 'Ailment not found' });
    res.status(204).end();
});
