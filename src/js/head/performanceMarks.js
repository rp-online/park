// eslint-disable-next-line no-unused-vars
class PerformanceMeasurement {
  // eslint-disable-next-line no-useless-constructor
  constructor(logger) {
    this.logger = logger;
    this.timingMap = new Map();
    // eslint-disable-next-line func-names
    this.start = function (nameOfProcess = '') {
      if (!nameOfProcess || nameOfProcess === '') {
        return;
      }
      if (!this.logger) {
        return;
      }
      if (!this.logger.info) {
        return;
      }
      this.timingMap.set(nameOfProcess, new Date());
    };
    // eslint-disable-next-line func-names
    this.end = function (nameOfProcess = '') {
      if (!nameOfProcess || nameOfProcess === '') {
        return;
      }
      if (!this.logger) {
        return;
      }
      if (!this.logger.info) {
        return;
      }
      if (this.timingMap.get(nameOfProcess)) {
        const date1 = this.timingMap.get(nameOfProcess);
        const date2 = new Date();
        const diff = date2 - date1;
        this.logger.info(`Process ${nameOfProcess} started at ${date1}`);
        this.logger.info(`Process ${nameOfProcess} ended at ${date2}`);
        this.logger.info(`Process ${nameOfProcess} took ${diff} milliseconds`);
        this.timingMap.delete(nameOfProcess);
      }
    };
  }
}
(() => {
  window.park = Object.assign({}, window.park, {
    performanceMarks: new PerformanceMeasurement(window.park.console),
  });
})();
