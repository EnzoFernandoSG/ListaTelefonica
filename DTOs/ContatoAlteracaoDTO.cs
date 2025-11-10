using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AgendaAPI.DTOs{
    public class TelefoneAlteracaoDTO{
        public long? Id { get; set; } 
        
        [Required]
        [MaxLength(16)]
        public string Numero { get; set; }
        
    }

    public class ContatoAlteracaoDTO{
        [Required]
        public long Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required]
        public short Idade { get; set; }

        public List<TelefoneAlteracaoDTO> Telefones { get; set; } = new();
    }
}