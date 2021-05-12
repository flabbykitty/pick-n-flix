import React, { useState } from 'react'
import MovieItem from './MovieItem'
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";

const List = (props) => {
    const [sortYear, setSortYear] = useState(0)
    const [sortAlph, setSortAlph] = useState(0)
    const [sortRating, setSortRating] = useState(0)
    const { list_name, movies } = props.list

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

    return (
        <div className="movie-list">
            <h1>{list_name}</h1>
            <div className="list-sorting">
                <p onClick={handleSortYear}>Year {sortYear === 2 && <BsArrowDownShort/>} {sortYear === 1 && <BsArrowUpShort/>}</p>
                <p onClick={handleSortRating}>Rating {sortRating === 2 && <BsArrowDownShort/>} {sortRating === 1 && <BsArrowUpShort/>}</p>
                <p onClick={handleSortAlph}>Abc {sortAlph === 2 && <BsArrowDownShort/>} {sortAlph === 1 && <BsArrowUpShort/>}</p>

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
        </div>
    )
}

export default List
