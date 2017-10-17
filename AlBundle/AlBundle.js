var AlBundle = {
    _bundle: {},
    _Orgs: [],
    _BidItems: [],
    _LineItems: [],
    Init: function(pBundle)
    {
        var self = this;
        self._bundle = pBundle;

        self._bundle.BidItemOrgMap = {};
        //Map BidItems to Organiza
        _.each(self._bundle.Organizations, function(org)
        {
            _.each(org.BidItems, function(bid)
            {
                if (!self._bundle.BidItemOrgMap[bid.Name])
                    self._bundle.BidItemOrgMap[bid.Name] = [];

                self._bundle.BidItemOrgMap[bid.Name].push(org);
            });
        });

        self._bundle.BidItemLineItemMap = _.groupBy(self._bundle.LineItems, function(i)
            {
                return i.BidItem.IDBidItem;
            });

        self._bundle.LineItemMap = _.keyBy(self._bundle.LineItems, 'Name');
        //console.log(self._bundle.LineItemMap);
        self._bundle.BidItemMap = _.keyBy(self._bundle.BidItems, 'Name');
        //console.log(self._bundle.BidItemMap);
        self._bundle.OrgMap = _.keyBy(self._bundle.Organizations, 'Name');
        //console.log(self._bundle.OrgMap);

        console.log(self._bundle.BidItems.length);
    },

    Reset: function()
    {
        this._Orgs = this._bundle.Organizations;
        this._BidItems = this._bundle.BidItems;
        this._LineItems = this._bundle.LineItems;
    },

    Print: function()
    {
        this.PrintItems(this._Orgs);
        this.PrintItems(this._BidItems);
        this.PrintItems(this._LineItems);
    },

    PrintItems: function(pItems)
    {
        var stuff = [];
        pItems.forEach(function(i)
        {
                // console.log(i.Name);
                stuff.push('<a href="#" class="item" on-click="fillValue(this)">' + i.Name + '</span>');
        });
        return stuff.join('<br/>');
    },

    Filter: function(pOrg, pBidItem, pLineItem)
    {
        this.Reset();

        this.FilterOrg(pOrg, pBidItem, pLineItem);
        this.FilterBidItem(pOrg, pBidItem, pLineItem);
        this.FilterLineItem(pOrg, pBidItem, pLineItem);
    },

    FilterOrg: function(pOrg, pBidItem, pLineItem)
    {
        var self = this;
        if (pLineItem)
        {
            if (self._bundle.LineItemMap[pLineItem])
            {
                pBidItem = self._bundle.LineItemMap[pLineItem].Name;
            }
            else
            {
                console.warn('Invalid LineItem, no orgs!');
                this._Orgs = [];
            }
        }
        if (pBidItem)
        {
            var tmpOrgs = this._bundle.BidItemOrgMap[pBidItem];
            this._Orgs = _.intersectionBy(this._Orgs, tmpOrgs, 'IDOrganization');
        }
        if (pOrg) {
            this._Orgs = [_.find(this._bundle.Organizations, function (o) { return o.Name === pOrg;})];
        }
    },

    FilterBidItem: function(pOrg, pBidItem, pLineItem)
    {
        var self = this;

        if (pOrg)
        {
            if (self._bundle.OrgMap[pOrg])
            {
                self._BidItems = self._bundle.OrgMap[pOrg].BidItems;
            }
            else
            {
                console.warn('Invalid Org, no BidItems!');
                self._BidItems = [];
            }
        }
        if (pLineItem)
        {
            if (self._bundle.LineItemMap[pLineItem])
            {
                self._BidItems = [ self._bundle.LineItemMap[pLineItem].BidItem ];
            }
            else
            {
                self._BidItems = [];
            }
        }
        if (pBidItem) {
            if (self._bundle.BidItemMap[pBidItem]) {
                self._BidItems = [self._bundle.BidItemMap[pBidItem]];
            }
        }
    },

    FilterLineItem: function(pOrg, pBidItem, pLineItem)
    {
        var self = this;

        if (pOrg)
        {
            if (self._bundle.OrgMap[pOrg])
            {
                self._LineItems = self._bundle.OrgMap[pOrg].LineItems;
            }
            else
            {
                console.warn('Invalid Org, no LineItems!');
                self._LineItems = [];
            }
        }
        if (pBidItem)
        {
            if (self._bundle.BidItemMap[pBidItem])
            {
                var tmpIDBidItem = self._bundle.BidItemMap[pBidItem].IDBidItem;
                self._LineItems = self._bundle.BidItemLineItemMap[tmpIDBidItem];
            }
            else
            {
                console.warn('Invalid BidItem, no LineItems!');
                self._LineItems = [];
            }
        }
        if (pLineItem) {
            if (self._bundle.LineItemMap[pLineItem]) {
                self._LineItems = [self._bundle.LineItemMap[pLineItem]];
            }
        }
    }
};
module.exports = AlBundle;
