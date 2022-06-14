import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { SignerHub } from "./routes/signer-hub";
import { OperatorHub } from "./routes/operator-hub";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<SignerHub />} />
        <Route path='signer-hub' element={<SignerHub />} />
        <Route path='operator-hub' element={<OperatorHub />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
