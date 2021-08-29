import * as React from 'react';
import * as ReactDom from 'react-dom';
import './shim.js';

import './styles/index.css';
import App from './app';

ReactDom.render(
    <App />,
    document.getElementById('root'),
);
