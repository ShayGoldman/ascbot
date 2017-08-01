function success(res, data) {
  return res.json({err: null, data});
}

function error404(res, err) {
  return res.status(404).json({err: err.message});
}

function error500(res, err) {
  return res.status(500).json({err: err.message});
}

function error500Generic(res) {
  return res.status(500).json({err: "An unknown error has occurred"});
}

function handle(handler) {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => handler(req, res, next))
      .then((data) => success(res, data))
      .catch(next);
  }
}

function openEndpoint(func) {
  return [handle(func)];
}

module.exports = {
  openEndpoint,
  success,
  error404,
  error500,
  error500Generic
};