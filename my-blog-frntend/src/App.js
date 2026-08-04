import './App.css';
import HomePage from './pages/HomePage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Component } from 'react';
import AboutPage from './pages/AboutPage';
import ArticlePage from './pages/ArticlePage';
import NavBar from './NavBar';
import Article from './pages/article';
import articleContent from './pages/article-content';

class App extends Component {
  render() {
    return (
      <Router>
        <div id="page-body">
          <div className="App">
            <NavBar />

            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/article"
                element={<Article articles={articleContent} />}
              />
              <Route
                path="/article/:name"
                element={<ArticlePage />}
              />
            </Routes>
          </div>
        </div>
      </Router>
    );
  }
}

export default App;