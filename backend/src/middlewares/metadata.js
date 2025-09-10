export const addIp = (req, res, next) => {
  if (!req.session.reqMeta) {
    req.session.reqMeta = {
      ip: req.ip,
      userAgent: req.headers['user-agent'],
      lastVisited: new Date()
    };
  } else {
    req.session.reqMeta.lastVisited = new Date();
  }
  next();
}

export const b4addIp = (req, res, next) => {
  // Capture these before authentication
  req.session.ip = req.ip;
  req.session.userAgent = req.get("User-Agent");
  req.session.lastVisited = new Date();
  next();
}