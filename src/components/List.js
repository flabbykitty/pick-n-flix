import React, { useState, useContext } from 'react'
import MovieItem from './MovieItem'
import { AuthContext } from '../contexts/AuthContext'
import { ListContext } from '../contexts/ListContext'
import { Modal, Button } from 'react-bootstrap'
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ToastContainer, toast } from 'react-toastify';
import { db } from '../firebase/index'

const List = (props) => {
    const [sortYear, setSortYear] = useState(0)
    const [sortAlph, setSortAlph] = useState(0)
    const [sortRating, setSortRating] = useState(0)
    const { list_name, movies } = props.list
    const [show, setShow] = useState(false);
    const { currentUser } = useContext(AuthContext)
    const { getLists } = useContext(ListContext)

    const handleSortYear = () => {
        if(sortYear === 1 || sortYear === 0) {
            movies.sort((a, b) => a.release_date.slice(0, 4) - b.release_date.slice(0, 4))
            setSortYear(2)
        } else {
            movies.sort((a, b) => b.release_date.slice(0, 4) - a.release_date.slice(0, 4))
            setSortYear(1)
        }
    }

    const handleSortAlph = () => {
        if(sortAlph === 1 || sortAlph === 0) {
            movies.sort((a, b) => a.title.localeCompare(b.title))
            setSortAlph(2)
        } else {
            movies.sort((a, b) => b.title.localeCompare(a.title))
            setSortAlph(1)
        }
    }

    const handleSortRating = () => {
        if(sortRating === 1 || sortRating === 0) {
            movies.sort((a, b) => a.rating - b.rating)
            setSortRating(2)
        } else {
            movies.sort((a, b) => b.rating - a.rating)
            setSortRating(1)
        }
    }

    const handleDeleteList = () => {

        db.collection("lists").where("list_name", "==", list_name).where("user_id", "==", currentUser.uid).get()
        .then((snap) => {
            snap.forEach(doc => {
                db.collection("lists").doc(doc.id).delete().then(() => {
                    toast.success("The list was deleted!", {
                        position: "top-center",
                        autoClose: 2000,
                    });
                    setShow(false)
                    getLists()
                }).catch((error) => {
                    toast.error("Could not delete list...", {
                        position: "top-center",
                        autoClose: 2000,
                    });
                    setShow(false)
                });
            })
        }).catch((error) => {
            console.log("Error getting document:", error);
        })
    }

    return (
        <div className="movie-list">
            <h1>{list_name}</h1>
            <p onClick={() => setShow(true)}><AiOutlineCloseCircle/></p>
            <div className="list-sorting">
                <p className="sort-button" onClick={handleSortYear}>Year {sortYear === 2 && <BsArrowDownShort/>} {sortYear === 1 && <BsArrowUpShort/>}</p>
                <p className="sort-button" onClick={handleSortRating}>Rating {sortRating === 2 && <BsArrowDownShort/>} {sortRating === 1 && <BsArrowUpShort/>}</p>
                <p className="sort-button" onClick={handleSortAlph}>Abc {sortAlph === 2 && <BsArrowDownShort/>} {sortAlph === 1 && <BsArrowUpShort/>}</p>

            </div>
            <ul>

                {movies && movies.length > 0 ? (
                    <>
                        {movies.map(m => (
                            <MovieItem movie={m} list={list_name} type='edit'/>
                        ))}
                    </>
                ): (
                    <p>Add some movies</p>
                )}
                
            </ul>


            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Delete list "{list_name}"</Modal.Title>
                </Modal.Header>
                <Modal.Body>Do you really want to delete this list?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleDeleteList}>
                        Yes
                    </Button>
                    <Button variant="primary" onClick={() =>setShow(false)}>
                        No
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer/>
        </div>
    )
}

export default List
