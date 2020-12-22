import React from 'react'
import {Container, Nav, Navbar} from 'react-bootstrap'
import {NavLink, Link} from 'react-router-dom'
import {useAuth} from '../contexts/AuthContext'

const Navigation = () => {
    const {currentUser} = useAuth()

    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Link to="/">Pick 'n' Flix</Link>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ml-auto">
                        {currentUser && 
                        (<Navbar.Text>Signed in as: {currentUser.displayName ? curentUser.displayName : currentUser.email}</Navbar.Text>)}
                        
                        {currentUser 
                            ? 
                            (<>
                                <NavLink to="/profile">Profile</NavLink>
                                <NavLink to="/logout">Logout</NavLink>
                            </>)
                            : 
                            (<>
                                <NavLink to="/login">Login</NavLink>
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
