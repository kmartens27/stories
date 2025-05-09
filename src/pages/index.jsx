import * as React from 'react';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { StaticImage, GatsbyImage, getImage } from 'gatsby-plugin-image';
import Search from '../components/SearchContainer';
import Layout from '../layout';
import Seo from '../components/Seo';
import './index.css';

const IndexPage = () => {
  const title = 'Jenkins - User Story Library';
  const { stories } = useStaticQuery(graphql`
    query FrontPageStories {
      stories: allUserStory(sort: { date: DESC }, limit: 4) {
        edges {
          node {
            title
            date(formatString: "dddd DD MMMM YYYY")
            tag_line
            authored_by
            slug
            image {
              childImageSharp {
                gatsbyImageData(width: 400, height: 200)
              }
            }
          }
        }
      }
    }
  `);

  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const sectionsRef = React.useRef([]);

  // Dark Mode Detection
  React.useEffect(() => {
    const checkDarkMode = () => {
      const darkModeMediaQuery = window.matchMedia(
        '(prefers-color-scheme: dark)',
      );
      setIsDarkMode(darkModeMediaQuery.matches);
    };
    checkDarkMode();
    const darkModeMediaQuery = window.matchMedia(
      '(prefers-color-scheme: dark)',
    );
    darkModeMediaQuery.addEventListener('change', checkDarkMode);
    return () =>
      darkModeMediaQuery.removeEventListener('change', checkDarkMode);
  }, []);

  // Scroll-triggered Animation
React.useEffect(() => {
  const appeared = new WeakSet();
  const disappeared = new WeakSet();
  const isFadingOut = new WeakMap();  
  const observer = new IntersectionObserver(

    entries => {
      entries.forEach(entry => {
        const target = entry.target;

        if (entry.isIntersecting) {
          if (!appeared.has(target) && !isFadingOut.get(target)) {
            target.classList.add('section-visible');
            appeared.add(target);
          }
        } else {
          if (appeared.has(target) && !disappeared.has(target) && !isFadingOut.get(target)) {
            target.classList.remove('section-visible');
            target.classList.add('section-hidden');
            disappeared.add(target);

            // Mark target as fading out
            isFadingOut.set(target, true);

            // Handle fade out transition till end
            const handleTransitionEnd = () => {
              target.classList.remove('section-hidden');
              target.classList.add('section-final');
              isFadingOut.delete(target); // Reset the fading-out state
              target.removeEventListener('transitionend', handleTransitionEnd);
            };

            target.addEventListener('transitionend', handleTransitionEnd);
          }
        }
      });
    },
    { threshold: 0.2 },
  );

  sectionsRef.current.forEach(section => {
    if (section) observer.observe(section);
  });

  return () => observer.disconnect();
}, []);

  return (
    <Layout title={title}>
      <Seo title={title} pathname="/" />

      {/* Hero Section */}
      <div ref={el => (sectionsRef.current[0] = el)} className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Jenkins Is The Way</h1>
          <p className="hero-subtitle">
            Explore the latest Jenkins user stories.
          </p>
          <div className="hero-buttons">
            <Link to="/all" className="hero-button">
              View All Stories
            </Link>
            <Link to="/map" className="hero-button hero-button-secondary">
              Explore Map
            </Link>
          </div>
          <StaticImage
            src="../images/Jenkins-is-the-Way-768x911.png"
            alt="Jenkins is the way logo"
            className="hero-image"
          />
        </div>
      </div>

      {/* Search Section */}
      <div ref={el => (sectionsRef.current[1] = el)}>
        <h1
          style={{
            marginTop: `3em`,
            textAlign: `center`,
            fontWeight: 700,
            color: `var(--text-color)`,
          }}
        >
          Search Jenkins Stories
        </h1>
        <div>
          <Search />
        </div>
      </div>

      {/* Stories Section */}
      <div
        ref={el => (sectionsRef.current[2] = el)}
        className="stories-section"
      >
        <h2 className="section-title">Latest Jenkins User Stories</h2>
        <p className="section-subtitle">
          Stories from all around the world by Jenkins User
        </p>

        <div className="story-cards">
          {stories.edges.map(({ node: story }) => (
            <div key={story.slug} className="story-card">
              {story.image && story.image.childImageSharp && (
                <div className="story-image-container">
                  <GatsbyImage
                    image={getImage(story.image)}
                    alt={story.title}
                    className="story-image"
                  />
                </div>
              )}
              <h3 className="story-title">
                <Link to={`/user-story/${story.slug}`}>
                  {story.tag_line || story.title}
                </Link>
              </h3>
              <p className="story-author">
                Authored By Jenkins User <strong>{story.authored_by}</strong>
              </p>
              <p className="story-date">{story.date}</p>
            </div>
          ))}
        </div>

        <div className="section-cta">
          <Link className="btn-primary" to="/all">
            Read More Stories
          </Link>
        </div>
      </div>

      {/* Map Section */}
      <div ref={el => (sectionsRef.current[3] = el)} className="map-section">
        <h2 className="section-title">Discover More</h2>
        <div className="map-content">
          <Link to="/map">
            {isDarkMode ? (
              <StaticImage
                src="../images/map_screenshot.png"
                alt="Screenshot of pins on a map"
                className="map-image"
              />
            ) : (
              <StaticImage
                src="../images/map_screenshot_light.png"
                alt="Screenshot of pins on a map"
                className="map-image"
              />
            )}
          </Link>
          <Link className="btn-primary" to="/map">
            Visit the Map
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default IndexPage;
