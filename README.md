# BurgerAPI Project Documentation
 
## Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Models](#models)
4. [Database Context](#database-context)
5. [Controllers](#controllers)
   - [BurgersController](#burgerscontroller)
   - [CartsController](#cartscontroller)
   - [OrderItemsController](#orderitemscontroller)
   - [OrdersController](#orderscontroller)
   - [PhoneNumbersController](#phonenumberscontroller)
6. [Authentication](#authentication)
7. [Authorization](#authorization)
8. [References](#references)
 
## Introduction
 
The **BurgerAPI** project is a RESTful API built using ASP.NET Core, designed to manage a burger shop's backend operations, including managing burgers, carts, orders, and users. The API supports basic CRUD operations, and user authentication.
 
## Project Structure

Here is an overview of the project's structure:
- **Controllers**: Contains all the controller classes responsible for handling HTTP requests.
- **Data**: Contains the `BurgerDbContext` class which manages database operations.
- **Migrations**: Contains migration files for the Entity Framework.
- **Model**: Contains the model classes representing the data structures.
- **Program.cs**: Entry point of the application.
 
### Prerequisites
 
- .NET SDK 8.0 or higher
- SQL Server (for database)
- Microsoft.EntityFrameworkCore
- Microsoft.EntityFrameworkCore.SqlServer
- Microsoft.EntityFrameworkCore.Design
- Microsoft.EntityFrameworkCore.Tools
- Microsoft.AspNetCore.Cors
- Microsoft.AspNetCore.Authentication.JwtBearer
 
## Models
 
### Burger
Represents a burger item in the shop.
 
- **Id**: `int` - Primary key.
- **Name**: `string` - Name of the burger (Required).
- **ImgHyperLink**: `string` - Image URL of the burger (Required).
- **Price**: `decimal` - Price of the burger (Required).
- **Description**: `string` - Description of the burger (Required).
- **SortCategory**: `string` - Category of the burger (Required).
 
### Cart
Represents a user's cart containing burger items.
 
- **Id**: `int` - Primary key.
- **UserId**: `Guid` - Foreign key to identify the user.
- **BurgerId**: `int` - Foreign key to the `Burger` entity.
- **Quantity**: `int` - Number of items in the cart.
 
### Order
Represents an order made by a user.
 
- **OrderId**: `int` - Primary key.
- **UserId**: `Guid` - Foreign key to identify the user.
- **OrderItems**: `List<OrderItem>` - List of items included in the order.
 
### OrderItem
Represents an individual item in an order.
 
- **OrderItemId**: `int` - Primary key.
- **OrderId**: `int` - Foreign key to the `Order` entity.
- **BurgerId**: `int` - Foreign key to the `Burger` entity.
- **Quantity**: `int` - Number of burgers ordered.
 
### PhoneNumber
Represents a user's phone number for authentication purposes.
 
- **Id**: `Guid` - Primary key.
- **MobileNumber**: `string` - User's mobile number (Required).
 
## Database Context
 
### BurgerDbContext
Manages the database operations and entity configurations.
 
```csharp
public class BurgerDbContext : DbContext
{
    public DbSet<PhoneNumber> PhoneNumbers { get; set; }
    public DbSet<Burger> Burgers { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Cart> Carts { get; set; }
 
    public BurgerDbContext(DbContextOptions<BurgerDbContext> dbContextOptions)
        : base(dbContextOptions)
    {
    }
}
```
 
## Controllers
 
### BurgersController
 
Handles operations related to burgers.
 
- **GET** `/api/Burgers`: Retrieves all burgers.
- **GET** `/api/Burgers/{id}`: Retrieves a specific burger by ID.
- **POST** `/api/Burgers`: Adds a new burger.
- **PUT** `/api/Burgers/{id}`: Updates an existing burger by ID.
- **DELETE** `/api/Burgers/{id}`: Deletes a specific burger by ID.
- **GET** `/api/Burgers/category/{category}`: Retrieves burgers by category.
- **GET** `/api/Burgers/name/{name}`: Retrieves burgers by name.
 
### CartsController
 
Handles operations related to user carts.
 
- **GET** `/api/Carts/user/{userId}`: Retrieves all cart items for a specific user.
- **GET** `/api/Carts/{id}`: Retrieves a specific cart by ID.
- **POST** `/api/Carts`: Adds an item to the cart.
- **PUT** `/api/Carts/{id}`: Updates an existing cart item by ID.
- **DELETE** `/api/Carts/{id}`: Deletes a specific cart item by ID.
- **DELETE** `/api/Carts/user/{userId}`: Clears all items in a user's cart.
 
### OrderItemsController
 
Handles operations related to order items.
 
- **GET** `/api/OrderItems`: Retrieves all order items.
- **GET** `/api/OrderItems/{id}`: Retrieves a specific order item by ID.
- **POST** `/api/OrderItems`: Adds a new order item.
- **PUT** `/api/OrderItems/{id}`: Updates an existing order item by ID.
- **DELETE** `/api/OrderItems/{id}`: Deletes a specific order item by ID.
 
### OrdersController
 
Handles operations related to orders.
 
- **GET** `/api/Orders`: Retrieves all orders.
- **GET** `/api/Orders/{id}`: Retrieves a specific order by ID.
- **POST** `/api/Orders`: Creates a new order.
- **PUT** `/api/Orders/{id}`: Updates an existing order by ID.
- **DELETE** `/api/Orders/{id}`: Deletes a specific order by ID.
- **GET** `/api/Orders/user/{userId}`: Retrieves orders made by a specific user.
 
### PhoneNumbersController
 
Handles operations related to user phone numbers.
 
- **GET** `/api/PhoneNumbers`: Retrieves all phone numbers.
- **GET** `/api/PhoneNumbers/login/{phNumber}`: Authenticates a user based on their phone number and returns a JWT.
- **GET** `/api/PhoneNumbers/{id}`: Retrieves a specific phone number by ID.
- **POST** `/api/PhoneNumbers`: Adds a new phone number.
- **PUT** `/api/PhoneNumbers/{id}`: Updates an existing phone number by ID.
- **DELETE** `/api/PhoneNumbers/{id}`: Deletes a specific phone number by ID.
- **GET** `/api/PhoneNumbers/exists/{mobileNumber}`: Checks if a phone number exists.
- **GET** `/api/PhoneNumbers/getId/{mobileNumber}`: Retrieves user ID from the phone number.
 
## Authentication
 
The API uses JWT (JSON Web Token) for authentication. Users log in via their phone numbers, and a valid token is required to access most endpoints.
 
## Authorization
 
The `[Authorize]` attribute is applied to endpoints to enforce authentication. Only authorized users with valid JWT tokens can access these endpoints.

 
 
## References
 
- [ASP.NET Core Documentation](https://docs.microsoft.com/en-us/aspnet/core/)
- [Entity Framework Core Documentation](https://docs.microsoft.com/en-us/ef/core/)
- [JWT Authentication in ASP.NET Core](https://jwt.io/introduction/)
