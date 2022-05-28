const filesAsJson = (files) => {
  return Object.keys(files).reduce((a, b) => ({
    ...a,
    [b]: files[b].data
  }), {});
};

module.exports = {
  filesAsJson
};