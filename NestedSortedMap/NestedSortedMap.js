var SortedMap = require("collections/sorted-map");

function NestedSortedMap(fTierDefinitions)
{
	this._tierDefinitionFunctors = fTierDefinitions;
	this._baseMap = new SortedMap();
	this._count = 0;
}
NestedSortedMap.prototype.add = function(pItem)
{
	this._count++;
	return this.addToTier(pItem, 0, this._baseMap);
}
NestedSortedMap.prototype.addToTier = function(pItem, pTier, pMapRef)
{
	//1. If we're at final tier, add to array
	if (pTier === this._tierDefinitionFunctors.length)
	{
		pMapRef.push(pItem);
		return;
	}

	//2. Else, find or create map, recurse to next tier
	var tmpKey = this._tierDefinitionFunctors[pTier](pItem);
	var tmpMapItem = pMapRef.get(tmpKey);
	if (!tmpMapItem)
	{
		if (pTier < this._tierDefinitionFunctors.length-1)
		{
			console.log('Creating inner map ' + tmpKey);
			tmpMapItem = new SortedMap();
		}
		else
		{
			console.log('Creating leaf array ' + tmpKey);
			tmpMapItem = new Array();
		}

		pMapRef.set(tmpKey, tmpMapItem);
	}

	return this.addToTier(pItem, pTier+1, tmpMapItem);
}
NestedSortedMap.prototype.forEach = function(fMethod)
{
	this._baseMap.forEach(fMethod);
}
NestedSortedMap.prototype.count = function()
{
  return this._count;
}
NestedSortedMap.prototype.baseMap = function()
{
	return this._baseMap;
}
NestedSortedMap.prototype.toMapDesc = function()
{
  var tmpOutputMap = {};
  var baseKeys = this._baseMap.keys();
  for(var i=baseKeys.length-1; i>=0; i--)
  {
    var key = baseKeys[i];
    tmpOutputMap[key] = this.toMap(this._baseMap.get(key));
  }
  return tmpOutputMap;
}
NestedSortedMap.prototype.toMap = function(node)
{
  if (!node) node = this._baseMap;
  if (Array.isArray(node))
    return node;
    
  var tmpOutputMap = {};
  var _self = this;
  node.keys().forEach(function(key)
  {
    tmpOutputMap[key] = _self.toMap(node.get(key));
  });
	return tmpOutputMap;
}

module.exports = NestedSortedMap;