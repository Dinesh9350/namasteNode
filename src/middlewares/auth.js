const AdminAuth = (req, res, next) => {
  //checking if user is Authorized
  console.log("Admin Auth is getting checked");
  const token = "xyz";
  const isAuthorized = token === "xyz";
  if (!isAuthorized) {
    res.status(401).send("Unauthorized Request");
  } else {
    next();
  }
}

module.exports = { AdminAuth }