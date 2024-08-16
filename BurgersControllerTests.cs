using BugerApis.Controllers;
using BugerApis.Data;
using BugerApis.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace BurgerApis.Tests
{
    public class BurgersControllerTests
    {
        private readonly BurgersController _controller;
        private readonly BurgerDbContext _context;

        public BurgersControllerTests()
        {
            var options = new DbContextOptionsBuilder<BurgerDbContext>()
                .UseInMemoryDatabase(databaseName: "TestBurgersDatabase")
                .Options;

            _context = new BurgerDbContext(options);
            _controller = new BurgersController(_context);
        }


        [Fact]
        public async Task GetBurgers_ReturnsAllBurgers()
        {
            // Arrange
            _context.Burgers.Add(new Burger { Id = 1, Name = "Cheeseburger", ImgHyperLink = "link1", Price = 5.99M, Description = "Delicious cheeseburger", SortCategory = "Beef" });
            _context.Burgers.Add(new Burger { Id = 2, Name = "Veggie Burger", ImgHyperLink = "link2", Price = 4.99M, Description = "Healthy veggie burger", SortCategory = "Vegetarian" });
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.GetBurgers();

            // Assert
            var actionResult = Assert.IsType<ActionResult<IEnumerable<Burger>>>(result);
            var returnValue = Assert.IsType<List<Burger>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }
}
