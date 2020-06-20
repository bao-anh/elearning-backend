exports.handleUnprocessableEntity = (entity, res) => {
  if (!entity) return res.status(422);
};
