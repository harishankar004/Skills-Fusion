import React, { useState, useEffect, useRef } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const defaultCategories = [
  'Development & IT',
  'Design & Creative',
  'AI Services',
  'Sales & Marketing',
  'Engineering & Architecture',
];

const Hero = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const userEmail = localStorage.getItem('userEmail');
  const userRole  = localStorage.getItem('userRole');

  const isFreelancer = userEmail && userRole === 'FREELANCER';
  const isClient     = userEmail && userRole === 'CLIENT';

  const [searchTerm, setSearchTerm]               = useState('');
  const [allCategories, setAllCategories]         = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [showSuggestions, setShowSuggestions]     = useState(false);

  const searchRef      = useRef(null);
  const suggestionsRef = useRef(null);

  /* 🔄 Fetch categories */
  useEffect(() => {
    fetch('http://localhost:8081/api/projects/categories')
      .then((res) => res.json())
      .then((data) =>
        setAllCategories(
          Array.isArray(data) && data.length ? data : defaultCategories
        )
      )
      .catch(() => setAllCategories(defaultCategories));
  }, []);

  /* 🖱️ Close dropdown on outside click */
  useEffect(() => {
    const handler = (e) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(e.target) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const navigateToCategory = (category) => {
    navigate(`/category?category=${encodeURIComponent(category)}`, {
      state: { category },
    });
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredCategories([]);
      setShowSuggestions(false);
      return;
    }

    const lower  = value.toLowerCase();
    const starts = allCategories.filter((c) =>
      c.toLowerCase().startsWith(lower)
    );
    const others = allCategories.filter(
      (c) =>
        !c.toLowerCase().startsWith(lower) &&
        c.toLowerCase().includes(lower)
    );
    setFilteredCategories([...starts, ...others]);
    setShowSuggestions(true);
  };

  const handleSearch = () => {
    const trimmed = searchTerm.trim();
    if (trimmed) navigateToCategory(trimmed);
  };

  return (
    <section className="hero-section">
      {/* 🎥 Video carousel */}
      <div
        id="videoCarousel"
        className="carousel slide carousel-fade"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="5000">
            <video className="d-block w-100" autoPlay muted>
              <source src="/Assets/hero.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <video className="d-block w-100" autoPlay muted>
              <source src="/Assets/hero2.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="carousel-item" data-bs-interval="5000">
            <video className="d-block w-100" autoPlay muted>
              <source src="/Assets/hero3.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
        <button
          className="carousel-control-prev"
          data-bs-target="#videoCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>
        <button
          className="carousel-control-next"
          data-bs-target="#videoCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>
      </div>

      {/* 📝 Hero content */}
      <div className="hero-content">
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#fff',
            marginTop: '20px',
          }}
        >
          Welcome to Skillsfusion
        </h1>

        {/* 🔥 Caption shown ONLY when not logged in */}
        {!userEmail && (
          <p
            style={{
              fontSize: '1.3rem',
              color: '#fff',
              marginTop: '10px',
              fontWeight: '500',
            }}
          >
            Fuel Your Passion, Upgrade Your Skills!
          </p>
        )}

        {isClient ? (
          <p
            style={{
              fontSize: '1.2rem',
              color: '#fff',
              marginTop: '10px',
            }}
          >
            Post your needs, connect with experts, and bring ideas to life—quickly and easily.
          </p>
        ) : isFreelancer ? (
          <p
            style={{
              fontSize: '1.2rem',
              color: '#fff',
              marginTop: '10px',
            }}
          >
            {t('heroSubtitle')}
          </p>
        ) : null}

        {/* 🔍 Search (freelancer only) */}
        {isFreelancer && (
          <div className="hero-search-container">
            <div className="hero-search position-relative" ref={searchRef}>
              <div className="hero-search-bar">
                <input
                  type="text"
                  placeholder={t(
                    'searchPlaceholder',
                    'Search for any service...'
                  )}
                  value={searchTerm}
                  onChange={handleChange}
                  onFocus={() =>
                    filteredCategories.length && setShowSuggestions(true)
                  }
                />
                <button onClick={handleSearch}>
                  <i className="fas fa-search"></i>
                </button>
              </div>

              {showSuggestions && (
                <ul
                  ref={suggestionsRef}
                  className="category-dropdown position-absolute bg-white border rounded shadow"
                  style={{
                    listStyle: 'none',
                    padding: 0,
                    marginTop: '5px',
                    top: '100%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    maxHeight: '220px',
                    overflowY: 'auto',
                    width: '100%',
                    zIndex: 1000,
                  }}
                >
                  {filteredCategories.map((cat) => (
                    <li
                      key={cat}
                      style={{
                        padding: '10px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee',
                      }}
                      onClick={() => navigateToCategory(cat)}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = '#f8f9fa')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = '#fff')
                      }
                    >
                      <small className="text-muted">Category</small>
                      <div className="fw-medium text-dark">{cat}</div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="hero-suggestions mt-3 d-flex gap-2 justify-content-center flex-wrap">
                <button onClick={() => navigateToCategory('Development & IT')}>
                  Development & IT →
                </button>
                <button onClick={() => navigateToCategory('Design & Creative')}>
                  Design & Creative →
                </button>
                <button onClick={() => navigateToCategory('AI Services')}>
                  AI Services →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
