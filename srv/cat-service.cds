using com.sap as my from '../db/data-model';

service CatalogService @(path: 'Cap') {
    entity Material   as projection on my.Material;
    entity Orders     as projection on my.Orders;
    entity OrderItems as projection on my.OrderItems;
    entity Vehicle    as projection on my.Vehicle;
    entity VehicleLoad as projection on my.VehicleLoad;
    
}
