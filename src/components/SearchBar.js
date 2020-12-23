import React, {useRef, useState} from 'react'
import {Alert, Form, Row, Col, Button} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

const SearchBar = () => {
    const searchRef = useRef()
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        setError(null)
        if(!searchRef.current.value) {
            setError('Please make a search')
        } else {
            navigate(`/search?query=${searchRef.current.value}`)
        }
    }
    return (
        <Row>
            <Col xs={{ span: 10, offset: 1 }} md={{ span: 6, offset: 3 }} className="search-bar">
                {error && (<Alert variant="danger">{error}</Alert>)}
                <Form onSubmit={handleSubmit}>

                    <Form.Group>
                        <Form.Control autoFocus type="text" ref={searchRef} placeholder="Search" />
                    </Form.Group>

                        <Button type="submit">Search</Button>
                </Form>
            </Col>
        </Row>
    )
}

export default SearchBar
