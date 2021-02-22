// eslint-disable-next-line no-unused-vars
class BundleLoader {
  // method to return a Promise that makes use of a variety of load-mechanisms
  // based on resources, cache and Browser capabilities
  // eslint-disable-next-line class-methods-use-this,consistent-return
  loadFile(src, type, attributes, params) {
    // open a new Promise
    return new Promise((resolve, reject) => {
      // store block-scoped reference to writeToStorage to use in Worker Event callback
      const writeToStorage = this.writeToStorage;
      // First check if resource has already been loaded and is available in localeStorage
      if (this.canUseStorageFeature) {
        const cachedData = this.readFromStorage(src);
        if (cachedData) {
          console.log('Use Cache > no more network requests needed');
          resolve({ type, src, attributes, params, data: cachedData });
          return;
        }
      }
      // if resource not in cache check if all capabilities needed to use Worker are given
      if (this.canUseWorkerFeature) {
        console.log('Use Worker > better than Promise because of Multithreading');
        // build a worker in runtime by using factory method
        const worker = this.createWorker(this.loadSingleFile);
        // eslint-disable-next-line func-names
        worker.onmessage = function (event) {
          if (event.data) {
            if (event.data.event === 'WORKER_TO_MAIN_EVENT' && event.data.type === 'SUCCESS' && typeof event.data.res !== 'undefined') {
              resolve({ type, src, attributes, params, data: event.data.res });
              writeToStorage(src, event.data.res);
              worker.terminate();
            } else if (event.data.event === 'WORKER_TO_MAIN_EVENT' && event.data.type === 'ERROR') {
              reject(event.data.type ? `A ${event.data.type} occured loading file ${src}` : `An error occured loading file ${src}`);
              worker.terminate();
            }
          }
        };
        worker.postMessage({ event: 'MAIN_TO_WORKER_EVENT', type: 'LOAD', src });
      } else {
        console.log('Use Promises > still a proper implementation but gets added to mainthread');
        // If Worker cannot be used fall back to a Promise
        this.loadSingleFile(src, (data) => {
          resolve({ type, src, attributes, params, data });
          writeToStorage(src, data);
        }, (e) => {
          reject(e.type ? `A ${e.type} occured loading file ${src}` : `An error occured loading file ${src}`);
        });
      }
    });
  }
  // eslint-disable-next-line class-methods-use-this
  readFromStorage(id) {
    try {
      // eslint-disable-next-line no-storage/no-browser-storage
      const data = localStorage.getItem(id);
      if (data === null) {
        return undefined;
      }
      return data;
    } catch (e) {
      return undefined;
    }
  }
  // eslint-disable-next-line class-methods-use-this
  writeToStorage(id, data) {
    try {
      // eslint-disable-next-line no-storage/no-browser-storage
      localStorage.setItem(id, data);
      return true;
    } catch (e) {
      return false;
    }
  }
  // Factory method to build a Worker instance from any method
  // by stringifying it and using it as a listener method
  // eslint-disable-next-line class-methods-use-this
  createWorker(fn) {
    const blob = new Blob(['self.onmessage = ', fn.toString()], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    return new Worker(url);
  }
  // Method that is used to load files either inside a Worker instance
  // or inside a Promise instance depending on context
  // eslint-disable-next-line class-methods-use-this
  loadSingleFile(p, successHandlerIfNotInWorker, errorHandlerIfNotInWorker) {
    let src;
    let isInsideWorker;
    // eslint-disable-next-line no-undef
    if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
      if (p.data) {
        if (p.data.event === 'MAIN_TO_WORKER_EVENT' && p.data.type === 'LOAD' && p.data.src !== '') {
          src = p.data.src;
          isInsideWorker = true;
        }
      }
    } else {
      src = p;
      isInsideWorker = false;
    }
    const http = new XMLHttpRequest();
    http.open('GET', src);
    http.send();
    // eslint-disable-next-line no-unused-vars
    http.onload = (e) => {
      // if loaded trim tabs and new lines
      const res = http.responseText.toString().replace(/[\t\n\r]/gm, '');
      if (isInsideWorker) {
        postMessage({ event: 'WORKER_TO_MAIN_EVENT', type: 'SUCCESS', res });
      } else if (successHandlerIfNotInWorker) {
        successHandlerIfNotInWorker(res);
      }
    };
    // eslint-disable-next-line no-unused-vars
    http.onerror = (e) => {
      // eslint-disable-next-line no-undef
      if (isInsideWorker) {
        postMessage({ event: 'WORKER_TO_MAIN_EVENT', type: 'ERROR' });
      } else if (errorHandlerIfNotInWorker) {
        errorHandlerIfNotInWorker();
      }
    };
  }
  // method to initially detect necessary Browser features that
  // will be used within the Worker implementation
  // eslint-disable-next-line class-methods-use-this
  detectWorkerFeature() {
    let canIUse = false;
    if (typeof window.Worker !== 'undefined' && typeof window.Blob !== 'undefined' && typeof window.URL !== 'undefined') {
      if (typeof URL.createObjectURL !== 'undefined') {
        canIUse = true;
      }
    }
    return canIUse;
  }
  // method to initially detect storage capabilities that
  // will be used within the Worker implementation
  // eslint-disable-next-line class-methods-use-this
  detectStorageFeature() {
    const mod = 'foo';
    try {
      // eslint-disable-next-line no-storage/no-browser-storage
      localStorage.setItem(mod, mod);
      // eslint-disable-next-line no-storage/no-browser-storage
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  }
  // find the right loading strategy for the URL that's coming in
  findLoadStrategy(resource) {
    const EXTENSIONS = ['css', 'js'];
    const path = resource.src;
    const attributes = resource.attributes ? resource.attributes : {};
    const params = resource.params ? resource.params : {};
    const pathStripped = (path.split('?')[0]).toString();
    const lastIndex = pathStripped.lastIndexOf('.');
    const extension = pathStripped.slice(lastIndex + 1);
    if (EXTENSIONS.indexOf(extension) !== -1) {
      return this.loadFile(path, attributes, params);
      // return this.loadFile(this.transformPath(path), attributes, params);
    }
    return Promise.reject(`You cannot load an extension of '${extension}' with this loader`);
  }
  // eslint-disable-next-line class-methods-use-this
  transformPath(path) {
    if (this.isValidUrl(path)) {
      return path;
    }
    return `${document.location.origin}/${path}`;
  }
  // eslint-disable-next-line class-methods-use-this
  isValidUrl(path) {
    const urlRegex = /^((http(s?)?):\/\/)?[a-zA-Z0-9\-.]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/g;
    const result = path.match(urlRegex);
    return result !== null;
  }
  constructor(useCache = true, useWorker = true) {
    // detect features and store result in a class var
    this.canUseWorkerFeature = this.detectWorkerFeature() && useWorker;
    this.canUseStorageFeature = this.detectStorageFeature() && useCache;
    console.log(`start a new Bundleloader with these features: useCache: ${this.canUseStorageFeature} / useWorker: ${this.canUseWorkerFeature}`);
    this.load = (resources = []) => {
      const len = resources.length;
      let i = 0;
      const promiseArr = [];
      for (i; i < len; i += 1) {
        const resource = resources[i];
        if (resource.src) {
          const p = this.findLoadStrategy(resource);
          if (p !== undefined) {
            promiseArr.push(p);
          }
        }
      }
      return Promise.all(promiseArr);
    };
  }
}

(() => {
  window.park = Object.assign({}, window.park, {
    bundleLoader: new BundleLoader(true, true),
  });
})();
