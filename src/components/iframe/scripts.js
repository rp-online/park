(() => {
  window.addEventListener('message', (e) => {
    if (!e.data || !e.data.action || !e.data.data || e.data.action !== 'resize') {
      return;
    }

    const iframe = window.park.$('.park-iframe__iframe')
      .filter(elem => elem.name === e.data.data.name)[0];

    if (iframe) {
      iframe.setAttribute('height', e.data.data.height);
    }

    // RPAPP-943 - Integration RP+-Kaufprozess in RPO-Paywall
    if (e.data.data.scrollPos && e.data.data.scrollPos.top && iframe.getAttribute('data-scrollpos-top') !== e.data.data.scrollPos.top.toString()) {
      iframe.setAttribute('data-scrollpos-top', e.data.data.scrollPos.top);
      window.scrollTo({ top: e.data.data.scrollPos.top, left: 0, behavior: 'smooth' });
    }
  });

  window.park.observer.initialize('.park-iframe', (elem) => {
    window.park.lazyLoad(elem.querySelector('.park-iframe__iframe'));
  }, false);
})();
