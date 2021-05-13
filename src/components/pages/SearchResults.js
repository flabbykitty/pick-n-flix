import React, { useState, useEffect } from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios';
import { useQuery } from 'react-query'
import MovieItem from '../MovieItem'
import SearchBar from '../SearchBar'
import { Button, Form } from 'react-bootstrap'

const SearchResults = () => {
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY
    const query = new URLSearchParams(useLocation().search).get('query')
    const [page, setPage] = useState(1)
    const [yearFrom, setYearFrom] = useState(null)
    const [yearTo, setYearTo] = useState(null)
	const yearRange = []

    const searchMovies = async (apiKey, query, page) => {
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&page=${page}&include_adult=false`)
        return res.data
    }

    const { data, error, isLoading, refetch } = useQuery(
        ['movies', page],
        () => searchMovies(apiKey, query, page),
        { keepPreviousData: true }
      )

    useEffect(() => {
        setPage(1)
        refetch() 
    }, [query])

    if (isLoading) {
		return (
			<h1>Loading...</h1>
		);
	}

	if (error) {
		return (
			<div className="alert alert-warning">
				<p><strong>Error message:</strong> {error.message}</p>
			</div>
		)
    }

	for (let i = 2021; i > 1900; i--) {
		yearRange.push(<option>{i}</option>)
	}
    
    return (
        <div id="search-results">
            <SearchBar/>

			{query && (
				<>
				<Form className="d-flex">
					<Form.Group controlId="selectYearFrom">
						<Form.Label>Year from</Form.Label>
						<Form.Control as="select" custom onChange={e => setYearFrom(e.target.value)}>
						{yearRange.map(s => {
							return s
						})}
						</Form.Control>
					</Form.Group>
					<Form.Group controlId="selectYearTo">
						<Form.Label>Year to</Form.Label>
						<Form.Control as="select" custom onChange={e => setYearTo(e.target.value)}>
						{yearRange.map(s => {
							return s
						})}
						</Form.Control>
					</Form.Group>
				</Form>

            	<h1>{data.total_results} {data.total_results === 1 ? 'result' : 'results'} for '{query}'</h1>

				{data.total_results > 0 && (
					<>
					<p>Page {data.page} out of {data.total_pages}</p>
					<div className="d-flex mb-3 justify-content-between">
						<Button
							onClick={() => setPage(prevPage => (data.page === 1)
									? prevPage
									: prevPage - 1)}
							disabled={data.page === 1}
							className="btn btn-outline-secondary">Previous Page</Button>

						<Button
							onClick={() => setPage(prevPage => (data.page === data.total_pages)
								? prevPage
								: prevPage + 1)}
							disabled={data.page === data.total_pages || data.total_pages === 0}
							className="btn btn-outline-secondary">Next Page</Button>
					</div>
					</>
				)}

				{data.results && (
					<>
						<div className="grid-container">
							{yearFrom && !yearTo && data.results.filter(m => m.release_date.substring(0,4) >= yearFrom).map((movie, index) => (
								<MovieItem key={index} movie={movie} />
							))}

							{yearTo && !yearFrom && data.results.filter(m => yearTo >= m.release_date.substring(0,4)).map((movie, index) => (
								<MovieItem key={index} movie={movie} />
							))}

							{yearFrom && yearTo && data.results.filter(m => yearTo >= m.release_date.substring(0,4) && m.release_date.substring(0,4) >= yearFrom).map((movie, index) => (
								<MovieItem key={index} movie={movie} />
							))}

							{(!yearFrom && !yearTo) && data.results.map((movie, index) => (
								<MovieItem key={index} movie={movie} />
							))}
						</div>
					</>
				)}

				{data.total_results > 0 && (
					<div className="d-flex mb-3 justify-content-between align-items-baseline text-center">
						<Button
							onClick={() => setPage(prevPage => (data.page === 1)
									? prevPage
									: prevPage - 1)}
							disabled={data.page === 1}
							className="btn btn-outline-secondary">Previous Page</Button>

						<p>Page {data.page} out of {data.total_pages}</p>

						<Button
							onClick={() => setPage(prevPage => (data.page === data.total_pages)
								? prevPage
								: prevPage + 1)}
							disabled={data.page === data.total_pages || data.total_pages === 0}
							className="btn btn-outline-secondary">Next Page</Button>
					</div>
				)}

				</>
			)}


			



		</div>
    )
}

export default SearchResults
