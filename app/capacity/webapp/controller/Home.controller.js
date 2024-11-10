sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/base/i18n/ResourceBundle",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/v2/ODataModel",
    "sap/m/MessageBox"

],
    function (Controller, ResourceBundle, JSONModel, ODataModel, MessageBox) {
        "use strict";

        return Controller.extend("com.sap.capacity.controller.Home", {
            onInit: function () {
                // Define navigation data directly in the controller
                // Create and set the OData model
                var sServiceUrl = "/v2/odata/v4/Cap/"; // Replace with your OData service URL
                var oODataModel = new ODataModel(sServiceUrl);
                this.getView().byId("pageContainer").setModel(oODataModel, "newModel");

                /*Creating JSON Model for Header ToolBar*/
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
                            icon: "sap-icon://simulate"
                        },
                        {
                            title: "List",
                            key: "page4",
                            icon: "sap-icon://list"
                        },
                        {
                            title: "Save",
                            key: "page5",
                            icon: "sap-icon://save"
                        },

                        {
                            title: "Add Vehicle type",
                            key: "page6",
                            icon: "sap-icon://shipping-status"
                        },
                        {
                            title: "Tables",
                            key: "page7",
                            icon: "sap-icon://list"
                        }
                    ]
                };
                /**Named Model */
                var oModel = new JSONModel(oData);
                this.getView().setModel(oModel, "oJson");

                /**Payload for creating material */
                var oMatData = new JSONModel({
                    MaterialID: "",
                    Description: "",
                    UnitOfMeasure: "",
                    ShapeType: "",
                    SideLength: "",
                    Length: "",
                    Width: "",
                    Radius: "",
                    Thickness: "",
                    Volume: ""
                }
                );
                /**Setting named model */
                this.getView().setModel(oMatData, "oMaterial");
                /**For changing language */
                sap.ui.getCore().getConfiguration().setLanguage('te');

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
                let oModel = this.getOwnerComponent().getModel("oModel");
                let oBindList = oModel.bindList("/Material");
                oBindList.requestContexts().then(function (aContexts) {
                    aContexts.forEach(oContext => {
                        console.log(oContext.getObject());
                    });
                });
            },
            getMaterialData: function () {
                var oModel = this.getView().getModel("oData");
                oModel.read("/Material", {
                    success: function (oData) {
                        console.log("Fetched material data:", oData);
                        // Assuming oData.results contains an array of materials
                        var oMaterialModel = new JSONModel(oData.results);
                        this.getView().setModel(oMaterialModel, "materialModel"); // Set a new model for materials
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error fetching material data:", oError);
                    }
                });
            },
            getShapeTypes: function () {
                var oModel = this.getView().byId("pageContainer").getModel("newModel");
                oModel.read("/ShapeTypes", { // Adjust this path based on your OData service
                    success: function (oData) {
                        var oShapeTypesModel = new JSONModel(oData.value); // Assuming shape types are returned in 'value'
                        this.getView().setModel(oShapeTypesModel, "shapeTypes");
                        console.log(oData);// Set model for dropdown
                    }.bind(this),
                    error: function (oError) {
                        console.error("Error fetching shape types:", oError);
                        MessageBox.error("Failed to fetch shape types.");
                    }
                });
            },
            onCreateMaterial: function () {
                const oPayload = this.getView().getModel("oMaterial").getProperty("/"),
                    oModel = this.getView().byId("pageContainer").getModel("newModel");
                oModel.create("/Material", oPayload, {
                    success: function (odata) {
                        console.log(odata);
                        sap.m.MessageBox.success("Created Successfully");
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("Created Successfully");
                    }
                })
            },
            /** Based on Shape blocking input fields */
            onShapeChange: function (oEvent) {
                // Get the selected item from the event parameters
                var oSelectedItem = oEvent.getParameter("selectedItem");
                var sSelectedKey = oSelectedItem ? oSelectedItem.getKey() : "";

                /** Getting all references */
                var oSideLength = this.byId("_IDenIasSDnpHome"); // Side Length (for Square/Cube)
                var oLength = this.byId("_IDenIasSsdcDnpHome"); // Length (for Rectangle/Cylinder)
                var oWidth = this.byId("_IDenIsdasSsdcDnpHome"); // Width (for Rectangle)
                var oRadius = this.byId("_IDenddIsdasSsdcDnpHome"); // Radius (for Circle/Cylinder/Sphere/Cone)
                var oThickness = this.byId('_IDenddIssdasSsdcDnpHome'); // Thickness
                var oVolume = this.byId("_IDenddIssdasSsdcDnpHome1"); // Volume display

                // Define visibility settings for each shape
                var visibilitySettings = {
                    "Square": { SideLength: true, Length: false, Width: false, Radius: false, Thickness: false },
                    "Cube": { SideLength: true, Length: false, Width: false, Radius: false, Thickness: false },
                    "Rectangle": { SideLength: false, Length: true, Width: true, Radius: false, Thickness: false },
                    "Cylinder": { SideLength: false, Length: true, Width: false, Radius: true, Thickness: false },
                    "Circle": { SideLength: false, Length: false, Width: false, Radius: true, Thickness: false },
                    "Sphere": { SideLength: false, Length: false, Width: false, Radius: true, Thickness: false },
                    "Cone": { SideLength: false, Length: true, Width: false, Radius: true, Thickness: false }
                };
                if (!sSelectedKey) {
                    // If no shape is selected, show all input fields
                    oSideLength.setVisible(true);
                    oLength.setVisible(true);
                    oWidth.setVisible(true);
                    oRadius.setVisible(true);
                    oThickness.setVisible(true);
                    oVolume.setVisible(true); // Optionally show volume field as well
                    return; // Exit the function early
                }

                // Get current visibility settings based on selected shape
                var currentVisibility = visibilitySettings[sSelectedKey] || {
                    SideLength: false,
                    Length: false,
                    Width: false,
                    Radius: false,
                    Thickness: false
                };

                // Set visibility based on current settings
                oSideLength.setVisible(currentVisibility.SideLength);
                oLength.setVisible(currentVisibility.Length);
                oWidth.setVisible(currentVisibility.Width); // Corrected case
                oRadius.setVisible(currentVisibility.Radius); // Corrected case
                oThickness.setVisible(currentVisibility.Thickness); // Corrected case

            }
        });
    });
