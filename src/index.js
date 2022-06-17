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
import SignerHub from "./routes/signer-hub";
import OperatorHub from "./routes/operator-hub";
import Proxy from './routes/proxy';
import MNERC721 from './routes/mn-erc721';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter basename='/MyNFTSample'>
    <Routes>
      <Route path='/' element={<App />}>
        <Route index element={<Proxy />} />
        <Route path='signer-hub' element={<SignerHub />} />
        <Route path='operator-hub' element={<OperatorHub />} />
        <Route path='proxy' element={<Proxy />} />
        <Route path='erc721' element={<MNERC721 />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
