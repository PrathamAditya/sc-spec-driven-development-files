export function header(current: string): string {
  const link = (href: string, label: string) =>
    `<a href="${href}"${current === href ? ' class="active" aria-current="page"' : ''}>${label}</a>`
  return `
<header class="site-header">
  <div class="brand"><a href="/">AgentClinic</a></div>
  <nav class="site-nav">
    ${link('/agents', 'Agents')}
    ${link('/ailments', 'Ailments')}
    ${link('/therapies', 'Therapies')}
    ${link('/bookings', 'Bookings')}
  </nav>
</header>`
}