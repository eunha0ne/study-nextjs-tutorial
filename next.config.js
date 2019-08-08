const fetch = require('isomorphic-unfetch');

module.exports = {
  exportPathMap: async function() {
    const paths = {
      '/': { page: '/' },
      '/about': { page: '/about' }
    };
    const res = await fetch('https://api.tvmaze.com/search/shows?q=batman');
    const data = await res.json();
    const shows = data.map(entry => entry.show);

    // The page /show/[id] will then use the query object to get the id and fetch more info about the show.
    shows.forEach(show => {
      paths[`/show/${show.id}`] = { page: '/show/[id]', query: { id: show.id } };
    });

    return paths;
  }
};