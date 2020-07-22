import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { start } from './App';
import registerServiceWorker from './registerServiceWorker';

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.render(React.createElement(App), root);
registerServiceWorker();
start().catch((e) => console.error(e.stack));
