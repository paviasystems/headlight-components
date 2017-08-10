const chai = require('chai');
var hlClientFilter = require('../headlightClientFilter');
const assert = chai.assert;;

var testData1 = [
    {
        prop: 'IDCompany',
        qualifier: 'EQ',
        value: '1'
    },
    [
        {
            prop: 'IDRole',
            qualifier: 'EQ',
            value: '4',
            op: 'OR'
        }, {
            prop: 'FirstName',
            qualifier: 'LK',
            value: 'one',
            op: 'OR'
        },
        [
            {
                prop: 'LastName',
                qualifier: 'INN',
                values: ['one', 'two']
            }
        ]
    ]
];

var data = new hlClientFilter(testData1);

describe('hlClientFilter', function() {
    it('should return a string representation of the input data', function() {
        assert.equal(data.toString(), 'FBV~IDCompany~EQ~1~FOP~0~(~0~FBVOR~IDRole~EQ~4~FBVOR~FirstName~LK~one%25~FOP~0~(~0~FBL~LastName~INN~one,two~FCP~0~)~0~FCP~0~)~0');
    });
    it('should have 8 chunks', function() {
        assert.equal(data.chunks.length, 8);
    });
    it('should properly use \'OR\' operator', function () {
        assert.equal(data.tree.FOP.hasOwnProperty('FBVOR'), true);
    });
    it('should add wildcard (%) if qualifier is \'LK\'', function () {
        assert.equal(data.tree.FOP.FBVOR.FirstName.indexOf('%25') > -1, true);
    })
    it('~should~have~an~insane~amount~of~tildes~!', function () {
        var insaneAmount = 3;
        var tildeLength = data.toString().split('~').length;
        console.log('     has dis many', tildeLength);
        assert.equal(tildeLength > insaneAmount, true);
    });
    describe('as a tree', function() {
        it('should have 2 nested (FOP) layers', function() {
            var tempLevels = 0;
            function getLevels(level) {
                var tempKeys = Object.keys(level);
                tempKeys.forEach(function(key) {
                    if (key === 'FOP') {
                        tempLevels++;
                        getLevels(level[key]);
                    }
                });
            }
            getLevels(data.tree);

            assert.equal(tempLevels, 2);
        });
    });
});
