import React, { Component } from 'react'
import {
	BrowserRouter as Router,
	Route
} from 'react-router-dom'

// views
import Home from '@/views/home'

class App extends Component {
	render() {
		return (<div className="App">
			<Home></Home>
		</div>)
	}
}

export default App
