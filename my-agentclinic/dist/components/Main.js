"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
exports.escapeHtml = escapeHtml;
function main(...sections) {
    return `<main class="site-main">${sections.join('')}</main>`;
}
function escapeHtml(value) {
    return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
}
