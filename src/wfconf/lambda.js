const { headers, body } = data;

if (headers['x-github-event'] !== 'issues' || body.action !== 'closed') {
  return null;
} 

return {
  owner: body.repository.owner.login,
  repo: body.repository.name,
  number: body.issue.number,
  body: `L'issue #${body.issue.number} ${body.issue.title} a été closed.`
};