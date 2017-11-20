import React, { Component } from 'react'
import { HashRouter as Router, Route } from 'react-router-dom'

// views
import Home from '@/views/home'
import List from '@/views/list'

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<div>
						<Route exact path="/" component={Home} />
						<Route exact path="/list" component={List} />
					</div>
				</Router>
			</div>
		)
	}
}

export default App
