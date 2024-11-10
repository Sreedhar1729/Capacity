namespace com.sap;

//Defining shapes
type ShapeTypes : String enum {
    Square;
    Rectangle;
    Cube;
    Cylinder;
    Sphere;
    Cone;
}

//defining material entity
entity Material {
    key MaterialID    : String; // Unique identifier for the material
        Description   : String; // Description of the material
        UnitOfMeasure : String; // Unit of measure (e.g., kg, liters)
        ShapeType     : String enum {
            Square;
            Rectangle;
            Cube;
            Cylinder;
            Sphere;
            Cone;
            Circle;
        }; // Shape Type: can be 'Square', 'Rectangle', 'Cube', 'Cylinder', 'Sphere', or 'Cone'
        SideLength    : Decimal(10, 2); // Length of one side in millimeters (for squares and cubes)
        Length        : Decimal(10, 2); // Length in millimeters (for rectangles and cylinders)
        Width         : Decimal(10, 2); // Width in millimeters (for rectangles)
        Radius        : Decimal(10, 2); // Radius in millimeters (for cylinders, spheres, and cones)
        Thickness     : Decimal(10, 2); // Thickness in millimeters (for rectangular shapes)
        Volume        : Decimal(10, 2); // Volume of the material
}

/**defining orders entity */
entity Orders {
    key id           : UUID; // Unique identifier for each order
        orderDate    : Date; // Date when the order was placed
        customerName : String; // Name of the customer
        status       : String; // Current status of the order (e.g., Pending, Completed)
        Items        : Composition of many OrderItems
                           on Items.order = $self; // Relationship to OrderItems
}

/**definiing orderitems */
entity OrderItems {
    key id       : UUID; // Unique identifier for each order item
        order    : Association to Orders; // Reference to the associated order
        material : Association to Material; // Reference to the material being ordered
        quantity : Integer; // Quantity of the material ordered
}

entity Vehicle {
    key id           : UUID; // Unique identifier for each vehicle
        licensePlate : String; // License plate number of the vehicle
        type         : String; // Type of vehicle (e.g., Truck, Van)
        capacity     : Integer; // Maximum capacity of the vehicle (e.g., weight limit)
}

/** Defining VehicleLoad entity */
entity VehicleLoad {
    key id             : UUID; // Unique identifier for each vehicle load entry
        vehicle        : Association to Vehicle; // Reference to the associated vehicle
        orderItem      : Association to OrderItems; // Reference to the associated order item
        loadedQuantity : Integer; // Quantity of the order item loaded into the vehicle
}
