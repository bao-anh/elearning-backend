const Document = require('../models/Document');

exports.getAllDocument = async () => {
  return await Document.find();
};

exports.getDocumentById = async (documentId) => {
  return await Document.findById(documentId);
};
