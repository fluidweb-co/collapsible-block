# Collapsible Block

[![npm version](https://badge.fury.io/js/collapsible-block.svg)](https://badge.fury.io/js/collapsible-block)
[![DragsterJS gzip size](http://img.badgesize.io/https://raw.githubusercontent.com/fluidweb-co/collapsible-block/master/dist/collapsible-block.min.js?compression=gzip
)](https://raw.githubusercontent.com/fluidweb-co/collapsible-block/master/dist/collapsible-block.min.js)

Lightweight Collapse/Expand component library.



## Installation

Setting up is pretty straight-forward. Download the js and css files from __dist__ folder and include them in your HTML:

```html
<link rel='stylesheet' id='collapsible-block'  href='dist/collapsible-block.min.css' type='text/css' media='all' />
<script type="text/javascript" src="path/to/dist/collapsible-block.min.js"></script>
```

### NPM

Collapsible Block is also available on NPM:

```sh
$ npm install collapsible-block
```



## Initialization

Once the Collapsible Block script is loaded all functions will be available through the global variable `window.CollapsibleBlock`, however to enable the components you need to call the function `init`:

Call the function `CollapsibleBlock.init( options );` passing the `options` parameter as an object.



## Options Available

The `options` parameter accept any of the available options from the default settings by passing the new values as an object. You can simply ommit the options you don't want to change the default values of.

These are the currently accepted options with their default values, if in doubt check the source code:

```js
	var _defaults = {
		elementSelector: '[data-collapsible]',
		contentElementSelector: '[data-collapsible-content]',
		handlerSelector: '[data-collapsible-handler]',

		isCollapsedClass: 'is-collapsed',
		isActivatedClass: 'is-activated',

		targetAttribute: 'data-collapsible-target',
		maxHeightAttribute: 'data-collapsible-max-height',
		createHandlerAttribute: 'data-collapsible-create-handler',
		changeStateOnResizeAttribute: 'data-collapsible-change-state-resize',

		initialState: CollapsibleBlock.states.FIRST_EXPANDED, // @see `CollapsibleBlock.states` for accepted values
		initialStateAttribute: 'data-collapsible-initial-state',

		idPrefix: 'collapsible',
		createHandler: false,
		maxHeight: 0,
		handlerTemplate: '<a href="#collapsible" role="button" data-collapsible-handler>Read more</a>',
	};
```

For example, if your application already has the markup defined in many places and you want to change the selector used for the collapsible sections, initialize the component with the options below:

```js
var options = {
	elementSelector: '[data-collapsible], .schema-faq-section',
	contentElementSelector: '[data-collapsible-content], .schema-faq-answer',
	handlerSelector: '[data-collapsible-handler], .schema-faq-question',
}
CollapsibleBlock.init( options );
```

Another use of the `options` is to translate the label text displayed as the collapsible block handler in some cases:

```js
var options = {
	handlerTemplate: '<a href="#collapsible" role="button" data-collapsible-handler>Leia mais</a>',
}
CollapsibleBlock.init( options );
```

Everything else will use the default values.


## `CollapsibleBlock.states` values accepted

When using referencing to the state of a collapsible block you can use the values exposed as `CollapsibleBlock.states` in JS, or the state's correpondent string values.

- `CollapsibleBlock.states.COLLAPSED`, string value `collapsed`: Represents the state of a collapsible block with it's content hidden.
- `CollapsibleBlock.states.EXPANDED`, string value `expanded`: Represents the state of a collapsible block with it's content visible.
- `CollapsibleBlock.states.FIRST_EXPANDED`, string value `first_expanded`: Represents the initial state of a group of collapsible blocks where the first collapsible block in the group will start in the "EXPANDED" state and all the other blocks in the same group will start as "COLLAPSED".

To set the initial state of the collapsible block individually using data attributes you will have use the correspondent string values because the JS variable will not be parsed or evaluated on html data attributes.

So use this (right way):

```html
<div class="collapsible-content" data-collapsible-content data-collapsible-initial-state="collapsed"></div>
```

Instead of this (this won't work):

```html
<div class="collapsible-content" data-collapsible-content data-collapsible-initial-state="CollapsibleBlock.states.COLLAPSED"></div>
```

See the section "Basic Usage > Using `data` attributes to change the initial state" below.



## Basic Usage

### 1. Recommended HTML elements structure

The collapsible block component requires the following HTML elements structure:

```html
<div data-collapsible>
	<a href="#" data-collapsible-handler>
		Toggle State
	</a>
	<div class="collapsible-content" data-collapsible-content>
		<div class="collapsible-content__inner">
			Content block
		</div>
	</div>
</div>
```

The element classes are not actually needed as this library does not add any css styles.


### 2. Using `data` attributes to change the initial state

Another way to change the behavior of a collapsible block component is to add data attributes to specific elements, this is useful if you want to change the properties of one instance of the collapsible block component but keep the other instances with the default options.

You can define one collapsible block element to start as `collapsed` or `expanded` using the data attribute `data-collapsible-initial-state`.

Starting as `collapsed`;
```html
<div data-collapsible>
	<a href="#" data-collapsible-handler>
		Toggle State
	</a>
	<div class="collapsible-content" data-collapsible-content data-collapsible-initial-state="collapsed">
		<div class="collapsible-content__inner">
			This content will start collapsed
		</div>
	</div>
</div>
```

Starting as `expanded`;
```html
<div data-collapsible>
	<a href="#" data-collapsible-handler>
		Toggle State
	</a>
	<div class="collapsible-content" data-collapsible-content data-collapsible-initial-state="expanded">
		<div class="collapsible-content__inner">
			This content will start expanded
		</div>
	</div>
</div>
```


### 3. Collapsible block groups

```html
<div class="collapsible-block__group">

	<div data-collapsible>
		<a href="#" data-collapsible-handler>
			Toggle State 1
		</a>
		<div class="collapsible-content" data-collapsible-content>
			<div class="collapsible-content__inner">
				Content block 1
			</div>
		</div>
	</div>

	<div data-collapsible>
		<a href="#" data-collapsible-handler>
			Toggle State 1
		</a>
		<div class="collapsible-content" data-collapsible-content>
			<div class="collapsible-content__inner">
				Content block 1
			</div>
		</div>
	</div>

	<div data-collapsible>
		<a href="#" data-collapsible-handler>
			Toggle State 1
		</a>
		<div class="collapsible-content" data-collapsible-content>
			<div class="collapsible-content__inner">
				Content block 1
			</div>
		</div>
	</div>
	
</div>
```


### 4. Targetting a collapsbile block outside of the structure

It is possible to control the state of a collapsible block even when it does not follow the recommented HTML structure.

For that you'll need to know the ID of the collapsible content element and set the data attribute `data-collapsible-target="<KNOWN_COLLAPSIBLE_CONTENT_ID>"` replacing `<KNOWN_COLLAPSIBLE_CONTENT_ID>` with the actual ID of the content element. The handler element will have a markup similar to this:

```html
<a href="#" data-collapsible-handler data-collapsible-target="collapsible-content-disconnected"></a>
```

In this case, you'll also have to set the attribute `data-collapsible` to the collapsible block content element. The content element will have a markup similar to this:

```html
<div id="collapsible-content-disconnected" data-collapsible data-collapsible-content></div>
```

Here is a full example:

```html
<div class="disconnected-handler">
	<a href="#" data-collapsible-handler data-collapsible-target="collapsible-content-disconnected">
		Toggle State
	</a>
</div>

<div id="collapsible-content-disconnected" data-collapsible data-collapsible-content>
	<div class="collapsible-content__inner">
		#collapsible-content-disconnected
	</div>
</div>
```



## Contributing to Development

This isn't a large project by any means, but you are definitely welcome to contribute.

### Development environment

Clone the repo and run [npm](http://npmjs.org/) install:

```
$ cd path/to/collapsible-block
$ npm install
```

Run the build command:

```
$ gulp build
```

Build on file save:

```
$ gulp
$ gulp watch
```


## License

Licensed under MIT.
