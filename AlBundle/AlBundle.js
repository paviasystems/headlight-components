var AlBundle = {
    _integrity: {

    },
    _bundle: {},
    _Orgs: [],
    _BidItems: [],
    _LineItems: [],
    _Equipment: [],
    Init: function(pBundle)
    {
        var self = this;
        console.log('Bundle -- init with bundle', pBundle);

        self._bundle = pBundle;

        self._bundle.BidItemOrgMap = {};
        self._bundle.EquipmentOrgMap = {};
        //Map BidItems to Organizations
        _.each(self._bundle.Organizations, function(org)
        {
            _.each(org.BidItems, function(bid)
            {
                if (!self._bundle.BidItemOrgMap[bid.Name])
                    self._bundle.BidItemOrgMap[bid.Name] = [];

                self._bundle.BidItemOrgMap[bid.Name].push(org);
            });

            _.each(org.Equipment, function(equip)
            {
                if (!self._bundle.EquipmentOrgMap[equip.Name])
                    self._bundle.EquipmentOrgMap[equip.Name] = [];

                self._bundle.EquipmentOrgMap[equip.Name].push(org);
            });
        });

        self._bundle.BidItemLineItemMap = _.groupBy(self._bundle.LineItems, function(i)
            {
                if (i.BidItem) {
                    return i.BidItem.IDBidItem;
                }
            });

        self._bundle.LineItemMap = _.keyBy(self._bundle.LineItems, 'Name');
        //console.log(self._bundle.LineItemMap);
        self._bundle.BidItemMap = _.keyBy(self._bundle.BidItems, 'Name');
        //console.log(self._bundle.BidItemMap);
        self._bundle.OrgMap = _.keyBy(self._bundle.Organizations, 'Name');
        //console.log(self._bundle.OrgMap);

        // self._bundle.EquipmentMap = _.keyBy(self._bundle.Equipment, 'Name');
        //console.log(self._bundle.Equipment.length);

        // verify integrity of Maps and bundle
        _.each(self._bundle, function (data, key) {
            if (key.toLowerCase().indexOf('map') > -1) {
                if (!Object.keys(data).length) {
                    self._integrity[key] = false;
                } else {
                    self._integrity[key] = true;
                }
            }
        });
        // console.log('Integrity', self._integrity);

    },

    Reset: function()
    {
        this._Orgs = this._bundle.Organizations;
        this._BidItems = this._bundle.BidItems;
        this._LineItems = this._bundle.LineItems;
        this._Equipment = this._bundle.Equipment;
    },

    Print: function()
    {
        this.PrintItems(this._Orgs);
        this.PrintItems(this._BidItems);
        this.PrintItems(this._LineItems);
        this.PrintItems(this._Equipment);
    },

    PrintItems: function(pItems)
    {
        pItems.forEach(function(i)
        {
            console.log(i.Name);
        });
    },

    Filter: function(pOrg, pBidItem, pLineItem, pEquipment)
    {
        this.Reset();

        this.FilterOrg(pOrg, pBidItem, pLineItem, pEquipment);
        this.FilterBidItem(pOrg, pBidItem, pLineItem, pEquipment);
        this.FilterLineItem(pOrg, pBidItem, pLineItem, pEquipment);
        this.FilterEquipment(pOrg, pBidItem, pLineItem);
    },

    FilterOrg: function(pOrg, pBidItem, pLineItem, pEquipment)
    {
        var self = this;
        if (pLineItem)
        {
            if (self._bundle.LineItemMap[pLineItem] && self._bundle.LineItemMap[pLineItem].BidItem)
            {
                pBidItem = self._bundle.LineItemMap[pLineItem].BidItem.Name;
            }
            else
            {
                console.warn('Invalid LineItem, no worky!');
                this._Orgs = [];
            }
        }
        if (pBidItem)
        {
            var bidOrgs = this._bundle.BidItemOrgMap[pBidItem];
            this._Orgs = _.intersectionBy(this._Orgs, bidOrgs, 'IDOrganization');
        }
        if (pEquipment)
        {
            if (self._bundle.EquipmentOrgMap[pEquipment])
            {
                var eqOrgs = this._bundle.EquipmentOrgMap[pEquipment];
                this._Orgs = _.intersectionBy(this._Orgs, eqOrgs, 'IDOrganization');
            }
            else
            {
                console.warn('Invalid Equipment, no orgs!');
                this._Orgs = [];
            }
        }
    },

    FilterBidItem: function(pOrg, pBidItem, pLineItem, pEquipment)
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
        } else if (pEquipment) {
            // find org then you'll have lineItems
            if (self._bundle.EquipmentOrgMap[pEquipment])
            {
                var eqOrgs = this._bundle.EquipmentOrgMap[pEquipment];
                // this._LineItems = _.intersectionBy(this._Orgs, eqOrgs, 'IDOrganization');
                self._BidItems = [];
                _.each(eqOrgs, function (org) {
                    self._BidItems = self._BidItems.concat(org.BidItems);
                });
            }
            else
            {
                console.warn('Couldn\'t Org based on that Equipment');
                this._BidItems = [];
            }

        }
    },

    FilterLineItem: function(pOrg, pBidItem, pLineItem, pEquipment)
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
                self._LineItems = [];
            }
        } else if (pEquipment) {
            // find org then you'll have lineItems
            if (self._bundle.EquipmentOrgMap[pEquipment])
            {
                var eqOrgs = this._bundle.EquipmentOrgMap[pEquipment];
                // this._LineItems = _.intersectionBy(this._Orgs, eqOrgs, 'IDOrganization');
                self._LineItems = [];
                _.each(eqOrgs, function (org) {
                    self._LineItems = self._LineItems.concat(org.LineItems);
                });
            }
            else
            {
                console.warn('Couldn\'t Org based on that Equipment');
                this._LineItems = [];
            }

        }
    },

    FilterEquipment: function(pOrg, pBidItem, pLineItem)
    {
        var self = this;

        if (pOrg)
        {
            if (self._bundle.OrgMap[pOrg])
            {
                self._Equipment = self._bundle.OrgMap[pOrg].Equipment;
            }
            else
            {
                console.warn('Invalid Org, no Equipment!');
                self._Equipment = [];
            }
        } else {
            if (pBidItem || pLineItem) {
                // If we have a bidItem filter check the org map first
                self.FilterOrg(undefined, pBidItem, pLineItem);
                console.log(self._Orgs);
                if (self._Orgs.length) {
                    self._Equipment = [];
                    _.each(self._Orgs, function (org) {
                        self._Equipment = self._Equipment.concat(org.Equipment);
                    });
                }
            } else {
                self._Equipment = [];

                _.each(self._bundle.OrgMap, function(pOrg)
                    {
                        self._Equipment = self._Equipment.concat(pOrg.Equipment);
                    });
            }
        }

    }
};
module.exports = AlBundle;
