import solidAPI from './solid-api.js'
import { createDB, query } from 'https://cdn.jsdelivr.net/gh/stopachka/datalogJS/src/index.js'

const simply = window.simply

const moviePickerApp = simply.app({
  view: {
    urls: [],
    progress: {}
  },
  commands: {
    'loadMovies': (form, values) => {
      return this.app.actions.loadMovies(values.url)
    }
  },
  actions: {
    start: async () => {
      debugger
      this.app.view.progress.max = 10
      this.app.view.progress.value = 0
    },
    loadMovies: async (url) => {
      const list = await solidAPI.list(url)
      let output = document.getElementById('response')
      let store = new solidAPI.Store
      this.app.view.progress = {
        total: list.length,
        value: 0
      }
      for (let movie of list) {
        await solidAPI.get(movie, store)
        this.app.view.progress.value++
      }
      // temp debug stuff - remove
      window.folder = list
      window.movieStore = store
    },
    filterWachedMovies: () => {
      let quads = [ ...window.movieStore ]
      let watched = []
      for (let q of window.movieStore.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://schema.org/WatchAction')) {
        let movieReferences = window.movieStore.getQuads(q.subject.id, 'https://schema.org/object')
        for (let reference of movieReferences) {
          watched.push(reference.object.id)
        }
      }
      // find movies in movieStore that are not in watched, 
      // to handle multiple movie stores, find the sameAs ids and group movies together based on that
      return watched
    }
  }

})

window.moviePickerApp = moviePickerApp

window.editor.transformers.progress = {
  render: function(data) {
    this.value = data.value
    this.max = data.total
  },
  extract: function() {
    return {
      value: this.value,
      total: this.max
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