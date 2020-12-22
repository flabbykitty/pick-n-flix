import React from 'react'
import './assets/App.scss'
import {Container} from 'react-bootstrap'
import {Routes, Route} from 'react-router-dom'
import AuthContextProvder from './contexts/AuthContext'

import Navigation from './components/Navigation'
import Login from './components/pages/Login'
import Logout from './components/Logout'
import Signup from './components/pages/Signup'
import Home from './components/pages/Home'


const App = () => {
	return (
		<div>
			<AuthContextProvder>
				<Navigation/>

				<Container>
					<Routes>
						<Route exact path="/">
							<Home />
						</Route>

						<Route path="/login">
							<Login />
						</Route>

						<Route path="/logout">
							<Logout />
						</Route>

						<Route path="/signup">
							<Signup />
						</Route>
					</Routes>
				</Container>

			</AuthContextProvder>
		</div>
	)
}

export default App

