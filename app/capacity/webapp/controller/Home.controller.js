 
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/i18n/ResourceBundle",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel"

],
function (Controller,ResourceBundle,JSONModel,ODataModel) {
    "use strict";

    return Controller.extend("com.sap.capacity.controller.Home", {
        onInit: function () {
           // Define navigation data directly in the controller
           var oData = {
            selectedKey: "page2",
            navigation: [
                {
                    title: "Add Product",
                    key: "page1",
                    icon: "sap-icon://add-product" 
                },
                {
                    title: "Simulation",
                    key: "page2",
                    icon:"sap-icon://simulate"
                },
                {
                    title: "List",
                    key: "page4",
                    icon:"sap-icon://list"
                },
                {
                    title: "Save",
                    key: "page5",
                    icon:"sap-icon://save"
                },
               
                {
                    title: "Add Vehicle type",
                    key: "page6",
                    icon:"sap-icon://shipping-status"
                },
                {
                    title: "Tables",
                    key:"page7",
                    icon:"sap-icon://list"
                }
            ]
        };

        var oModel = new JSONModel(oData);
        this.getView().setModel(oModel);

        // Device.media.attachHandler(this._handleMediaChange, this);
        // this._handleMediaChange();
        },
        onCreate:function(){
            // var id = this.byId("idinput1").getValue();
            // var plate = this.byId("idinput2").getValue();
            // var type = this.byId("idinput3").getValue();
            // var capacity = this.byId("idinput4").getValue();
            // var oModel = this.getView().getModel();
            // var that = this;
            // var olist = oModel.bindList("/Vehicle")
            // var oResourceModel = this.getView().getModel("i18n");
            // olist.create({
            //     id:id,
            //     licensePlate:plate,
            //     type:type,
            //     capacity:capacity
            // })
            //  // submit chanages
            //  oModel.submitBatch("id").then(function(){
            //     sap.m.MessageToast.show("created successfully");
               
            // }).catch(function(oError){
            //     sap.m.MessageToast.show("error");
            //     console.log(oError);
                 
            // })

        },
        onItemSelect: function (oEvent) {
            var oItem = oEvent.getParameter("item").getKey();
            var navContainer = this.getView().byId("pageContainer");

            switch (oItem) {
                case "page1":
                    navContainer.to(this.getView().createId("page1"));
                    break;
                case "page2":
                    navContainer.to(this.getView().createId("page2"));
                    break;
                case "page3":
                    navContainer.to(this.getView().createId("page3"));
                    break;
                case "page4":
                    navContainer.to(this.getView().createId("page4"));
                    break;
                case "page5":
                    navContainer.to(this.getView().createId("page5"));
                    break;
                case "page6":
                    navContainer.to(this.getView().createId("page6"));
                    break;
                case "page7":
                    navContainer.to(this.getView().createId("page7"));
                    break;
                default:
                    break;
            }
        },
        onadd: function (oEvent) {
            let oModel = this.getOwnerComponent().getModel();
            let oBindList = oModel.bindList("/Material");
            oBindList.requestContexts().then(function (aContexts) {
                aContexts.forEach(oContext => {
                    console.log(oContext.getObject());
                });
            });
        }
    });
});
