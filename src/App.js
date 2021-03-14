import React from 'react'
import './assets/main.scss'
import {Container} from 'react-bootstrap'
import {Routes, Route} from 'react-router-dom'
import AuthContextProvder from './contexts/AuthContext'
import Navigation from './components/Navigation'
import Login from './components/pages/Login'
import Logout from './components/Logout'
import Signup from './components/pages/Signup'
import ResetPassword from './components/pages/ResetPassword'
import Home from './components/pages/Home'
import SearchResults from './components/pages/SearchResults'
import Add from './components/pages/Add'
import Profile from './components/pages/Profile'


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

							<Route path="/resetpassword">
								<ResetPassword />
							</Route>

							<Route path="/search">
								<SearchResults />
							</Route>

							<Route path="/profile/add/:id">
								<Add />
							</Route>

							<Route path="/profile/">
								<Profile />
							</Route>
						</Routes>
					</Container>

			</AuthContextProvder>
		</div>
	)
}

export default App

