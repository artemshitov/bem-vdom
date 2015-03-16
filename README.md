# BEM-VDOM

BEM DSL for your [virtual DOM](https://github.com/Matt-Esch/virtual-dom).

## Installing

```
npm install bem-vdom
```

If you want to use BEM-VDOM in browser, you should use it with Browserify or any other NPM- and CommonJS-compatible module bundler you prefer. Make sure your `virtual-dom` package is at version 2.0.1 or higher.

## Usage

```js
var createElement = require('virtual-dom/createElement');

var BEM = require('bem-vdom');
var b = BEM.b;
var e = BEM.e;

var sampleBlock = b('sample', {
    size: 'large',
    useless: true,
    _title: 'An HTML title attribute'
}, [
    e('inside', {}, [
        'Some text, maybe. ',
        e('important', {_tag: 'span'}, 'Arrays for children are optional')
    ])
]);

var vdom = sampleBlock.vdom();
document.body.appendChild(createElement(vdom));
```

The example above translates to the following DOM:

```html
<div class="sample sample_size_large sample_useless" title="An HTML title attribute">
    <div class="sample__inside">
        Some text, maybe. <span class="sample__important">Arrays for children are optional</span>
    </div>
</div>
```
