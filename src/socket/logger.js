class Logger {
    constructor() {
      if (Logger.instance) {
        return Logger.instance;
      }
      Logger.instance = this;
      return this;
    }
  
    log(mess, data = '') {
      //  console.log('CHECK_SOCKET_LOG', mess, data);
    }
  }
  
  const instance = new Logger();
  Object.freeze(instance);
  
  export default Logger;
  