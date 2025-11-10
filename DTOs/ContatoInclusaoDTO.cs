using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace AgendaAPI.DTOs{
    public class ContatoInclusaoDTO{
        [Required(ErrorMessage = "O nome é obrigatório.")]
        [MaxLength(100)]
        public string Nome { get; set; }

        [Required(ErrorMessage = "A idade é obrigatória.")]
        [Range(1, 150, ErrorMessage = "A idade deve ser um valor válido.")]
        public short Idade { get; set; }

        [Required(ErrorMessage = "É necessário fornecer pelo menos um telefone.")]
        [MinLength(1, ErrorMessage = "É necessário fornecer pelo menos um telefone.")]
        public List<TelefoneInclusaoDTO> Telefones { get; set; } = new();
    }
}