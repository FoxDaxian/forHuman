// TODO react-devtools

import React from 'react'
import ReactDOM from 'react-dom'
import '@/assets/normalize.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'

import { applyMiddleware, createStore, compose } from 'redux'
import reducers from '@/store/reducers'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'
import ajax from '@/axios'

const middlewares = [ReduxThunk]
if (process.env.NODE_ENV === 'development') {
	const { logger } = require('redux-logger')
	middlewares.push(logger)
}

ajax({
	method: 'get',
	url: '/api/unit/getservieconfiguration'
}).then((data) => {
	document.title = data.data.Data.match(/:"(.+)"}/)[1]
})

const store = compose(applyMiddleware(...middlewares))(createStore)(reducers)

// 初始化
ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,
	document.getElementById('root')
)
registerServiceWorker()
