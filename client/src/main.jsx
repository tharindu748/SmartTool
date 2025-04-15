import React from 'react';  // React library
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';  // Redux Provider to make store accessible
import './index.css';  // Global styles (if any)
import App from './App.jsx';  // Main App component // Import the Redux store
import {store, persistor} from './redux/store.js';  // Import the Redux store
import { PersistGate } from 'redux-persist/integration/react';  // For persisting the store


createRoot(document.getElementById('root')).render(
  <PersistGate persistor={persistor}>
    <Provider store={store}>  {/* Wrap your app with Redux Provider */}
      <App />
    </Provider>
  </PersistGate>  // PersistGate to manage the loading state of the persisted store
);
