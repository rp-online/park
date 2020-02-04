(() => {
  window.park = Object.assign({}, window.park, {
    $(selector, elem) {
      elem = elem || document;

      const nodeArray = [];
      const nodeList = elem.querySelectorAll(selector);
      const nodeListLength = nodeList.length;
      let i = 0;

      for (; i < nodeListLength; i += 1) {
        nodeArray.push(nodeList[i]);
      }

      return nodeArray;
    },
  });
})();
