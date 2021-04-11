import React from 'react'
import {Container, Nav, Navbar} from 'react-bootstrap'
import {NavLink, Link} from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext'

const Navigation = () => {
    const {currentUser} = useAuth()

    return (
        <Navbar expand="lg" className=" mb-3 mb-md-5 py-3">
            <Container>
                <Link to="/">Pick 'n' Flix</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {currentUser && 
                        (<Navbar.Text className="mr-3">Signed in as: {currentUser.displayName ? currentUser.displayName : currentUser.email}</Navbar.Text>)}
                        
                        {currentUser 
                            ? 
                            (<>
                                <NavLink className="mr-3" to="/profile">Profile</NavLink>
                                <NavLink to="/logout">Logout</NavLink>
                            </>)
                            : 
                            (<>
                                <NavLink className="mr-3" to="/login">Login</NavLink>
                                <NavLink to="/signup">Signup</NavLink>
                            </>)
                        }
                        
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Navigation
