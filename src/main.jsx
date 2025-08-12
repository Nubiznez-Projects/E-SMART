// src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Your global CSS file
import App from './App.jsx';
//import 'rsuite/dist/rsuite.min.css';

// Import the Provider component from react-redux
import { Provider } from 'react-redux';

// Import your Redux store
// IMPORTANT: Adjust this path to wherever your Store.js (or Store.ts) file is located
// Based on your CRA example, it might be in `./Redux/Store/Store.js`
import { store } from './Redux/Store/Store';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Wrap your App component with the Provider and pass your store */}
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
);

// Note: reportWebVitals is typically a CRA-specific performance measurement tool
// and is not usually included or needed in a standard Vite setup.
// If you want similar functionality, you would need to implement it separately.