import React, { useState, useEffect } from 'react';
import './App.css';

async function searchNews(q) {
  q = encodeURIComponent(q);
  const response = await fetch(`https://bing-news-search1.p.rapidapi.com/news/search?freshness=Day&textFormat=Raw&safeSearch=Strict&q=${q}`, {
    "method": "GET",
    "headers": {
      "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
      "x-rapidapi-key": /* YOUR API KEY HERE */,
      "x-bingapis-sdk": "true"
    }
  });
  const body = await response.json();
  return body.value;
}

function App() {
  const [query, setQuery] = useState("News");
  const [list, setList] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  useEffect(() => {
    const html = document.querySelector('html');
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  const search = (e) => {
    e.preventDefault();
    searchNews(query).then(setList);
  };

  return (
    <div className={`app ${darkMode ? 'dark' : ''}`}>
      <header className={`${darkMode ? 'dark' : ''}`}>
        <h1>Cyph News</h1>
        <button className="dark-mode-button" onClick={toggleDarkMode}>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>
      <form onSubmit={search} className="search-bar">
        <input autoFocus value={query} onChange={e => setQuery(e.target.value)} />
        <button>Search</button>
      </form>

      {!list
        ? null
        : list.length === 0
          ? <p><i>No results</i></p>
          : (
            <div className="article-grid">
              {list.map((item, i) => (
                <Item key={i} item={item} darkMode={darkMode} />
              ))}
            </div>
          )
      }
    </div>
  );
}

function Item({ item, darkMode }) {
  const formatDate = s => new Date(s).toLocaleDateString(undefined, { dateStyle: 'long' });

  return (
    <div className={`article ${darkMode ? 'dark' : ''}`}>
      {item.image && (
        <div className="thumbnail">
          <img alt="" src={item.image?.thumbnail?.contentUrl} />
        </div>
      )}
      <div className="article-content">
        <h2 className={`title ${darkMode ? 'dark' : ''}`}>
          <a href={item.url}>{item.name}</a>
        </h2>
        <div className="meta">
          <span>{formatDate(item.datePublished)}</span>
          <span className="provider">
            {item.provider[0].image?.thumbnail && (
              <img
                className="provider-thumbnail"
                alt=""
                src={item.provider[0].image.thumbnail.contentUrl + '&w=16&h=16'}
              />
            )}
            {item.provider[0].name}
          </span>
          {item.category && <span>{item.category}</span>}
        </div>
        <p className={`description ${darkMode ? 'dark' : ''}`}>{item.description}</p>
      </div>
    </div>
  );
}

export default App;
