function hlClientFilter (inputValues) {
    this._input = inputValues;
    this.chunks = [];
    this.tree = {};
    this.map = function (value, FOP) {
        var me = this;
        return Array.prototype.map.call(value, function (a, index, ogvalues) {
            // Nesting
            if (typeof a === 'object' && a.length) {

                if (!FOP.FOP) {
                    FOP.FOP = {};
                }
                me.chunks.push('FOP~0~(~0');
                me.map(a, FOP.FOP);
                me.chunks.push('FCP~0~)~0');
            } else {

                var filterType;

                if (a.values && a.values.length) {
                    filterType = 'FBL';
                } else {
                    filterType = 'FBV'
                }
                if (a.op && a.op.toLowerCase() === 'or') {
                    filterType += 'OR';
                }
                // Handle wildcards for LK qualifier
                if (a.qualifier === 'LK') {
                    a.value += encodeURIComponent('%');
                    // if FBL/INN can use wildcards handle that here too
                }
                var filter = [filterType, a.prop, a.qualifier, (a.value || a.values.join(','))];
                if (!FOP[filterType]) {
                    FOP[filterType] = {};
                }

                FOP[filterType][a.prop] = [a.qualifier, (a.value || a.values.join(','))].join('~');

                me.chunks.push(filter.join('~'));
            }
        });
    }

    if (this._input) {
        this.map(this._input, this.tree);
    }
    return this;
}

hlClientFilter.prototype.toString = function () {
    if (this.chunks.length) {
        return this.chunks.join('~');
    } else if (!this._input){
        throw new Error('no input');
    }
}

module.exports = hlClientFilter;
