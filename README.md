# Solid Movie Picker

This glitch showcases a very basic Solid Application. Solid is a framework to build decentralized web applications, 
see [https://solidproject.org/](https://solidproject.org/) for more information.

It also shows how to use [SimplyEdit](https://simplyedit.io/) and [SimplyView](https://reference.simplyedit.io/simplyview/) to create a web application.

The application assumes you have a Solid Data POD, and you have used [mediaKraken](https://noeldemartin.github.io/media-kraken/login) to create a folder with movies in your data pod.
mediaKraken is a web application that supports solid data pods. You can find the [source code on github](https://github.com/NoelDeMartin/media-kraken), and the author has also made [some talks about the development of the app](https://www.youtube.com/watch?app=desktop&v=cajBTJXmKhA).

So to use this glitch:

1. create a Solid Data POD, e.g. at [Inrupt.com](https://start.inrupt.com/profile)
2. start [mediaKraken](https://noeldemartin.github.io/media-kraken/login) and connect it to your pod
3. enter a few movies - keep it under 20 for performance reasons
4. click on a few of those to tag them as 'watched'
5. open your solid data pod and find the movies/ folder, copy its URL
6. load the glitch index.html and enter your movies url, press load movies.

Depending on how many movies you imported with mediaKraken, this can take a while.

Then this glitch application will select a random movie that you haven't watched.

## Structure of the application

1. index.html

This contains the skeleton HTML, and loads the required scripts. The `script.js` file contains the application code.

The HTML skeleton contains placeholders for data, e.g.:

```
<h1 data-simply-field="suggestedMovie.title">title</h1>
```

HTML tags with a data-simply-field attribute can be updated in the javascript code, see below.

2. script.js

This creates an application (`simply.app()`) with `commands` and `actions`.
A command ties a user interface element (say a button or form) with code in the application. So here the HTML contains:

```
<form data-simply-command="loadMovies">
```

And in the application code, there is a command named `loadMovies`:

```
const moviePickerApp = simply.app({
  ...,
  commands: {
    loadMovies: async (form, values) => {
      ...
    }
  }
})
```

Now when you submit the form, the loadMovies command function is called. It then handles the form inputs.

Updating variable fields in the application HTML is done by setting a view variable. E.g. the `suggestedMovie.title` field is set in the loadMovies command:

```
  moviePickerApp.view.suggestedMovie = await moviePickerApp.actions.getMovieData(suggestion)
```

You don't need to re-render the application, or manualy update the HTML. By setting the `data-simply-field` attribute,
and updating the field with the same name in the application view, the HTML is updted automatically.

3. solid-api.js

This is the low level code that allows the application to talk to solid pods and to parse [linked data formats like turtle](https://medium.com/wallscope/understanding-linked-data-formats-rdf-xml-vs-turtle-vs-n-triples-eb931dbe9827).

It loads the [solid-client-authn-browser](https://github.com/inrupt/solid-client-authn-js/) code from inrupt, using the skypack cdn. Skypack makes sure we can actually use this code in the browser, without having to create our own bundle.

It then loads the [N3 javascript library](https://github.com/rdfjs/N3.js), to do the actual parsing of the linked data stored inside the solid pod.

## Linked Data and Turtle

Solid Data PODs support any RDF (Linked Data) format. But Turtle (text/turtle) is required. So this app only asks for data in the Turtle format.

Turtle is a more human readable/writable format for triples. Each line in a turtle file is a set of triples. A line ends with a `.`

```
<#it> a schem:Movie .
```

Triples are made up out of a Subject, a Predicate and an Object. Each of these is a URI (basically a URL), except Objects. These can also be Literalsm e.g. a string, number or boolean.

To prevent having to type subjects again and again, turtle allows you to create additional triples with the same subject by appending a `;`

```
<#it> a schem:Movie ;
      schem:name "2001: A Space Odyssey" .
```

And if you want to duplicate the predicate as well, you can use a `,`:

```
<#it> a schem:Movie ;
      schem:name "2001: A Space Odyssey"
      schem:sameAs "https://www.imdb.com/title/tt0062622",
        "https://www.themoviedb.org/movie/62".
```

Subject and Predicate URI's are encoded starting with a `<` and ending in a `>`, unless you use a prefix that you defined earlier:

```
@prefix schem: <https://schema.org/>.
```

Prefixes are a literal substitution. To get the full URL of a prefixed version, e.g. from `schem:name`, you replace `schem:` with
the full URL `https://schema.org/`, so it becomes `https://schema.org/name`

## You built this with Glitch!

[Glitch](https://glitch.com) is a friendly community where millions of people come together to build web apps and websites.

- Need more help? [Check out our Help Center](https://help.glitch.com/) for answers to any common questions.
- Ready to make it official? [Become a paid Glitch member](https://glitch.com/pricing) to boost your app with private sharing, more storage and memory, domains and more.
