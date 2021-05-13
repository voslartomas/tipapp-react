import { BrowserRouter } from 'react-router-dom'
import React from 'react';
import ReactDOM from 'react-dom';
import 'react-datepicker/dist/react-datepicker.css'
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker'
import '../node_modules/semantic-ui-css/semantic.min.css'
import './css/style.css'

ReactDOM.render(<BrowserRouter><App /></BrowserRouter>, document.getElementById('root'))
registerServiceWorker()
