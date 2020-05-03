import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

import listReducer from 'redux/reducers/performanceDataReducer'

import {Provider} from 'react-redux'
import { createStore, combineReducers } from 'redux';

let rootReducer = combineReducers({
  listData: listReducer
})

let store = createStore(rootReducer)

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

serviceWorker.register();
