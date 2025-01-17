using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using App.Models;

namespace App.Controllers
{
    public class UserController : Controller
    {
        private readonly DataContext _context;

        public UserController(DataContext context)
        {
            _context = context;
        }

        public string FormatName(string name)
        {
            name = char.ToUpper(name[0]) + name.Substring(1).ToLower();
            return name;
        }

        public async Task<bool> UserNameExists(int id, string name, string lastname)
        {
            return await _context.User.AnyAsync(u => 
                u.Id != id &&
                u.Name.ToLower() == name.ToLower() && 
                u.Lastname.ToLower() == lastname.ToLower());
        }

        public async Task<bool> UserDniPhoneExists(int id, long num) {
            return await _context.User.AnyAsync(u => 
                u.Id != id && (
                u.Dni == num || 
                u.Phone == num));
        }

        public async Task<bool> UserEmailExists(int id, string email) {
            return await _context.User.AnyAsync(u => 
                u.Id != id &&
                u.Email == email);
        }

        public async Task<string> UserCheck(User user)
        {
            var message = "ok";

            if (await UserNameExists(user.Id, user.Name, user.Lastname))
            {
                return message = "Ya existe un usuario con el mismo nombre y apellido.";
            }

            if (user.Name.Length < 2 || user.Lastname.Length < 2)
            {
                return message = "El nombre/apellido debe tener como minimo 2 caracteres.";
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(user.Name, @"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$") || !System.Text.RegularExpressions.Regex.IsMatch(user.Lastname, @"^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$"))
            {
                return message = "El nombre/apellido no puede contener numeros ni caracteres especiales.";
            }

            if (user.Name.Length > 50 || user.Lastname.Length > 50)
            {
                return message = "El nombre/apellido no puede tener mas de 50 caracteres.";
            }

            if (user.Dni < 1000000 || user.Dni > 99999999) 
            {
                return message = "El DNI debe tener entre 7 y 8 numeros.";
            }

            if (!System.Text.RegularExpressions.Regex.IsMatch(user.Email, @"^[a-zA-Z0-9._%+-]+@+(gmail|outlook|hotmail|yahoo|icloud)+.com$")) 
            {
                return message = "El correo electronico debe ser valido (e.g., nombre@gmail.com, usuario@outlook.com).";
            }

            if (user.Phone < 1000000000 || user.Phone > 9999999999) 
            {
                return message = "El telefono debe tener exactamente 10 numeros.";
            }

            if (await UserDniPhoneExists(user.Id, user.Dni))
            {
                return message = "El DNI ya esta asociado a un usuario.";
            }

            if (await UserEmailExists(user.Id, user.Email))
            {
                return message = "El correo electronico ya esta asociado a un usuario.";
            }

            if (await UserDniPhoneExists(user.Id, user.Phone))
            {
                return message = "El telefono ya esta asociado a un usuario.";
            }

            return message; 
        }

        [HttpGet("api/users")]
        public async Task<IActionResult> Index()
        {
            var users = await _context.User.ToListAsync();
            return Ok(users);
        }

        [HttpGet("api/users/{id}")]
        public async Task<IActionResult> Detail(int? id)
        {
            var user = await _context.User.FirstOrDefaultAsync(e => e.Id == id);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }

        [HttpPost("api/users")]
        public async Task<IActionResult> Create([FromBody] User model)
        {
            var user = new User();
            var message = await UserCheck(model);

            if (message != "ok")
            {
                return BadRequest(new { status = 400, error = "Bad Request", message});
            }

            model.Name = FormatName(model.Name);
            model.Lastname = FormatName(model.Lastname);
            user.Id = model.Id;
            user.Name = model.Name;
            user.Lastname = model.Lastname;
            user.Dni = model.Dni;
            user.Email = model.Email;
            user.Phone = model.Phone;
            _context.Add(user);
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpPut("api/users/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] User model)
        {
            var user = await _context.User.FirstOrDefaultAsync(e => e.Id == id);

            if (user == null)
            {
                return NotFound(new { status = 404, error = "Not Found", message = "Usuario no encontrado." });
            }

            var message = await UserCheck(model);

            if (message != "ok")
            {
                return BadRequest(new { status = 400, error = "Bad Request", message});
            }

            model.Name = FormatName(model.Name);
            model.Lastname = FormatName(model.Lastname);
            user.Name = model.Name;
            user.Lastname = model.Lastname;
            user.Dni = model.Dni;
            user.Email = model.Email;
            user.Phone = model.Phone;
            await _context.SaveChangesAsync();
            return Ok(user);
        }

        [HttpDelete("api/users/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var user = await _context.User.FindAsync(id);
            _context.User.Remove(user);
            await _context.SaveChangesAsync();
            return Ok();
        }
    }
}