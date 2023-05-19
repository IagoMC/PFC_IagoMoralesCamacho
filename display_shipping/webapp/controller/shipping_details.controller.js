sap.ui.define([
  "sap/ui/core/mvc/Controller",
  "sap/ui/core/routing/History"
], function(Controller, History) {
  "use strict";

  return Controller.extend("displayshipping.controller.shipping_details", {
    onInit: function() {
      var oRouter = this.getOwnerComponent().getRouter();
      oRouter.getRoute("shipping_details").attachPatternMatched(this._onObjectMatched, this);
    },

    _onObjectMatched: function(oEvent) {
      var sIDEnvio = oEvent.getParameter("arguments").context;
      this.getView().bindElement({
        path: "/" + sIDEnvio
      });
      this._createAssociatedPackagesTable(sIDEnvio);
    },
    
    _createAssociatedPackagesTable: function(sIDEnvio) {
      var oTable = this.getView().byId("packagesTable");
      var oBinding = oTable.getBinding("items");
      if (oBinding) {
        var oFilter = new sap.ui.model.Filter("idEnvio", sap.ui.model.FilterOperator.EQ, sIDEnvio);
        oBinding.filter([oFilter]);
      }
    },
    
    onNavBack: function() {
      var oHistory = History.getInstance();
      var sPreviousHash = oHistory.getPreviousHash();
      if (sPreviousHash !== undefined) {
        window.history.go(-1);
      } else {
        var oRouter = this.getOwnerComponent().getRouter();
        oRouter.navTo("home", {}, true);
      }
    }
  });
});