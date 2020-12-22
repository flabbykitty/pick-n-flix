import React, {useRef, useState} from 'react'
import {Alert, Col, Row, Form, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

const Login = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const navigate = useNavigate()
    const {login} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(false)

        try {
			setLoading(true)
			await login(emailRef.current.value, passwordRef.current.value)
			navigate('/')
		} catch (e) {
			setError("Could not log in. Please check your email address and your password.")
			setLoading(false)
		}
    }

    return (
        <Row>
            <Col md={{ span: 6, offset: 3 }}>
                <Form onSubmit={handleSubmit}>
                    {error && (<Alert variant="danger">{error}</Alert>)}
                    <Form.Group>
                        <Form.Control type="email" ref={emailRef} placeholder="Email" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Control type="password" ref={passwordRef} placeholder="Password" />
                    </Form.Group>

                    <Button disabled={loading} variant="primary" type="submit">Login</Button>

                </Form>

            </Col>
        </Row>
    )
}

export default Login
