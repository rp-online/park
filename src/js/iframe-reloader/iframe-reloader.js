(() => {
  const eventMethod = window.addEventListener ? 'addEventListener' : 'attachEvent';
  const eventer = window[eventMethod];
  const messageEvent = eventMethod === 'attachEvent' ? 'onmessage' : 'message';

  eventer(messageEvent, (e) => {
    if (e.data.data && e.data.data.message === 'reload') {
      window.location.hash = 'paymentSuccess';
      window.location.reload();
    }
  });
})();
