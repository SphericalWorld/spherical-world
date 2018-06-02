// @flow

const createWebsocketMiddleware = network => ({ dispatch }) => (next) => {
  if (!next) {
    throw new Error('Worker middleware received no `next` action. Check your chain of middlewares.');
  }

  return (action) => {
    if (action.meta && action.meta.api) {
      network.emit(action.type, action.payload);
      if (Object.keys(action.meta).length === 1) {
        return;
      }
    }
    return next(action);
  };
};

export default createWebsocketMiddleware;
