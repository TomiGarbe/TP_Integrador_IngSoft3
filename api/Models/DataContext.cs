using Microsoft.EntityFrameworkCore;

namespace App.Models
{
    public partial class DataContext : DbContext
    {
        public virtual DbSet<User> User { get; set; }

        public DataContext()
        {
        }

        public DataContext(DbContextOptions<DataContext> options) : base(options)
        {
        }
        
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("User");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Id).HasColumnName("id");
                entity.Property(e => e.Name).HasColumnName("name").HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Lastname).HasColumnName("last_name").HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Dni).HasColumnName("dni").HasColumnType("int");
                entity.Property(e => e.Email).HasColumnName("email").HasMaxLength(50).IsUnicode(false);
                entity.Property(e => e.Phone).HasColumnName("phone").HasColumnType("long");
            });
        }
    }
}