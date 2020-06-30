exports.handleUnprocessableEntity = (entity, res) => {
  if (!entity) return res.status(422);
};

exports.sortArrayByPropertyValue = (arr, property) => {
  const compare = (a, b) =>
    a[property] > b[property] ? 1 : a[property] < b[property] ? -1 : 0;
  return arr.sort(compare);
};
