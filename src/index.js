// TODO react-devtools

import React from 'react';
import ReactDOM from 'react-dom';
import '@/assets/normalize.css'
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// 初始化
ReactDOM.render(
	<App />,
	document.getElementById('root')
	)
registerServiceWorker()
