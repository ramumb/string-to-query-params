string-to-query-params(query, separator)
========================================

[![Build Status](https://travis-ci.org/ramumb/string-to-query-params.svg?branch=master)](https://travis-ci.org/ramumb/string-to-query-params)
[![Coverage Status](https://coveralls.io/repos/github/ramumb/string-to-query-params/badge.svg?branch=master)](https://coveralls.io/github/ramumb/string-to-query-params?branch=master)

This is a port of the [PrototypeJS](http://prototypejs.org/) method `toQueryParams`.
It parses a URI-like query string and returns an object composed of parameter/value pairs.

`string-to-query-params` is realy targeted at parsing query strings (hence the
default value of `"&"` for the separator argument).  For this reason, it does not
consider anything that is either before a question mark (which signals the
beginning of a query string) or beyond the hash symbol (`"#"`), and runs
`decodeURIComponent()` on each parameter/value pair.

`string-to-query-params` also aggregates the values of identical keys into an
array of values.

Note that parameters which do not have a specified value will be set to undefined.

## Installation

  `npm install string-to-query-params`

## Usage

    toQueryParams('section=blog&id=45');
    // -> {section: 'blog', id: '45'}
    
    toQueryParams('section=blog;id=45', ';');
    // -> {section: 'blog', id: '45'}
    
    toQueryParams('http://www.example.com?section=blog&id=45#comments');
    // -> {section: 'blog', id: '45'}
    
    toQueryParams('section=blog&tag=javascript&tag=prototype&tag=doc');
    // -> {section: 'blog', tag: ['javascript', 'prototype', 'doc']}
    
    toQueryParams('tag=ruby%20on%20rails');
    // -> {tag: 'ruby on rails'}
    
    toQueryParams('id=45&raw');
    // -> {id: '45', raw: undefined}

## Tests

  `npm test`

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding
style. Add unit tests for any new or changed functionality. Lint and test your
code.  See the [CONTRIBUTING](CONTRIBUTING.md) file for more detailed information.
