import React, {useRef, useState} from 'react'
import {Alert, Col, Row, Form, Button} from 'react-bootstrap'
import {useAuth} from '../../contexts/AuthContext'

const ResetPassword = () => {
    const emailRef = useRef()
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const {resetPassword} = useAuth()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError(null)
        setMessage(null)

        try {
			await resetPassword(emailRef.current.value)
            setMessage('Instructions to reset your password has been sent to you email.')
		} catch (e) {
			setError("Could not send reset instructions. Please check your email.")
		}
    }

    return (
        <Row>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} className="form-box">
                <Form onSubmit={handleSubmit}>
                    <Form.Text className="h2 mb-4">Reset password</Form.Text>
                    {error && (<Alert variant="danger">{error}</Alert>)}
				    {message && (<Alert variant="success">{message}</Alert>)}

                    <Form.Group>
                        <Form.Control type="email" ref={emailRef} placeholder="Email" />
                    </Form.Group>

                    <Button variant="primary" type="submit">Reset</Button>
                </Form>
            </Col>
        </Row>
    )
}

export default ResetPassword
