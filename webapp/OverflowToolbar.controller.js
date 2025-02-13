sap.ui.define([
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/Filter',
		'sap/ui/model/FilterOperator',
		'sap/ui/model/Sorter',
		'sap/ui/model/json/JSONModel',
		'sap/ui/model/odata/v2/ODataModel',
		'sap/m/MessageToast',
		'sap/m/MenuItem'
	], function(Controller, Filter, FilterOperator, Sorter, JSONModel, ODataModel, MessageToast, MenuItem) {
	"use strict";

	var OverflowToolbarController = Controller.extend("sap.m.sample.OverflowToolbarFooter.OverflowToolbar", {

		onInit : function (evt) {
			// OData model setup using AJAX
			var oDataUrl = "http://localhost:8081/OData/V1.0/products";
			$.ajax({
				url: oDataUrl,
				dataType: "json",
				success: function(data) {
					console.log("data : ", data)
					var oODataModel = new JSONModel(data.value); // Use data.value to match the structure expected by the view
					this.getView().setModel(oODataModel);
				}.bind(this),
				error: function() {
					MessageToast.show("Error loading OData Model.");
				}
			});

			this.bGrouped = false;
			this.bDescending = false;
			this.sSearchQuery = 0;
		},

		onSliderMoved: function (oEvent) {
			var iValue = oEvent.getParameter("value");
			this.byId("otbSubheader").setWidth(iValue + "%");
			this.byId("otbFooter").setWidth(iValue + "%");
		},

		_fnGroup : function (oContext){
			var sSupplierName = oContext.getProperty("SupplierName");

			return {
				key : sSupplierName,
				text : sSupplierName
			};
		},

		onReset: function (oEvent){
			this.bGrouped = false;
			this.bDescending = false;
			this.sSearchQuery = 0;
			this.byId("maxPrice").setValue("");

			this.fnApplyFiltersAndOrdering();
		},

		onGroup: function (oEvent){
			this.bGrouped = !this.bGrouped;
			this.fnApplyFiltersAndOrdering();
		},

		onSort: function (oEvent) {
			this.bDescending = !this.bDescending;
			this.fnApplyFiltersAndOrdering();
		},

		onFilter: function (oEvent) {
			this.sSearchQuery = oEvent.getSource().getValue();
			this.fnApplyFiltersAndOrdering();
		},

		onTogglePress: function(oEvent) {
			var oButton = oEvent.getSource(),
				bPressedState = oButton.getPressed(),
				sStateToDisplay = bPressedState ? "Pressed" : "Unpressed";

			MessageToast.show(oButton.getId() + " " + sStateToDisplay);
		},

		fnApplyFiltersAndOrdering: function (oEvent){
			var aFilters = [],
				aSorters = [];

			if (this.bGrouped) {
				aSorters.push(new Sorter("SupplierName", this.bDescending, this._fnGroup));
			} else {
				aSorters.push(new Sorter("Name", this.bDescending));
			}

			if (this.sSearchQuery) {
				var oFilter = new Filter("Name", FilterOperator.Contains, this.sSearchQuery);
				aFilters.push(oFilter);
			}

			this.byId("idProductsTable").getBinding("items").filter(aFilters).sort(aSorters);
		},

		onDefaultActionAccept: function() {
			MessageToast.show("Default action triggered");
		},
		onBeforeMenuOpen: function (evt) {
			MessageToast.show("beforeMenuOpen is fired");
		},
		onPress: function (evt) {
			MessageToast.show(evt.getSource().getId() + " Pressed");
		},
		onMenuAction: function(oEvent) {
			var oItem = oEvent.getParameter("item"),
				sItemPath = "";

			while (oItem instanceof MenuItem) {
				sItemPath = oItem.getText() + " > " + sItemPath;
				oItem = oItem.getParent();
			}

			sItemPath = sItemPath.substring(0, sItemPath.lastIndexOf(" > "));

			MessageToast.show("Action triggered on item: " + sItemPath);
		}
	});

	return OverflowToolbarController;

});
