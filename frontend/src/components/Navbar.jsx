import React, { useState } from 'react';
import { UserButton } from "@clerk/clerk-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';
import './Navbar.css'

function Navbar({ setSearchQueryProp }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQueryProp(searchInput.trim()); // Update the search query in the parent component
    navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`); // Navigate to the search results page if needed
    setSearchInput(''); // Clear the search input after submitting
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">IntelliTask</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/createtask">Create Task</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" aria-current="page" href="/alltask">View Task</a>
              </li>
            </ul>
            <form className="d-flex" onSubmit={handleSearch}>
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <button className="btn btn-outline-success btn-custom" type="submit">Search</button>
            </form>
          </div>
          <div className='signin-btn' >
            {!user ? (
              <div className="nav-item">
                <button
                  onClick={() => navigate('/sign-in')} className="h-4 w-4 text-black ml-2" size="sm" variant="premium" >
                  Sign In
                </button>
              </div>
            ) : (
              <div className="nav-item-signin">
                <UserButton />
                  {user.fullName ? user.fullName : 'Loading...'}
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Navbar;
