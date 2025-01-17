using App.Controllers;
using App.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace App.Tests;

public class UserControllerTests
{
    private DataContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<DataContext>()
            .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
            .Options;

        return new DataContext(options);
    }

    [Fact]
    public async Task Index_ReturnsListOfUsers()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        context.User.AddRange(
            new User { Id = 1, Name = "Tomas", Lastname = "Garbellotto", Dni = 12345678, Email = "tomas@gmail.com", Phone = 1234567890 },
            new User { Id = 2, Name = "Tom", Lastname = "Garbellotto", Dni = 87654321, Email = "tom@gmail.com", Phone = 9876543210 }
        );
        context.SaveChanges();

        var controller = new UserController(context);

        // Act
        var result = await controller.Index();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<List<User>>(okResult.Value);
        Assert.Equal(2, returnValue.Count);
    }

    [Fact]
    public async Task Detail_ReturnsUserById()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var user = new User { Id = 1, Name = "Tomas", Lastname = "Garbellotto", Dni = 12345678, Email = "tomas@gmail.com", Phone = 1234567890 };
        context.User.Add(user);
        context.SaveChanges();

        var controller = new UserController(context);

        // Act
        var result = await controller.Detail(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var returnValue = Assert.IsType<User>(okResult.Value);
        Assert.Equal("Tomas", returnValue.Name);
    }

    [Fact]
    public async Task Detail_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        // Act
        var result = await controller.Detail(1);

        // Assert
        Assert.IsType<NotFoundResult>(result);
    }

    [Fact]
    public async Task Create_AddsUser()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 12345678,
            Email = "tomas@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.Create(newUser);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var createdUser = Assert.IsType<User>(okResult.Value);
        Assert.Equal("Tomas", createdUser.Name);
        Assert.Single(context.User);
    }

    [Fact]
    public async Task Update_UpdatesUser()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var existingUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 12345678,
            Email = "existing@gmail.com",
            Phone = 1234567890
        };
        context.User.Add(existingUser);
        context.SaveChanges();

        var controller = new UserController(context);

        var updatedUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 12345678,
            Email = "updated@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.Update(1, updatedUser);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result);
        var user = Assert.IsType<User>(okResult.Value);
        Assert.Equal("updated@gmail.com", user.Email);
    }

    [Fact]
    public async Task Delete_RemovesUser()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var user = new User { Id = 1 };
        context.User.Add(user);
        context.SaveChanges();

        var controller = new UserController(context);

        // Act
        var result = await controller.Delete(1);

        // Assert
        Assert.IsType<OkResult>(result);
        Assert.Empty(context.User);
    }

    [Fact]
    public void FormatName_FormatsCorrectly()
    {
        // Arrange
        var controller = new UserController(null);
        var name = "tomas";

        // Act
        var result = controller.FormatName(name);

        // Assert
        Assert.Equal("Tomas", result);
    }

    [Fact]
    public async Task UserNameExists_ReturnsTrue_WhenNameExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        context.User.Add(new User { Id = 1, Name = "Tomas", Lastname = "Garbellotto" });
        context.SaveChanges();

        var controller = new UserController(context);

        // Act
        var result = await controller.UserNameExists(2, "Tomas", "Garbellotto");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task UserNameExists_ReturnsFalse_WhenNameDoesNotExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        // Act
        var result = await controller.UserNameExists(1, "Tomas", "Garbellotto");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task UserDniPhoneExists_ReturnsTrue_WhenDniOrPhoneExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        context.User.Add(new User { Id = 1, Dni = 12345678, Phone = 1234567890 });
        context.SaveChanges();

        var controller = new UserController(context);

        // Act
        var resultDni = await controller.UserDniPhoneExists(2, 12345678);
        var resultPhone = await controller.UserDniPhoneExists(2, 1234567890);

        // Assert
        Assert.True(resultDni);
        Assert.True(resultPhone);
    }

    [Fact]
    public async Task UserDniPhoneExists_ReturnsFalse_WhenDniAndPhoneDoNotExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        // Act
        var resultDni = await controller.UserDniPhoneExists(1, 12345678);
        var resultPhone = await controller.UserDniPhoneExists(1, 1234567890);

        // Assert
        Assert.False(resultDni);
        Assert.False(resultPhone);
    }

    [Fact]
    public async Task UserEmailExists_ReturnsTrue_WhenEmailExists()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        context.User.Add(new User { Id = 1, Email = "tomas@gmail.com" });
        context.SaveChanges();

        var controller = new UserController(context);

        // Act
        var result = await controller.UserEmailExists(2, "tomas@gmail.com");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task UserEmailExists_ReturnsFalse_WhenEmailDoesNotExist()
    {
        // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        // Act
        var result = await controller.UserEmailExists(1, "tomas@gmail.com");

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenNameIsShort()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "T",
            Lastname = "G",
            Dni = 12345678,
            Email = "tomas@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El nombre/apellido debe tener como minimo 2 caracteres.", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenNameIsLong()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            Lastname = "Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
            Dni = 12345678,
            Email = "tomas@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El nombre/apellido no puede tener mas de 50 caracteres.", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenNameHaveNumbers()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas123",
            Lastname = "Garbellotto",
            Dni = 12345678,
            Email = "tomas@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El nombre/apellido no puede contener numeros ni caracteres especiales.", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenNameHaveEspecialCaracter()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto!",
            Dni = 12345678,
            Email = "tomas@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El nombre/apellido no puede contener numeros ni caracteres especiales.", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenDniIsShort()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 123456,
            Email = "tomas@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El DNI debe tener entre 7 y 8 numeros.", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenDniIsLong()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 123456789,
            Email = "tomas@gmail.com",
            Phone = 1234567890
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El DNI debe tener entre 7 y 8 numeros.", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenEmailIsInvalid()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 12345678,
            Email = "tomas@abc",
            Phone = 1234567890
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El correo electronico debe ser valido (e.g., nombre@gmail.com, usuario@outlook.com).", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenPhoneIsShort()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 12345678,
            Email = "tomas@gmail.com",
            Phone = 123456789
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El telefono debe tener exactamente 10 numeros.", result);
    }

    [Fact]
    public async Task UserCheck_Fail_WhenPhoneIsLong()
    {
         // Arrange
        var context = GetInMemoryDbContext();
        var controller = new UserController(context);

        var newUser = new User
        {
            Id = 1,
            Name = "Tomas",
            Lastname = "Garbellotto",
            Dni = 12345678,
            Email = "tomas@gmail.com",
            Phone = 12345678901
        };

        // Act
        var result = await controller.UserCheck(newUser);

        // Assert
        Assert.Equal("El telefono debe tener exactamente 10 numeros.", result);
    }
}