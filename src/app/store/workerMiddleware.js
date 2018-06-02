// @flow

const createWorkerMiddleware = (worker: Worker) => {
  if (!worker) {
    throw new Error(`\`createWorkerMiddleware\` expects a worker instance as the argument. Instead received: ${worker}`);
  } else if (!worker.postMessage) {
    throw new Error('The worker instance is expected to have a `postMessage` method.');
  }

  return ({ dispatch }) => {
    worker.onmessage = ({ data: resultAction }) => {
      dispatch(resultAction);
      if (!worker.onMessage) {
        return;
      }
      worker.onMessage(resultAction);
    };

    return next => {
      if (!next) {
        throw new Error('Worker middleware received no `next` action. Check your chain of middlewares.');
      }

      return ({ meta, ...action }) => {
        if (meta && meta.worker) {
          worker.postMessage(action);
        }
        return next({ meta, ...action });
      };
    };
  };
};

export default createWorkerMiddleware;
