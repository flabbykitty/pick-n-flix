import React, {useRef, useState} from 'react'
import {Alert, Col, Row, Form, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import {useAuth} from '../../contexts/AuthContext'

const Signup = () => {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfRef = useRef()
    const usernameRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const {signup} = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)

        if (passwordRef.current.value !== passwordConfRef.current.value) {
			return setError("The passwords does not match")
		}

        try {
			setLoading(true)
			await signup(emailRef.current.value, passwordRef.current.value, usernameRef.current.value)
            navigate('/')
		} catch (e) {
			setError(e.message)
			setLoading(false)
		}
    }

    return (
        <Row>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} className="form-box">
                <Form onSubmit={handleSubmit}>
                    <Form.Text className="h2 mb-4">Sign up</Form.Text>

                    {error && (<Alert variant="danger">{error}</Alert>)}
                    <Form.Group>
                        <Form.Control type="text" ref={usernameRef} placeholder="Username" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Control type="email" ref={emailRef} placeholder="Email" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Control type="password" ref={passwordRef} placeholder="Password" />
                    </Form.Group>

                    <Form.Group>
                        <Form.Control type="password" ref={passwordConfRef} placeholder="Password confirmation" />
                    </Form.Group>

                    <Button disabled={loading} type="submit">Signup</Button>

                </Form>

            </Col>
        </Row>
    )
}

export default Signup
