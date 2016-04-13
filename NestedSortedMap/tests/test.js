var NestedSortedMap = require('./NestedSortedMap');

var tmpTierDefinitions = [
	function(pItem) { return pItem.Date; },
	function(pItem) { return pItem.Tags; }
];
var items = new NestedSortedMap(tmpTierDefinitions);

items.add({ID: 1, Date:'2015-01-01', Tags: 'junk'});
items.add({ID: 2, Date:'2015-01-01', Tags: 'stuff'});
items.add({ID: 3, Date:'2015-01-01', Tags: 'stuff'});
items.add({ID: 4, Date:'2015-01-02', Tags: 'junk'});
items.add({ID: 5, Date:'2015-01-02', Tags: 'stuff'});
items.add({ID: 6, Date:'2015-01-02', Tags: 'stuff'});
items.add({ID: 7, Date:'2015-01-01', Tags: 'junk'});

items.forEach(function(val, key)
{
	console.log(key + '=' + val);
});

console.log(JSON.stringify(items));

console.log(items.map().flatten());
