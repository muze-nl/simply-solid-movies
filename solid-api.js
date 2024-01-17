import {
  fetch,
  getDefaultSession,
} from "https://cdn.skypack.dev/pin/@inrupt/solid-client-authn-browser@v2.0.0-3Py1cpWfOrpxuIlTz5M2/dist=es2019,mode=imports/optimized/@inrupt/solid-client-authn-browser.js";
import {
  Store,
  Parser,
} from "https://cdn.skypack.dev/pin/n3@v1.12.0-JyCuQEtqH88WU0Kn0PZm/mode=imports,min/optimized/n3.js";

const solidAPI = {
  getCleanURL: (url) => {
    let cleanURL = new URL(url);
    cleanURL.hash = "";
    return cleanURL.href;
  },
  fetch: async (url, params) => {
    params = Object.assign(
      {
        mode: "cors",
        headers: {
          Accept: "text/turtle",
        },
      },
      params
    );
    let response = await fetch(url, params);
    if (response.ok) {
      return response.text();
    } else {
      throw new Error(response.status + ": " + response.statusText);
    }
  },
  parse: (url, text) => {
    const cleanURL = solidAPI.getCleanURL(url);
    const parser = new Parser({ blankNodePrefix: "", baseIRI: cleanURL });
    const data = parser.parse(text);
    return new Store(data);
  },
  list: async (url) => {
    const turtle = await solidAPI.fetch(url);
    const data = solidAPI.parse(url, turtle);
    let result = [];
    for (let quad of data.match(url, "http://www.w3.org/ns/ldp#contains")) {
      result.push(quad.object.id);
    }
    return result;
  },
  get: async (url, store = null) => {
    if (!store) {
      store = new Store();
    }
    const turtle = await solidAPI.fetch(url);
    const data = solidAPI.parse(url, turtle);
    for (let quad of data) {
      store.add(quad);
    }
    return data.size;
  },
  Store: Store,
};

export default solidAPI;
