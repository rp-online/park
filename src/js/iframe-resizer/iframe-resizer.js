(() => {
  if (window === window.top) {
    return;
  }

  function updateHeight() {
    const body = document.querySelector('body');

    if (!body) {
      return;
    }

    window.parent.postMessage({
      action: 'resize',
      data: {
        name: window.name,
        height: body.scrollHeight,
      },
    }, '*');
  }

  window.setInterval(updateHeight, 1000);

  if (document.readyState !== 'loading') {
    updateHeight();
  }

  updateHeight();
})();
