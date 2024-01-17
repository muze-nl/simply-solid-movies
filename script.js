import solidAPI from './solid-api.js'

const simply = window.simply

const moviePickerApp = simply.app({
  view: {
    urls: [],
    progress: {
      max: 10,
      value: 0
    }
  },
  commands: {
    'loadMovies': (form, values) => {
      return moviePickerApp.actions.loadMovies(values.url)
    }
  },
  actions: {
    start: async () => {
      moviePickerApp.view.progress.max = 10
      moviePickerApp.view.progress.value = 0
    },
    loadMovies: async (url) => {
      const list = await solidAPI.list(url)
      let output = document.getElementById('response')
      let store = new solidAPI.Store
      moviePickerApp.view.progress = {
        max: list.length,
        value: 0
      }
      for (let movie of list) {
        await solidAPI.get(movie, store)
        moviePickerApp.view.progress.value++
      }
      // temp debug stuff - remove
      window.folder = list
      window.movieStore = store
    },
    filterWachedMovies: async () => {
      let watched = [], unwatched = []
      for (let q of window.movieStore.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://schema.org/WatchAction')) {
        let movieReferences = window.movieStore.getQuads(q.subject.id, 'https://schema.org/object')
        for (let reference of movieReferences) {
          watched.push(reference.object.id)
        }
      }
      // find movies in movieStore that are not in watched, 
      for (let q of window.movieStore.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://schema.org/Movie')) {
        if (watched.indexOf(q.subject.id)===-1) {
          unwatched.push(q.subject.id)
        }
      }
      // @TODO: to handle multiple movie stores, find the sameAs ids and group movies together based on that
      // then add watched items by their sameAs object.id
      // then filter movies quads by checking if their sameAs object.id's are in watched
      // this may result in multiple entries for each movie
      
      //@TODO: what if all movies are in watched, which movie is the least watched?
      return unwatched
    }
  }

})

window.moviePickerApp = moviePickerApp

window.editor.transformers.progress = {
  render: function(data) {
    this.value = data.value
    this.max = data.max
  },
  extract: function() {
    return {
      value: this.value,
      max: this.max
    }
  }
}

if (window.editor && window.editor.currentData) {
  moviePickerApp.actions.start()
} else {
  document.addEventListener('simply-content-loaded', () => {
    moviePickerApp.actions.start()
  })
}