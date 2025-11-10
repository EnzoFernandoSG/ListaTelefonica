using Microsoft.EntityFrameworkCore;
using AgendaAPI.Models;
using System.Linq;

namespace AgendaAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Contato> Contatos { get; set; }
        public DbSet<Telefone> Telefones { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Contato>(entity =>
            {
                entity.HasKey(c => c.Id);
                entity.Property(c => c.Id).HasColumnName("ID").HasColumnType("bigint");
                entity.Property(c => c.Nome).HasColumnName("NOME").HasMaxLength(100);
                entity.Property(c => c.Idade).HasColumnName("IDADE").HasColumnType("smallint");
            });

            modelBuilder.Entity<Telefone>(entity =>{

                entity.HasKey(t => t.Id); 

                entity.Property(t => t.ContatoId).HasColumnName("IDCONTATO").HasColumnType("bigint");
                entity.Property(t => t.Id).HasColumnName("ID").HasColumnType("bigint");
                entity.Property(t => t.Numero).HasColumnName("NUMERO").HasMaxLength(16);

                entity.HasOne(t => t.Contato)
                      .WithMany(c => c.Telefones)
                      .HasForeignKey(t => t.ContatoId)
                      .OnDelete(DeleteBehavior.Cascade)
                      .HasConstraintName("fk_telefone_contato"); 
            });
        }
    }
}