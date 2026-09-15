import { header } from './Header'
import { main } from './Main'
import { footer } from './Footer'

export function layout({ title, body, current = '/' }: { title: string; body: string; current?: string }): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AgentClinic · ${title}</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    ${header(current)}
    ${main(body)}
    ${footer()}
  </body>
</html>`
}