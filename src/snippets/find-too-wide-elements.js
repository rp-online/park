[].slice.call(document.querySelectorAll('*')).forEach((elem) => {
  const elemWidth = elem.offsetWidth;
  const elemWidthAttribute = elem.getAttribute('width');
  const viewportWidth = window.innerWidth;

  if (elemWidth > viewportWidth) {
    console.log(elemWidth, elem);
    return;
  }

  if (parseInt(elemWidthAttribute, 10) > viewportWidth) {
    console.log(elemWidthAttribute, elem);
  }
});
