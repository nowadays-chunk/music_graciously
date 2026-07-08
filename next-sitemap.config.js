const fs = require('fs');
const path = require('path');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://www.musicgraciously.com',
  generateRobotsTxt: true,
  additionalPaths: async (config) => {
    const jsonPath = path.join(__dirname, 'public', 'sitemap-paths.json');
    if (!fs.existsSync(jsonPath)) {
      console.warn('Warning: sitemap-paths.json not found. Run path generation script first.');
      return [];
    }
    
    try {
      const rawData = fs.readFileSync(jsonPath, 'utf8');
      const paths = JSON.parse(rawData);
      
      return paths.map((route) => {
        // Assign a higher priority for homepage, key landing pages, etc.
        let priority = 0.7;
        let changefreq = 'weekly';
        
        if (route === '/') {
          priority = 1.0;
          changefreq = 'daily';
        } else if (
          route === '/play' || 
          route === '/store' || 
          route === '/compose' || 
          route === '/articles' ||
          route === '/references'
        ) {
          priority = 0.9;
          changefreq = 'daily';
        }
        
        return {
          loc: route,
          changefreq,
          priority,
          lastmod: new Date().toISOString(),
        };
      });
    } catch (err) {
      console.error('Error generating additional sitemap paths:', err);
      return [];
    }
  },
};
