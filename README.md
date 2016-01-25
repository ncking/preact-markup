# preact-markup

[![NPM](http://img.shields.io/npm/v/preact-markup.svg)](https://www.npmjs.com/package/preact-markup)
[![travis-ci](https://travis-ci.org/developit/preact-markup.svg)](https://travis-ci.org/developit/preact-markup)

A `<Markup>` component that renders HTML or XML using Virtual DOM, mapping a set of element names to Components. Works with [Preact] (or React).

You can think of this like an HTML binding for preact, with support for Custom Elements (along the lines of Web Components) implemented as preact components.


## Use Cases

- Component-base app design and/or layout via HTML
- Define app structure using a standard HTML CMS
- Support arbitrary component extensions by allowing safe HTML
- Build using Custom Elements, implemented using React's API


---


### Overview

The `<Markup />` component takes some `markup`, an optional mapping of custom element names to `components`, and an optional `type` of either `xml` (the default) or `html`.

In it's simplest form, `<Markup />` is just a diffing XML/HTML renderer. It only re-renders when you change the `markup` prop.

```js
import Markup from 'preact-markup';

let html = `<h1>hello</h1> <p>Testing 1 2 3...</p>`;
render(<Markup markup={html} />, document.body);
```


### Custom Elements via Components

The real value of `<Markup />` is seen when passing a `components` prop. This prop is an Object that lets us map any HTML/XML element name to a preact Component. The mapped component is injected and rendered as if it had been referenced from within JSX. HTML attributes defined on the custom element in `markup` get passed to the mapped Component as `props`.

```js
import Markup from 'preact-markup';

const Sidebar = ({ title, children }) => (
	<aside class="sidebar">
		<h2>{ title }</h2>
		{ children }
	</aside>
);

let html = `
<h1>Hello, World</h1>
<sidebar title="My Sidebar!">
	<p>Sidebar contents.</p>
</sidebar>
`;
render(<Markup markup={html} components={{ Sidebar }} />, document.body);
```

When `render()` is invoked, Our `<Sidebar />` component is substituted for the `<sidebar>` element, which means it gets mounted and rendered like a normal Preact Component.  The result is this HTML DOM:

```html
<div class="markup">
	<h1>Hello, World</h1>
	<aside class="sidebar">
		<h2>My Sidebar!</h2>
		<p>Sidebar contents.</p>
	</aside>
</div>
```

Subsequent `render()`s diff against that DOM just like a normal JSX rendering flow would.


---


### License

[MIT]


[Preact]: https://github.com/developit/preact
[MIT]: http://choosealicense.com/licenses/mit/