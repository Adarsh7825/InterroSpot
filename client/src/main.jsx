import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from './App';
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from './reducer/index';

const store = configureStore({
  reducer: rootReducer,
});

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);