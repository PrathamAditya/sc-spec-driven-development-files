"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.layout = layout;
const Header_1 = require("./Header");
const Main_1 = require("./Main");
const Footer_1 = require("./Footer");
function layout({ title, body }) {
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentClinic · ${title}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    ${(0, Header_1.header)()}
    ${(0, Main_1.main)(body)}
    ${(0, Footer_1.footer)()}
  </body>
</html>`;
}
