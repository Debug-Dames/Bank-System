import React from 'react';
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import App from "./App"
import { store } from './app/store.js'
import './styles/variables.css'
import './styles/global.css'

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
      <App />
    </Provider>
);
