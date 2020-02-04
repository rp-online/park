(() => {
  const initCallbacks = [];
  const foundPlayers = [];
  const activePlayers = [];
  const alreadyTrackedLoadVideoIds = [];
  const alreadyTrackedPlayVideoIds = [];
  const alreadyTrackedEndVideoIds = [];

  function readyEventHandler(e) {
    const elem = e.target.a.closest('.park-video');
    const videoId = e.target.getVideoData().video_id;
    const videoTitle = e.target.getVideoData().title;

    if (!window.park.eventHub) {
      window.setTimeout(() => {
        readyEventHandler(e);
      }, 100);
      return;
    }

    if (alreadyTrackedLoadVideoIds.indexOf(videoId) > -1) {
      return;
    }

    alreadyTrackedLoadVideoIds.push(videoId);

    window.park.eventHub.trigger(document, 'park.video:load', {
      elem,
      videoId,
      videoTitle,
    });
  }

  function stateChangeEventHandler(e) {
    const elem = e.target.a.closest('.park-video');
    const videoId = e.target.getVideoData().video_id;
    const videoTitle = e.target.getVideoData().title;

    if (!window.park.eventHub) {
      window.setTimeout(() => {
        stateChangeEventHandler(e);
      }, 100);
      return;
    }

    switch (e.data) {
      default:
        break;

      case window.YT.PlayerState.PLAYING:
        if (alreadyTrackedPlayVideoIds.indexOf(videoId) > -1) {
          return;
        }

        alreadyTrackedPlayVideoIds.push(videoId);

        window.park.eventHub.trigger(document, 'park.video:play', {
          elem,
          videoId,
          videoTitle,
        });
        break;

      case window.YT.PlayerState.ENDED:
        if (alreadyTrackedEndVideoIds.indexOf(videoId) > -1) {
          return;
        }

        alreadyTrackedEndVideoIds.push(videoId);

        window.park.eventHub.trigger(document, 'park.video:end', {
          elem,
          videoId,
          videoTitle,
        });
        break;
    }
  }

  window.onYouTubeIframeAPIReady = () => {
    while (initCallbacks.length) {
      initCallbacks.shift()();
    }
  };

  window.park.observer.initialize('.park-video', (elem) => {
    const videoId = elem.getAttribute('data-video-id');

    if (foundPlayers.indexOf(videoId) > -1) {
      return;
    }

    foundPlayers.push(videoId);

    const initCallback = videoId => () => {
      const playerElem = document.createElement('div');

      elem.appendChild(playerElem);

      const player = new window.YT.Player(playerElem, {
        videoId,
        allowfullscreen: true,
        enablejsapi: true,
        events: {
          onReady: readyEventHandler,
          onStateChange: stateChangeEventHandler,
        },
      });

      activePlayers.push(player);
    };

    if (window.YT && window.YT.Player) {
      initCallback(videoId)();
    } else {
      window.park.resourceLoader.script('https://www.youtube.com/iframe_api');
      initCallbacks.push(initCallback(videoId));
    }
  }, false);
})();
