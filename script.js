import solidAPI from "./solid-api.js";

const simply = window.simply;

let store = new solidAPI.Store();

const moviePickerApp = simply.app({
  view: {
    isLoggedIn: false,
    progress: {},
  },
  commands: {
    loadMovies: async (form, values) => {
      await moviePickerApp.actions.loadMovies(values.url);
      let movies = await moviePickerApp.actions.filterWatchedMovies();
      if (movies.length) {
        let index = Math.floor(Math.random() * movies.length);
        let suggestion = movies[index];
        moviePickerApp.view.suggestedMovie =
          await moviePickerApp.actions.getMovieData(suggestion);
      }
    },

    signin: async (el, value) => {
      moviePickerApp.actions.signin();
    },
  },

  actions: {
    start: async () => {
      moviePickerApp.view.progress.max = 10;
      moviePickerApp.view.progress.value = 0;
      await solidAPI.handleIncomingRedirect();
      if (solidAPI.isLoggedIn) {
        moviePickerApp.view.isLoggedIn = true;
      }
    },

    loadMovies: async (url) => {
      const list = await solidAPI.list(url);
      let output = document.getElementById("response");
      moviePickerApp.view.progress = {
        max: list.length,
        value: 0,
      };
      for (let movie of list) {
        await solidAPI.get(movie, store);
        moviePickerApp.view.progress.value++;
      }
    },

    filterWatchedMovies: async () => {
      let watched = [],
        unwatched = [];
      for (let q of store.match(
        null,
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        "https://schema.org/WatchAction"
      )) {
        let movieReferences = store.getQuads(
          q.subject.id,
          "https://schema.org/object"
        );
        for (let reference of movieReferences) {
          watched.push(reference.object.id);
        }
      }
      // find movies in movieStore that are not in watched,
      for (let q of store.match(
        null,
        "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
        "https://schema.org/Movie"
      )) {
        if (watched.indexOf(q.subject.id) === -1) {
          unwatched.push(q.subject.id);
        }
      }
      // @TODO: to handle multiple movie stores, find the sameAs ids and group movies together based on that
      // then add watched items by their sameAs object.id
      // then filter movies quads by checking if their sameAs object.id's are in watched
      // this may result in multiple entries for each movie

      //@TODO: what if all movies are in watched, which movie is the least watched?
      return unwatched;
    },

    getMovieData: (movieId) => {
      let fields = {
        name: "https://schema.org/name",
      };
      let result = {
        id: movieId,
      };
      for (let [name, predicate] of Object.entries(fields)) {
        let quads = [...store.match(movieId, predicate)];
        result[name] = quads.map((q) => q.object.value).pop();
      }
      return result;
    },

    signin: async () => {
      let oidcIssuer;
      if (
        (oidcIssuer = prompt("Enter your identity provider URL (oidcIssuer)"))
      ) {
        oidcIssuer = new URL(oidcIssuer, document.location.href).href;
        solidAPI.signin(oidcIssuer, document.location.href);
      }
    },
  },
});

window.moviePickerApp = moviePickerApp;

window.editor.transformers.progress = {
  render: function (data) {
    this.value = parseInt(data.value) || 0;
    this.max = parseInt(data.max) || 1;
  },
  extract: function () {
    return {
      value: this.value,
      max: this.max,
    };
  },
};

if (window.editor && window.editor.currentData) {
  moviePickerApp.actions.start();
} else {
  document.addEventListener("simply-content-loaded", () => {
    moviePickerApp.actions.start();
  });
}

