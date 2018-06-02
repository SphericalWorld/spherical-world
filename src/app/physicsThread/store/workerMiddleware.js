// @flow
/* eslint-disable no-restricted-globals */
const workerMiddleware = ({ dispatch }) => {
  self.onmessage = ({ data: resultAction }) => {
    dispatch(resultAction);
    self.onMessage(resultAction);
  };

  return (next) => {
    if (!next) {
      throw new Error('Worker middleware received no `next` action. Check your chain of middlewares.');
    }

    return ({ meta, ...action }) => {
      if (meta && meta.worker) {
        self.postMessage(action);
      }
      return next({ meta, ...action });
    };
  };
};

export default workerMiddleware;
