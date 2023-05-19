sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/Sorter"
    //"sap/ui/model/Fragment"


],

    function (Controller, Filter, FilterOperator, Sorter) {
        "use strict";

        return Controller.extend("displayshipping.controller.main", {

            onInit: function () {
                this.byId("shipmentsNotDeliveredButton").setPressed(true);
                this.byId("shipmentsDeliveredButton").setEnabled(false);

            },

            onViewDeliveredShipmentsPress: function () {
                var shipmentsNotDeliveredButton = this.byId("shipmentsNotDeliveredButton");
                var shipmentsDeliveredButton = this.byId("shipmentsDeliveredButton");

                // Cambia el estado de los botones
                shipmentsNotDeliveredButton.setPressed(false);
                shipmentsDeliveredButton.setPressed(true);

                // Habilita el botón de envíos no entregados y deshabilita el botón de envíos entregados
                shipmentsNotDeliveredButton.setEnabled(true);
                shipmentsDeliveredButton.setEnabled(false);

                // Aplica el filtro para mostrar solo los envíos entregados
                this.filterShipmentsByDeliveryStatus(true);


                // Obtiene la referencia a la tabla de envíos de la vista actual
                var oTable = this.getView().byId("shipping_table");
                // Obtiene la referencia al enlace de datos de la tabla
                var oBinding = oTable.getBinding("items");
                // Aplica un filtro al enlace de datos para mostrar solo los envíos entregados
                oBinding.filter([new Filter("Entregado", FilterOperator.EQ, true)]);


            },

            onViewShipmentsNotDelivered: function () {
                var shipmentsNotDeliveredButton = this.byId("shipmentsNotDeliveredButton");
                var shipmentsDeliveredButton = this.byId("shipmentsDeliveredButton");

                // Cambia el estado de los botones
                shipmentsNotDeliveredButton.setPressed(true);
                shipmentsDeliveredButton.setPressed(false);

                // Habilita el botón de envíos entregados y deshabilita el botón de envíos no entregados
                shipmentsNotDeliveredButton.setEnabled(false);
                shipmentsDeliveredButton.setEnabled(true);

                // Aplica el filtro para mostrar solo los envíos no entregados
                this.filterShipmentsByDeliveryStatus(false);

                // Obtiene la referencia a la tabla de envíos de la vista actual
                var oTable = this.getView().byId("shipping_table");
                // Obtiene la referencia al enlace de datos de la tabla
                var oBinding = oTable.getBinding("items");
                // Aplica un filtro al enlace de datos para mostrar solo los envíos no entregados
                oBinding.filter([new Filter("Entregado", FilterOperator.EQ, false)]);

            },
            filterShipmentsByDeliveryStatus: function (isDelivered) {
                var oTable = this.getView().byId("shipping_table");
                var oBinding = oTable.getBinding("items");

                // Aplica un filtro al enlace de datos para mostrar los envíos según su estado de entrega
                oBinding.filter([new Filter("Entregado", FilterOperator.EQ, isDelivered)]);
            },



            onSearch: function () {

                // Obtiene la referencia a la vista actual

                var oView = this.getView();
                // Obtiene el valor del campo de búsqueda

                var sValue = oView.byId("searchField").getValue();
                // Crea un filtro basado en el valor del campo de búsqueda

                var oFilter = new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.EQ, sValue);
                // Obtiene la referencia a la tabla de envíos de la vista actual

                var oTable = oView.byId("shipping_table");
                // Obtiene el enlace de datos de la tabla

                var oBinding = oTable.getBinding("items");
                // Aplica el filtro al enlace de datos utilizando el tipo de filtro de aplicación

                oBinding.filter([oFilter], sap.ui.model.FilterType.Application);
                // Adjunta un evento "dataReceived" al enlace de datos para manejar la respuesta una vez recibidos los datos

                oBinding.attachEventOnce("dataReceived", function () {
                    // Obtiene los elementos actuales del enlace de datos

                    var aItems = oBinding.getCurrentContexts();

                    // Si no se encontraron elementos, muestra un mensaje de que no se encontraron envíos

                    if (aItems.length === 0) {
                        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                        var sMessage = oResourceBundle.getText("noShipmentsFound");
                        sap.m.MessageToast.show(sMessage);
                    }
                }.bind(this));
            },

            onInsertDialogClose: function () {
                // Restablece el valor del campo de entrada "inputId" a vacío

                this.byId("inputId").setValue("");
            },

            onOpenDialogPress: function () {
                // Obtiene la referencia al diálogo de inserción

                var oDialog = this.byId("insertDialog");
                // Abre el diálogo de inserción

                oDialog.open();
            },

            onInsertDialogCancel: function () {


                // Cierra el diálogo de inserción
                this.byId("insertDialog").close();
            },

            onRefresh: function () {
                var oTable = this.byId("shipping_table");
                oTable.getBinding("items").refresh();
            },






            /*
                        _openDialog: function (sName, sPage, fInit) {
                            var oView = this.getView();
            
                            if (!this._mDialogs[sName]) {
                                this._mDialogs[sName] = Fragment.load({
                                    id: oView.getId(),
                                    name: "display_shipping.view.fragment." + sName,
                                    controller: this
                                }).then(function (oDialog) {
                                    oView.addDependent(oDialog);
                                    if (fInit) {
                                        fInit(oDialog);
                                    }
                                    return oDialog;
                                });
                            }
                            this._mDialogs[sName].then(function (oDialog) {
                                oDialog.open(sPage);
                            });
                        },
            
                        */
            open_dialogue: function () {
                if (!this.oSerieDialog) {

                    this.oSerieDialog = sap.ui.xmlfragment("fiori.robot.pt.robotpt.view.fragment.serie", this);

                    this.getView().addDependent(this.oSerieDialog);

                }

                this.oSerieDialog.open();
            },














            handleConfirm: function (oEvent) {
                var oTable = this.getView().byId("shipping_table");
                var oBinding = oTable.getBinding("items");
                var mParams = oEvent.getParameters();
                var sPath = mParams.sortItem.getKey();
                var bDescending = mParams.sortDescending;
                var aSorters = [];
                aSorters.push(new sap.ui.model.Sorter(sPath, bDescending));
                oBinding.sort(aSorters);
            },

            handleCancel: function (oEvent) {
                // Handle cancel event of the dialog
            },
            onScanSuccess: function (oEvent) {
                if (oEvent.getParameter("cancelled")) {
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                    var sMessage = oResourceBundle.getText("scanCancelled");
                    MessageToast.show("Scan cancelled", { duration: 1000 });
                } else {
                    if (oEvent.getParameter("text")) {
                        var scannedId = oEvent.getParameter("text");
                        this.onInsertDialogConfirm(scannedId);
                    } else {
                        var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                        var sMessage = oResourceBundle.getText("emptyScanText");
                        sap.m.MessageToast.show(sMessage, { duration: 1000 });
                    }
                }
            },
            onScanError: function (oEvent) {
                MessageToast.show("Scan failed: " + oEvent, { duration: 1000 });
            },


            onPress: function (oEvent) {
                var oItem = oEvent.getSource();
                var oRouter = this.getOwnerComponent().getRouter();
                oRouter.navTo("shipping_details", {
                    context: oItem.getBindingContext().getPath().substr(1)
                });
            },
            onInsertDialogConfirm: function (sId) {
                var sId = this.byId("inputId").getValue();
                var oModel = this.getView().getModel();

                if (oModel && sId) {
                    var sPath = "/Envios('" + sId + "')";

                    oModel.read(sPath, {
                        success: function (oData) {
                            var oEnvio = oData;

                            if (oEnvio) {
                                if (oEnvio.Entregado === true) {
                                    sap.m.MessageToast.show("El envío ya está marcado como entregado.");
                                } else {
                                    oEnvio.Entregado = true;
                                    oModel.update(sPath, oEnvio, {
                                        success: function () {
                                            sap.m.MessageToast.show("El envío se ha marcado como entregado correctamente.");
                                            var sIdConductor = oEnvio.idConductor;

                                            if (sIdConductor) {
                                                var sConductorPath = "/Conductor('" + sIdConductor + "')";

                                                oModel.read(sConductorPath, {
                                                    success: function (oData) {
                                                        var oConductor = oData;

                                                        if (oConductor) {
                                                            oConductor.Ocupado = false;
                                                            oModel.update(sConductorPath, oConductor, {
                                                                success: function () {
                                                                    sap.m.MessageToast.show("El estado del conductor ha sido actualizado correctamente.");
                                                                },
                                                                error: function () {
                                                                    sap.m.MessageToast.show("Error al actualizar el estado del conductor.");
                                                                }
                                                            });
                                                        } else {
                                                            sap.m.MessageToast.show("No se ha encontrado un conductor con el ID especificado.");
                                                        }
                                                    },
                                                    error: function () {
                                                        sap.m.MessageToast.show("Error al leer el conductor.");
                                                    }
                                                });
                                            }

                                            var sMatricula = oEnvio.Matricula;

                                            if (sMatricula) {
                                                var sVehiculoPath = "/Vehiculos('" + sMatricula + "')";

                                                oModel.read(sVehiculoPath, {
                                                    success: function (oData) {
                                                        var oVehiculo = oData;

                                                        if (oVehiculo) {
                                                            oVehiculo.Ocupado = false;
                                                            oModel.update(sVehiculoPath, oVehiculo, {
                                                                success: function () {
                                                                    sap.m.MessageToast.show("El estado del vehículo ha sido actualizado correctamente.");
                                                                },
                                                                error: function () {
                                                                    sap.m.MessageToast.show("Error al actualizar el estado del vehículo.");
                                                                }
                                                            });
                                                        } else {
                                                            sap.m.MessageToast.show("No se ha encontrado un vehículo con la matrícula especificada.");
                                                        }
                                                    },
                                                    error: function () {
                                                        sap.m.MessageToast.show("Error al leer el vehículo.");
                                                    }
                                                });
                                            }
                                        },
                                        error: function () {
                                            sap.m.MessageToast.show("Error al actualizar el envío.");
                                        }
                                    });
                                }
                            } else {
                                sap.m.MessageToast.show("No se ha encontrado un envío con el ID especificado.");
                            }
                        },
                        error: function (error) {
                            sap.m.MessageToast.show("Error al leer el envío.");
                            console.error("Error al leer el envío:", error);
                        }
                    });
                }
            }

        });
    });
