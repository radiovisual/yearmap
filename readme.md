# yearmap [![Build Status](https://travis-ci.org/radiovisual/yearmap.svg?branch=master)](https://travis-ci.org/radiovisual/yearmap)

> Convert month ranges into a 12-month year map. `may - july` → `[0,0,0,0,0,1,1,1,0,0,0]`

This module helps you take text-based month ranges, and convert them into parsable data arrays in the form of 12-month year maps.
You can pass comma-delimited months and/or hyphenated month ranges. Hyphens are treated like a range, so yearmap reads
`may - july` as: `may, june, july`, and commas are used to separate the ranges and/or single months. See the [tests](test.js) for examples.
Yearmap defaults to a binary-style map, but you can customize this behavior.

## Install

```
$ npm install --save yearmap
```

## Usage

```js
const yearmap = require('yearmap');

yearmap('may - september');
//=> [0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0);

yearmap('january, february, december')
//=> [1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1');

yearmap('may - june, august - september')
//=> [0, 0, 0, 0, 1, 1, 0, 1, 1, 0, 0, 0');
```

If your string contains the followings keyword: `year|annual` then yearmap prints out the full year automatically:

```js
yearmap('year-round');
//=> [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
```
You can also pass time modifiers like `early, late, mid, end` to the month ranges, and the modifiers will be printed 
to the yearmap:

```js
yearmap('late may - early june, end september - mid december');
//=> [0, 0, 0, 0, 'late', 'early', 0, 0, 'end', 1, 1, 'mid'];
```

Optionally, you can change the way yearmap marks the 'on months' and 'off months':

```js
yearmap('december - february, may, june', {onMark:'yup', offMark: 'nope'});
//=> ['yup', 'yup', 'nope', 'nope', 'yup', 'yup', 'nope', 'nope', 'nope', 'nope', 'nope', 'nope']
```

## API

### yearmap(input, [options])

#### input

Type: `string`

The string containing month(s) or month ranges.

#### options

##### offMark

Type: `string|number`<br>
Default: `0`

The value you want to use when the month value is 'off'.

##### onMark

Type: `string|number`<br>
Default: `1`

The value you want to use when the month value is 'on'.

## License

MIT © [Michael Wuergler](http://numetriclabs.com)
