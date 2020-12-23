import React, {useState, useEffect} from 'react'
import {useLocation} from 'react-router-dom'
import axios from 'axios';
import {useQuery} from 'react-query'
import MovieItem from '../MovieItem'
import SearchBar from '../SearchBar'
import {Button} from 'react-bootstrap'

const SearchResults = () => {
    const apiKey = process.env.REACT_APP_THE_MOVIE_DB_API_KEY;
    const query = new URLSearchParams(useLocation().search).get('query')
    const [page, setPage] = useState(1)

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
    
    return (
        <div className="search-results">
            <SearchBar/>
			
            <h1>{data.total_results} {data.total_results === 1 ? 'result' : 'results'} for '{query}'</h1>
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
            {data && (
                <>
                    <div>
                        {data.results.map((movie, index) => (
                            <div key={index}>
                                <MovieItem movie={movie} />
                            </div>
                        ))}
                    </div>
                </>
            )}
		</div>
    )
}

export default SearchResults
