module.exports = {
  /**
   * Extract metadata from filename
   */
  parse: (req, res, next) => {
    guessit(req.body.filename)
      .then((data) => res.apiSuccess(data))
      .catch((e) => res.apiError(LOG_PREFIX, 'Cannot parse filename', e));
  }
};