import solidAPI from './solid-api.js'

const simply = window.simply

const moviePickerApp = simply.app({
  view: {
    urls: []
  },
  commands: {
    'loadMovies': (form, values) => {
      return moviePickerApp.actions.loadMovies(values.url)
    }
  },
  actions: {
    loadMovies: async (url) => {
      let list = await solidAPI.list(url)
      window.folder = list
      let output = document.getElementById('response')
      let store = new solidAPI.Store
      moviePickerApp.view.progress = {
        total: list.length,
        value: 0
      }
      for (let movie of list) {
        moviePickerApp.view.progress.value++
        await solidAPI.get(movie, store)
      }
      window.movieStore = store
    },
    filterWachedMovies: () => {
      let watched = []
      let movieSubject
      for (let q of window.movieStore.match(null, 'http://www.w3.org/1999/02/22-rdf-syntax-ns#type', 'https://schema.org/WatchAction')) {
        movieSubject = window.movieStore.getQuads(q.subject.id, 'https://schema.org/object')[0].object.id
        watched.push(movieSubject.substr(0,movieSubject.indexOf('#')))
      }
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