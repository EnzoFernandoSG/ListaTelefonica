using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgendaAPI.Models{
    [Table("Telefone")]
    public class Telefone{
        [Column("IDCONTATO")]
        public long ContatoId { get; set; }

        [Key]
        [Column("ID")]
        public long Id { get; set; }

        [Required]
        [MaxLength(16)]
        [Column("NUMERO")]
        public string Numero { get; set; }

        public Contato Contato { get; set; }
    }
}