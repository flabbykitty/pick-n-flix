import React from 'react'
import './assets/main.scss'
import {Container} from 'react-bootstrap'
import {Routes, Route} from 'react-router-dom'
import AuthContextProvder from './contexts/AuthContext'
import ListContextProvder from './contexts/ListContext'

import Navigation from './components/Navigation'
import Login from './components/pages/Login'
import Logout from './components/Logout'
import Signup from './components/pages/Signup'
import ResetPassword from './components/pages/ResetPassword'
import Home from './components/pages/Home'
import SearchResults from './components/pages/SearchResults'
import Add from './components/pages/Add'
import Edit from './components/pages/Edit'
import Profile from './components/pages/Profile'
import Movie from './components/pages/Movie'
import Footer from './components/Footer'


const App = () => {
	return (
		<div>
			<AuthContextProvder>

				<ListContextProvder>

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

							<Route path="/profile/edit/:id">
								<Edit />
							</Route>

							<Route path="/profile/">
								<Profile />
							</Route>

							<Route path="/movie/:id">
								<Movie />
							</Route>
						</Routes>
					</Container>

					<Footer/>

				</ListContextProvder>
				
			</AuthContextProvder>
		</div>
	)
}

export default App

