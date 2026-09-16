export default function admin(req, res, next) {
  // console.log(req.user.role);
  if (req.user.role !== "admin") return res.status(403).send('Access Denied!');

  next();
}