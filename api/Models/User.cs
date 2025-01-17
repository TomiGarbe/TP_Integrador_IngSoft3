using System.ComponentModel.DataAnnotations;

namespace App.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Lastname { get; set; }
        public int Dni { get; set; }
        public string Email { get; set; }
        public long Phone { get; set; }
    }
}