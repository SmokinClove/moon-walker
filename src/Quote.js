import React, { useState, useEffect, useCallback } from 'react';
import './Quote.css';

function useQuoteApi(initialState) {
  const [data, setData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const fetchData = useCallback(async () => {
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://cors-anywhere.herokuapp.com/https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en'
      );
      const { quoteText, quoteAuthor } = await response.json();
      setData({ quote: quoteText, author: quoteAuthor || 'Unkown' });
    } catch (err) {
      console.log(err);
      setIsError(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return [{ data, isLoading, isError }, fetchData];
}

const Loading = () => <div className="spinner" />;

const Quote = () => {
  const [{ data, isLoading, isError }, fetchData] = useQuoteApi({});

  return (
    <div className="quote-box">
      <div className="quote-content">
        {isError ? (
          <div>
            <p>Something went wrong...</p>
            <button className="btn-get-quote" onClick={fetchData}>
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <Loading className="spinner" />
        ) : (
          <div>
            <p className="quote-text">{data.quote}</p>
            <p className="quote-author">
              {data.author && <em> &mdash; {data.author}</em>}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quote;
