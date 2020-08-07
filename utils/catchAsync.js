// ASYNC ERRORS // --------
module.exports = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next); // shorthand for (err => next(err))
  };
};
