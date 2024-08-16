using BugerApis.Controllers;
using BugerApis.Data;
using BugerApis.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace BugerApis.Tests
{
    public class OrderItemsControllerTests
    {
        private readonly OrderItemsController _controller;
        private readonly BurgerDbContext _context;

        public OrderItemsControllerTests()
        {
            var options = new DbContextOptionsBuilder<BurgerDbContext>()
                .UseInMemoryDatabase(databaseName: "TestOrderItemsDatabase")
                .Options;

            _context = new BurgerDbContext(options);
            _controller = new OrderItemsController(_context);
        }

        [Fact]
        public async Task GetOrderItems_ReturnsAllOrderItems()
        {
            // Arrange
            _context.OrderItems.Add(new OrderItem { OrderItemId = 1, OrderId = 1, Name = "Cheeseburger", Price = 5.99M, Quantity = 1 });
            _context.OrderItems.Add(new OrderItem { OrderItemId = 2, OrderId = 1, Name = "Veggie Burger", Price = 4.99M, Quantity = 2 });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetOrderItems();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<OrderItem>>>(result);
            var returnValue = Assert.IsType<List<OrderItem>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }
}
