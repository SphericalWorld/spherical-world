// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App, { start } from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
start();
