import test from 'ava';
import fn from './';

test('expect a string', t => {
	t.throws(() => {
		fn({});
	}, 'yearmap expects a string');
});

test('returns an array', t => {
	t.true(Array.isArray(fn('may - june')));
});

test('returns an array of twelve objects', t => {
	t.true(fn('may - september').length === 12);
});

test('creates a yearmap', t => {
	t.is(fn('may - september').toString(), '0,0,0,0,1,1,1,1,1,0,0,0');
	t.is(fn('may').toString(), '0,0,0,0,1,0,0,0,0,0,0,0');
});

test('accepts commas', t => {
	t.is(fn('may - june, august - september').toString(), '0,0,0,0,1,1,0,1,1,0,0,0');
	t.is(fn('january - february, june - august').toString(), '1,1,0,0,0,1,1,1,0,0,0,0');
});

test('responds to year-round', t => {
	t.is(fn('year round').toString(), '1,1,1,1,1,1,1,1,1,1,1,1');
	t.is(fn('year-round').toString(), '1,1,1,1,1,1,1,1,1,1,1,1');
	t.is(fn('annually').toString(), '1,1,1,1,1,1,1,1,1,1,1,1');
	t.is(fn('all year').toString(), '1,1,1,1,1,1,1,1,1,1,1,1');
	t.is(fn('annual').toString(), '1,1,1,1,1,1,1,1,1,1,1,1');
});

test('allows custom markers', t => {
	t.is(fn('year round', {onMark: 'yes'}).toString(), 'yes,yes,yes,yes,yes,yes,yes,yes,yes,yes,yes,yes');
	t.is(fn('feb - april', {offMark: 'no'}).toString(), 'no,1,1,1,no,no,no,no,no,no,no,no');
	t.is(fn('may - june', {offMark: 'no', onMark: 'yes'}).toString(), 'no,no,no,no,yes,yes,no,no,no,no,no,no');
});

test('parses modifiers', t => {
	t.is(fn('early january - late march').toString(), 'early,1,late,0,0,0,0,0,0,0,0,0');
	t.is(fn('late may - early june, end september - mid december').toString(), '0,0,0,0,late,early,0,0,end,1,1,mid');
	t.is(fn('mid may - mid june, mid september - late december').toString(), '0,0,0,0,mid,mid,0,0,mid,1,1,late');
});

test('single months', t => {
	t.is(fn('january').toString(), '1,0,0,0,0,0,0,0,0,0,0,0');
	t.is(fn('january, late february').toString(), '1,late,0,0,0,0,0,0,0,0,0,0');
	t.is(fn('january, february, december').toString(), '1,1,0,0,0,0,0,0,0,0,0,1');
	t.is(fn('january, february, march, april, may, june, july, august, september, october, november, december').toString(), '1,1,1,1,1,1,1,1,1,1,1,1');
});

test('allow any order for single months', t => {
	t.is(fn('december, january').toString(), '1,0,0,0,0,0,0,0,0,0,0,1');
	t.is(fn('december, november, october, january').toString(), '1,0,0,0,0,0,0,0,0,1,1,1');
});

