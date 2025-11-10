using System.ComponentModel.DataAnnotations;

namespace AgendaAPI.DTOs{
    public class TelefoneInclusaoDTO{
        [Required(ErrorMessage = "O número do telefone é obrigatório.")]
        [MaxLength(16)]
        public string Numero { get; set; }
    }
}