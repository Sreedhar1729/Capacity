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
                    // Volume: ""
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
                const oPmodel = this.getView().getModel("oMaterial"),
                    oPayload = oPmodel.getProperty("/");

                /** Formatting the entered values */
                const formatValue = (value) => {
                    if (typeof value === 'string') {
                        return value ? parseFloat(value.replace(',', '.')).toFixed(2) : "0.00";
                    } else if (typeof value === 'number') {
                        return value.toFixed(2);
                    } else {
                        return "0.00";
                    }
                };

                // Formatting all values using the helper function
                const oSideLength = formatValue(oPayload.SideLength);
                const oLength = formatValue(oPayload.Length);
                const oWidth = formatValue(oPayload.Width);
                const oRadius = formatValue(oPayload.Radius);
                const oThickness = formatValue(oPayload.Thickness);
                const oShape = this.byId("idshapes").getSelectedItem().getKey();

                // Calculate Volume using the onVolume function
                const calculatedVolume = this.onVolume(oShape, oSideLength, oLength, oWidth, oRadius, oThickness);

                // Assign calculated volume to payload
                oPayload.Volume = calculatedVolume;

                // Passing formatted data back to the payload
                oPayload.SideLength = oSideLength;
                oPayload.Length = oLength;
                oPayload.Width = oWidth;
                oPayload.Radius = oRadius;
                oPayload.Thickness = oThickness;
                oPayload.ShapeType = oShape;

                const oModel = this.getView().byId("pageContainer").getModel("newModel");
                var that = this;
                /** Creating material data */
                oModel.create("/Material", oPayload, {
                    success: function (odata) {
                        console.log(odata);
                        sap.m.MessageBox.success("Created Successfully");

                        // Clear input fields after successful creation
                        oPmodel.setProperty("/", {
                            MaterialID: "",
                            Description: "",
                            UnitOfMeasure: "",
                            ShapeType: "",
                            SideLength: "",
                            Length: "",
                            Width: "",
                            Radius: "",
                            Thickness: "",
                            // Volume: ""
                        });
                        // Reset the selected shape in the UI
                        that.byId("idshapes").setSelectedKey("");
                        that.onShapeChange();
                    },
                    error: function (oError) {
                        sap.m.MessageBox.error("Error creating material"); // Corrected error message
                    }
                });
            },
            /** Based on Shape blocking input fields */
            onShapeChange: function () {
                // Get the selected item from the event parameters
                var oSelectedItem = this.byId("idshapes").getSelectedItem();
                var sSelectedKey = oSelectedItem ? oSelectedItem.getKey() : "";

                /** Getting all references */
                var oSideLength = this.byId("_IDenIasSDnpHome"); // Side Length (for Square/Cube)
                var oLength = this.byId("_IDenIasSsdcDnpHome"); // Length (for Rectangle/Cylinder)
                var oWidth = this.byId("_IDenIsdasSsdcDnpHome"); // Width (for Rectangle)
                var oRadius = this.byId("_IDenddIsdasSsdcDnpHome"); // Radius (for Circle/Cylinder/Sphere/Cone)
                var oThickness = this.byId('_IDenddIssdasSsdcDnpHome'); // Thickness
                // var oVolume = this.byId("_IDenddIssdasSsdcDnpHome1"); // Volume display

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
                    // oVolume.setVisible(true); // Optionally show volume field as well
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
            },
            onVolume: function (shapeType, sideLength, length, width, radius, thickness) {
                let volume = 0;

                switch (shapeType) {
                    case "Square":
                        volume = Math.pow(parseFloat(sideLength), 2); // Area
                        break;
                    case "Rectangle":
                        volume = parseFloat(length) * parseFloat(width); // Area
                        break;
                    case "Cube":
                        volume = Math.pow(parseFloat(sideLength), 3); // Volume
                        break;
                    case "Cylinder":
                        volume = Math.PI * Math.pow(parseFloat(radius), 2) * parseFloat(length); // Volume
                        break;
                    case "Sphere":
                        volume = (4 / 3) * Math.PI * Math.pow(parseFloat(radius), 3); // Volume
                        break;
                    case "Cone":
                        volume = (1 / 3) * Math.PI * Math.pow(parseFloat(radius), 2) * parseFloat(length); // Volume
                        break;
                    case "Circle":
                        volume = Math.PI * Math.pow(parseFloat(radius), 2); // Area
                        break;
                    case "Rectangular Prism": // Example for using thickness
                        volume = parseFloat(length) * parseFloat(width) * parseFloat(thickness); // Volume with thickness
                        break;
                    default:
                        volume = 0; // Default case if shape is not recognized
                        break;
                }

                return volume.toFixed(2); // Return formatted volume
            }
        });
    });
