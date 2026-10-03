import { Link } from 'react-router-dom';

import {
  Sprout,
  CloudSun,
  Bug,
  IndianRupee,
  Landmark,
  Stethoscope,
  ArrowRight
} from 'lucide-react';

const services = [
  {
    icon: Sprout,
    title: 'Crop Advisory',
    text: 'Personalized guidance for crop selection, sowing, irrigation and harvesting.',
    path: '/crop-advisory'
  },
  {
    icon: CloudSun,
    title: 'Weather Advisory',
    text: 'Weather insights and farming alerts to help plan daily field activities.',
    path: '/weather'
  },
  {
    icon: Bug,
    title: 'Disease Detection',
    text: 'Analyze crop images and get information about possible diseases and prevention.',
    path: '/disease-detection'
  },
  {
    icon: IndianRupee,
    title: 'Mandi Prices',
    text: 'Compare crop prices and make better decisions about where to sell.',
    path: '/mandi-prices'
  },
  {
    icon: Landmark,
    title: 'Government Schemes',
    text: 'Discover agricultural schemes, subsidies, benefits and eligibility information.',
    path: '/government-schemes'
  },
  {
    icon: Stethoscope,
    title: 'Expert Advice',
    text: 'Get practical answers to farming questions from an advisory platform.',
    path: '/expert-advice'
  }
];

export default function Home() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="app">

      {/* NAVBAR */}
      <header className="navbar">

        <Link to="/" className="brand">
          <div className="brand-mark">
            <Sprout size={22} />
          </div>

          <div>
            <strong>Kisan Setu</strong>
            <span>Smart Agriculture</span>
          </div>
        </Link>

        <nav>
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('home');
            }}
          >
            Home
          </a>

          <a
            href="#services"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('services');
            }}
          >
            Services
          </a>

          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('about');
            }}
          >
            About
          </a>

          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('contact');
            }}
          >
            Contact
          </a>
        </nav>

        <div className="nav-actions">

          <Link to="/login" className="btn btn-outline">
            Login
          </Link>

          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>

        </div>
      </header>


      {/* MAIN */}
      <main>

        {/* HERO */}
        <section id="home" className="hero">

          <div className="hero-content">

            <div className="eyebrow">
              <span>🌱</span>
              Technology for smarter farming
            </div>

            <h1>
              Smart Advice.
              <br />
              <em>Better Farming.</em>
            </h1>

            <p>
              Kisan Setu connects farmers with crop guidance,
              weather insights, market information, government
              schemes and smart agricultural services — all in one place.
            </p>

            <div className="hero-actions">

              <Link
                to="/crop-advisory"
                className="btn btn-primary btn-large"
              >
                Explore Advisory
                <ArrowRight size={18} />
              </Link>

              <button
                className="btn btn-ghost btn-large"
                onClick={() => scrollToSection('services')}
              >
                Explore Services
              </button>

            </div>

            <div className="hero-stats">

              <div>
                <strong>6+</strong>
                <span>Smart Services</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Digital Access</span>
              </div>

              <div>
                <strong>1</strong>
                <span>Connected Platform</span>
              </div>

            </div>

          </div>


          <div className="hero-visual">

            <div className="field-card">

              <div className="sun">☀️</div>

              <div className="weather-mini">
                <strong>28°C</strong>
                <span>Good day for field work</span>
              </div>

              <div className="crop-lines">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i}></span>
                ))}
              </div>

              <div className="floating-card">

                <Sprout size={20} />

                <div>
                  <strong>Crop Health</strong>
                  <span>Looking healthy</span>
                </div>

                <b>92%</b>

              </div>

            </div>

          </div>

        </section>


        {/* SERVICES */}
        <section id="services" className="section services">

          <div className="section-heading">

            <div>
              <span className="eyebrow">
                OUR SERVICES
              </span>

              <h2>
                Everything a farmer needs,
                <br />
                <em>in one place.</em>
              </h2>
            </div>

            <p>
              From choosing the right crop to understanding
              the market, Kisan Setu brings essential agricultural
              information together.
            </p>

          </div>


          <div className="service-grid">

            {services.map(
              ({ icon: Icon, title, text, path }) => (

                <article
                  className="service-card"
                  key={title}
                >

                  <div className="service-icon">
                    <Icon size={23} />
                  </div>

                  <h3>{title}</h3>

                  <p>{text}</p>

                  <Link
                    to={path}
                    className="service-link"
                  >
                    Learn more
                    <ArrowRight size={15} />
                  </Link>

                </article>

              )
            )}

          </div>

        </section>


        {/* ABOUT */}
        <section id="about" className="section about">

          <div className="about-panel">

            <div>

              <span className="eyebrow">
                WHY KISAN SETU
              </span>

              <h2>
                Bridging the gap between
                <em> farmers and technology.</em>
              </h2>

            </div>

            <p>
              Our goal is simple: make useful agricultural
              information easier to understand, easier to access
              and easier to act on. Kisan Setu is designed as a
              digital companion for modern farming.
            </p>

            <div className="check-list">

              <span>✓ Crop-focused recommendations</span>

              <span>✓ Weather-aware decisions</span>

              <span>✓ Market and scheme information</span>

              <span>✓ Farmer-friendly digital experience</span>

            </div>

          </div>

        </section>


        {/* CTA */}
        <section id="contact" className="cta">

          <div>

            <span className="eyebrow">
              START FARMING SMARTER
            </span>

            <h2>
              Your farm. Your data.
              <em> Better decisions.</em>
            </h2>

            <p>
              Explore the Kisan Setu platform and bring smarter
              agricultural information into your daily farming decisions.
            </p>

          </div>

          <Link
            to="/register"
            className="btn btn-light btn-large"
          >
            Get Started
            <ArrowRight size={18} />
          </Link>

        </section>

      </main>


      {/* FOOTER */}
      <footer>

        <Link to="/" className="brand">

          <div className="brand-mark">
            <Sprout size={20} />
          </div>

          <div>
            <strong>Kisan Setu</strong>
            <span>Smart Agriculture</span>
          </div>

        </Link>

        <p>
          Smart technology for better farming.
        </p>

        <span>
          © 2026 Kisan Setu
        </span>

      </footer>

    </div>
  );
}