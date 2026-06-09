export default async function handler(req, res) {
  try {
    // Fallback to local if env is not defined, typically available in Vercel.
    const apiUrl = process.env.VITE_API_URL || 'http://localhost:5000/api';
    
    // Determine the frontend URL dynamically
    const protocol = req.headers['x-forwarded-proto'] || 'https';
    const host = req.headers['x-forwarded-host'] || req.headers.host || 'travelbharat.in';
    const frontendUrl = `${protocol}://${host}`;

    // Helper to fetch data safely
    const fetchData = async (endpoint, dataKey) => {
      try {
        const response = await fetch(`${apiUrl}${endpoint}?limit=5000`);
        if (!response.ok) return [];
        const json = await response.json();
        if (json.data && Array.isArray(json.data[dataKey])) {
          return json.data[dataKey];
        }
        return [];
      } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
      }
    };

    // Fetch lists
    const [states, cities, places, festivals, blogs] = await Promise.all([
      fetchData('/states', 'states'),
      fetchData('/cities', 'cities'),
      fetchData('/places', 'places'),
      fetchData('/festivals', 'festivals'),
      fetchData('/blogs', 'blogs'),
    ]);

    // Start constructing the XML
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${frontendUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${frontendUrl}/states</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${frontendUrl}/cities</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${frontendUrl}/places</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${frontendUrl}/festivals</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${frontendUrl}/blogs</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${frontendUrl}/plan</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${frontendUrl}/about</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${frontendUrl}/contact</loc>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>${frontendUrl}/privacy-policy</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>${frontendUrl}/terms-of-service</loc>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>`;

    // Helper to add URLs
    const addUrl = (path, priority = 0.6) => {
      sitemap += `
  <url>
    <loc>${frontendUrl}${path}</loc>
    <priority>${priority}</priority>
  </url>`;
    };

    if (Array.isArray(states)) {
      states.forEach(state => {
        if (state.slug) addUrl(`/states/${state.slug}`, 0.9);
      });
    }

    if (Array.isArray(cities)) {
      cities.forEach(city => {
        if (city.slug) {
          const stateSlug = city.stateId?.slug || city.state?.slug || 'state';
          addUrl(`/states/${stateSlug}/cities/${city.slug}`, 0.8);
        }
      });
    }

    if (Array.isArray(places)) {
      places.forEach(place => {
        if (place.slug) {
          // Backward compatibility route is safer if state/city slugs are nested differently
          addUrl(`/places/${place.slug}`, 0.7);
        }
      });
    }

    if (Array.isArray(festivals)) {
      festivals.forEach(festival => {
        if (festival.slug) addUrl(`/festivals/${festival.slug}`, 0.7);
      });
    }

    if (Array.isArray(blogs)) {
      blogs.forEach(blog => {
        if (blog.slug) addUrl(`/blogs/${blog.slug}`, 0.7);
      });
    }

    sitemap += `\n</urlset>`;

    res.setHeader('Content-Type', 'text/xml');
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');
    res.status(200).send(sitemap);
  } catch (err) {
    console.error('Sitemap generation error:', err);
    res.status(500).send('Error generating sitemap');
  }
}
