import { useState } from "react";
import "./App.css";

interface Repository {
  id: number;
  full_name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
}

function App() {
  const [query, setQuery] = useState("");
  const [repos, setRepos] = useState<Repository[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState(false);

  const fetchRepos = async (pageNumber = 1) => {
    if (!query) return;

    // setData(true);
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://api.github.com/search/repositories?q=${query}&page=${pageNumber}&per_page=10`,
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();
      setRepos(data.items);

      console.log("data>>>", data);

      if (data.items.length) {
        setData(true);
      }

      setPage(pageNumber);
    } catch (err) {
      setError("err>>>");
    } finally {
      setLoading(false);
      setData(true);
    }
  };

  return (
    <div className="container">
      <h1>GitHub Repository Search</h1>
      {/* search input */}
      <div>
        <input
          type="text"
          placeholder="Search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={() => fetchRepos()}>Search</button>
      </div>

      <ul className="list">
        {repos.map((repo) => (
          <li key={repo.id} className="item">
            <p className="title">{repo.full_name}</p>
            <p>{repo.description}</p>
          </li>
        ))}
      </ul>

      {data && (
        <div className="pagination">
          <button disabled={page === 1} onClick={() => fetchRepos(page - 1)}>
            Previous
          </button>

          <span>{page}</span>

          <button onClick={() => fetchRepos(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}
export default App;
