function requireBasicAuth(req, res, next) {
  const authValue = req.get('Authorization') || '';

  if (!authValue.toLowerCase().startsWith('basic ')) {
    return res.status(401).json({ error: "Missing basic auth" })
  }

  const token = authValue.split(' ')[1];

  const [ tokenUsername, tokenPassword ] = Buffer
    .from(token, 'base64')
    .toString('ascii')
    .split(':');

  req.app.get('db')('thingful_users')
    .select('*')
    .where({ user_name: tokenUsername, password: tokenPassword })
    .first()
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: "Invalid credentials" })
      }
      req.user = user
      next()
    })
    .catch(next);
}

module.exports = requireBasicAuth;