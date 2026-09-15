"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.therapiesRouter = void 0;
const express_1 = __importDefault(require("express"));
const db_1 = require("./db");
exports.therapiesRouter = express_1.default.Router();
function findTherapy(id) {
    return db_1.db.prepare('SELECT * FROM therapies WHERE id = ?').get(id);
}
function isValidName(value) {
    return typeof value === 'string' && value.trim() !== '';
}
function normalizeNullable(value) {
    if (value === undefined)
        return value;
    return typeof value === 'string' ? value.trim() || null : null;
}
exports.therapiesRouter.get('/', (_req, res) => {
    const therapies = db_1.db.prepare('SELECT * FROM therapies ORDER BY id').all();
    res.json(therapies);
});
exports.therapiesRouter.get('/:id', (req, res) => {
    const therapy = findTherapy(Number(req.params.id));
    if (!therapy)
        return res.status(404).json({ error: 'Therapy not found' });
    res.json(therapy);
});
exports.therapiesRouter.post('/', (req, res) => {
    var _a;
    const { name, description, applies_to } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (!isValidName(name)) {
        return res.status(400).json({ error: 'name is required' });
    }
    const result = db_1.db
        .prepare('INSERT INTO therapies (name, description, applies_to) VALUES (?, ?, ?)')
        .run(name.trim(), normalizeNullable(description), normalizeNullable(applies_to));
    res.status(201).json(findTherapy(Number(result.lastInsertRowid)));
});
exports.therapiesRouter.patch('/:id', (req, res) => {
    var _a;
    const therapy = findTherapy(Number(req.params.id));
    if (!therapy)
        return res.status(404).json({ error: 'Therapy not found' });
    const { name, description, applies_to } = (_a = req.body) !== null && _a !== void 0 ? _a : {};
    if (name !== undefined && !isValidName(name)) {
        return res.status(400).json({ error: 'name must be a non-empty string' });
    }
    const nextName = isValidName(name) ? name.trim() : therapy.name;
    const desc = description === undefined ? therapy.description : normalizeNullable(description);
    const appliesTo = applies_to === undefined ? therapy.applies_to : normalizeNullable(applies_to);
    db_1.db.prepare('UPDATE therapies SET name = ?, description = ?, applies_to = ? WHERE id = ?').run(nextName, desc, appliesTo, therapy.id);
    res.json(findTherapy(therapy.id));
});
exports.therapiesRouter.delete('/:id', (req, res) => {
    const result = db_1.db.prepare('DELETE FROM therapies WHERE id = ?').run(Number(req.params.id));
    if (result.changes === 0)
        return res.status(404).json({ error: 'Therapy not found' });
    res.status(204).end();
});
