using System.Collections.Generic;

namespace AgendaAPI.DTOs
{
    public class ContatoRetornoDTO
    {
        public long Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public short Idade { get; set; }
        public List<TelefoneRetornoDTO> Telefones { get; set; } = new();
    }
}
