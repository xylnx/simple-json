// DOMPurify => clean stings
// npm i jsdom dompurify
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const cleanData = (dirty) => {
  const window = new JSDOM('').window;
  const DOMPurify = createDOMPurify(window);
  const clean = DOMPurify.sanitize(dirty);
  console.log({ clean });
  return clean;
};

module.exports = {
  cleanData,
};
