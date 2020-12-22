import React, {useEffect} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {useNavigate} from 'react-router-dom'
import {Row, Col, Alert} from 'react-bootstrap'

const Logout = () => {
    const {logout} = useAuth()
    const navigate = useNavigate()

    useEffect(async () => {
        await logout()
        navigate('/')
    }, [])

    return (
        <Row>
            <Col md={{ span: 6, offset: 3 }}>
                <Alert variant="primary">You are being logged out...</Alert>
            </Col>
        </Row>
    )
}

export default Logout
