"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const Main_1 = require("./Main");
(0, vitest_1.describe)('escapeHtml', () => {
    (0, vitest_1.it)('escapes HTML special characters', () => {
        (0, vitest_1.expect)((0, Main_1.escapeHtml)('<script>"x"&\'y\'</script>')).toBe('&lt;script&gt;&quot;x&quot;&amp;&#39;y&#39;&lt;/script&gt;');
    });
    (0, vitest_1.it)('leaves plain text unchanged', () => {
        (0, vitest_1.expect)((0, Main_1.escapeHtml)('Ada, dev-agent')).toBe('Ada, dev-agent');
    });
});
