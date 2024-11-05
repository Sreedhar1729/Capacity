sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
function (Controller) {
    "use strict";

    return Controller.extend("com.sap.capacity.controller.Home", {
        onInit: function () {

        },
        onCreate:function(){
            var id = this.byId("idinput1").getValue();
            var plate = this.byId("idinput2").getValue();
            var type = this.byId("idinput3").getValue();
            var capacity = this.byId("idinput4").getValue();
            var oModel = this.getView().getModel();
            var that = this;
            var olist = oModel.bindList("/Vehicle")

            olist.create({
                id:id,
                licensePlate:plate,
                type:type,
                capacity:capacity
            })
             // submit chanages
             oModel.submitBatch("id").then(function(){
                sap.m.MessageToast.show("created successfully");
               
            }).catch(function(oError){
                sap.m.MessageToast.show("error");
                console.log(oError);
                 
            })

        }
    });
});
