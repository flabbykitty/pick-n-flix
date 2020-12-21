import React from 'react'
import './assets/App.scss'
import Navigation from './components/Navigation'
import {Switch, Route} from 'react-router-dom'
import Login from './components/pages/Login'
import Home from './components/pages/Home'


const App = () => {
	return (
		<div>
			<Navigation/>

				<Switch>
					<Route exact path="/">
						<Home />
					</Route>

					<Route path="/login">
						<Login />
					</Route>
				</Switch>
		</div>
	)
}

export default App

