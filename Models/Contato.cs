using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgendaAPI.Models{
    [Table("Contato")]
    public class Contato{
        [Key]
        [Column("ID")]
        public long Id { get; set; }

        [Required]
        [MaxLength(100)]
        [Column("NOME")]
        public string Nome { get; set; }

        [Column("IDADE")]
        public short Idade { get; set; }

        public List<Telefone> Telefones { get; set; } = new();
    }
}