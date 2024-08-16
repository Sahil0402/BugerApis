using BugerApis.Controllers;
using BugerApis.Data;
using BugerApis.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
namespace BurgerApis.Tests
{
    public class OrdersControllerTests
    {
        private readonly OrdersController _controller;
        private readonly BurgerDbContext _context;

        public OrdersControllerTests()
        {
            var options = new DbContextOptionsBuilder<BurgerDbContext>()
                .UseInMemoryDatabase(databaseName: "TestOrdersDatabase")
                .Options;

            _context = new BurgerDbContext(options);
            _controller = new OrdersController(_context);
        }

        [Fact]
        public async Task GetOrders_ReturnsAllOrders()
        {
            // Arrange
            var userId = Guid.NewGuid();
            _context.Orders.Add(new Order { OrderId = 1, OrderDate = DateTime.UtcNow, UserId = userId, TotalAmount = 10.0M });
            _context.Orders.Add(new Order { OrderId = 2, OrderDate = DateTime.UtcNow, UserId = userId, TotalAmount = 20.0M });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetOrders();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Order>>>(result);
            var returnValue = Assert.IsType<List<Order>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }
}