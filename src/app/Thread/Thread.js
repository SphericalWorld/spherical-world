// @flow
class Thread {
  constructor() {
    // eslint-disable-next-line
    self.__router__ = {

    };

    // eslint-disable-next-line
    self.onmessage = function(e){
      // eslint-disable-next-line
      if (!self.__router__[e.data.type]) {
        return;
      }
      // eslint-disable-next-line
      self.__router__[e.data.type](e.data);
    };

    // eslint-disable-next-line
    self.registerMessageHandler = function(message, handler){
      if (typeof (handler) === 'function') {
        // eslint-disable-next-line
        self.__router__[message] = handler;
      }
    };
  }
}

export default Thread;
