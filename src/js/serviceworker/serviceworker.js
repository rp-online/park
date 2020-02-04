/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */

importScripts('https://cdnjs.cloudflare.com/ajax/libs/localforage/1.7.3/localforage.min.js');

localforage.setDriver(localforage.INDEXEDDB);
localforage.getItem('park_layout').then((result) => {
  if (typeof self.useParkLayout === 'undefined') {
    self.useParkLayout = result;
  }
});

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(clients.claim());
});

self.addEventListener('message', (e) => {
  if (typeof e.data.park_layout === 'undefined') {
    return;
  }

  if (e.data.park_layout) {
    localforage.setItem('park_layout', '1');
    self.useParkLayout = '1';
  } else {
    localforage.removeItem('park_layout');
    self.useParkLayout = null;
  }
});

self.addEventListener('fetch', (e) => {
  const originalRequest = e.request;
  const url = new URL(originalRequest.url);
  const modifiedHeaders = new Headers();

  for (const entry of originalRequest.headers.entries()) {
    modifiedHeaders.append(entry[0], entry[1]);
  }
  modifiedHeaders.append('x-client', 'park-layout');

  if (
    self.useParkLayout &&
    location.hostname === url.hostname &&
    originalRequest.url.indexOf('park_layout=0') === -1
  ) {
    const modifiedRequest = new Request(originalRequest.url, {
      method: originalRequest.method,
      headers: modifiedHeaders,
      mode: originalRequest.mode === 'navigate' ? 'same-origin' : originalRequest.mode, // need to set this properly for 'navigate'
      credentials: originalRequest.credentials,
      redirect: 'manual', // let browser handle redirects
    });

    e.respondWith(fetch(modifiedRequest));
  }

  if (
    location.hostname === url.hostname &&
    originalRequest.url.indexOf('park_layout=0') > -1
  ) {
    localforage.removeItem('park_layout');
    self.useParkLayout = null;
  }
});
