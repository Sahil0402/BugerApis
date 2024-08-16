using BugerApis.Controllers;
using BugerApis.Data;
using BugerApis.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;
using Xunit.Abstractions;

namespace BugerApis.Tests
{
    public class CartsControllerTests
    {
        private readonly CartsController _controller;
        private readonly BurgerDbContext _context;

        private readonly ITestOutputHelper _output;
        public CartsControllerTests(ITestOutputHelper output)
        {
            var options = new DbContextOptionsBuilder<BurgerDbContext>()
                .UseInMemoryDatabase(databaseName: "TestCartsDatabase")
                .Options;

            _context = new BurgerDbContext(options);
            _controller = new CartsController(_context);
            _output = output;
        }


        [Fact]
        public async Task GetCartItems_ReturnsNotFound_WhenNoItems()
        {
            // Arrange
            var userId = Guid.NewGuid(); // Generate a unique user ID with no cart items

            // Act
            var result = await _controller.GetCartItems(userId); // Call method with a userId that has no items

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
            Assert.Equal("No items found in the cart for this user.", notFoundResult.Value);
        }
    }
}