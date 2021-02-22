(() => {
  window.park.glomexPlayer = {};
  function fillPreviewElement(previewElIdx, videoIdx) {
    const player = window.park.glomexPlayer.player;
    if (player.previewElements && player.previewElements[previewElIdx]) {
      player.previewElements[previewElIdx].dataset.playlistidx = videoIdx;
      player.previewElements[previewElIdx].getElementsByTagName('img')[0].src = player.playlist[videoIdx].thumbnail;
      player.previewElements[previewElIdx].getElementsByTagName('img')[0].alt = player.playlist[videoIdx].title;
      player.previewElements[previewElIdx].getElementsByTagName('img')[0].title = player.playlist[videoIdx].description;
      player.previewElements[previewElIdx].getElementsByClassName('park-video-glomex__teaser-list-item__headline')[0].textContent = player.playlist[videoIdx].title;
    }
  }
  function setActiveVideo() {
    const player = window.park.glomexPlayer.player;
    if (player.loading) {
      return;
    }
    player.loading = true;
    const idx = this.dataset.playlistidx;
    const previewElementIdx = this.dataset.previewelementidx;

    fillPreviewElement(previewElementIdx, player.curVideoPlaylistIndex);
    player.curVideoPlaylistIndex = idx;
    player.setPlaylistIndex(idx);
    player.curVideoTitleElement.textContent = player.playlist[idx].title;
    player.loading = false;
  }

  window.park.glomexPlayer.init = (player) => {
    player.curVideoPlaylistIndex = 0;
    player.previews = [];
    player.previewElements = [];
    player.playlist = [];
    player.previewElements = document.getElementsByClassName('park-video-glomex__teaser-list-item');
    player.loading = true;
    window.park.glomexPlayer.player = player;
    player.addEventListener('playlistcreate', (event) => {
      player.playlist = event.detail.playlist;
      player.curVideoPlaylistIndex = 0;
      player.curVideoTitleElement = document.querySelector('.park-video-glomex__player-headline');
      if (player.previewElements.length < 1) {
        window.park.console.error('Cannot find park-video-glomex__teaser-list-item elements!');
        return;
      }
      player.curVideoTitleElement.textContent = player.playlist[0].title;
      player.playlist.forEach((value, videoPlaylistIndex) => {
        if (!videoPlaylistIndex ||
            !player.previewElements[videoPlaylistIndex - 1]) {
          return;
        }
        fillPreviewElement(videoPlaylistIndex - 1, videoPlaylistIndex);
        player.previewElements[videoPlaylistIndex - 1].classList.remove('glomex-hidden');
        player.previewElements[videoPlaylistIndex - 1].addEventListener('click', setActiveVideo);
      });
      player.addEventListener('play', () => {
        window.park.eventHub.trigger(document, 'park.video:play', {
          elem: player,
          videoId: player.dataset.playlistId,
        });
      });
      player.addEventListener('pause', () => {
        window.park.eventHub.trigger(document, 'park.video:end', {
          elem: player,
          videoId: player.dataset.playlistId,
        });
      });
      player.addEventListener('ready', () => {
        window.park.eventHub.trigger(document, 'park.video:load', {
          elem: player,
          videoId: player.dataset.playlistId,
        });
      });
      player.loading = false;
    });
  };

  window.park.observer.initialize('.park-video-glomex__player', (sectionElement) => {
    let loopCounter = 30;
    function initPlayer() {
      const player = sectionElement.querySelector('glomex-player');
      if (player) {
        window.park.glomexPlayer.init(player);
        return;
      }
      if (loopCounter < 1) {
        window.park.console.error('Cannot init Glomex player!');
        return;
      }
      loopCounter -= 1;
      setTimeout(() => {
        initPlayer();
      }, 1000);
    }

    initPlayer();
  }, false);
})();
