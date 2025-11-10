using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgendaAPI.Data;
using AgendaAPI.Models;
using System.IO;
using AgendaAPI.DTOs;
using System.Linq;    

namespace AgendaAPI.Controllers{
    [ApiController]
    [Route("api/[controller]")]
    public class ContatosController : ControllerBase{
        private readonly AppDbContext _context;

        public ContatosController(AppDbContext context){
            _context = context;
        }


[HttpGet]
public async Task<IActionResult> GetAll(string? nome, string? numeroTelefone){
    var query = _context.Contatos
        .Include(c => c.Telefones)
        .AsQueryable();

    if (!string.IsNullOrEmpty(nome)){
        query = query.Where(c => c.Nome.ToLower().Contains(nome.ToLower()));
    }

    if (!string.IsNullOrEmpty(numeroTelefone)){
        query = query.Where(c => c.Telefones.Any(t => t.Numero.Contains(numeroTelefone)));
    }
    
    var contatos = await query.ToListAsync();


    var contatosRetornoDto = contatos.Select(c => new ContatoRetornoDTO{
        Id = c.Id,
        Nome = c.Nome,
        Idade = c.Idade,
        Telefones = c.Telefones.Select(t => new TelefoneRetornoDTO{
            Id = t.Id,
            Numero = t.Numero
        }).ToList()
    }).ToList();

    return Ok(contatosRetornoDto);
}


        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(long id){
            var contato = await _context.Contatos
                .Include(c => c.Telefones)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contato == null)
                return NotFound();

            return Ok(contato);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ContatoInclusaoDTO contatoDto){
            var novoContato = new Contato{
                Nome = contatoDto.Nome,
                Idade = contatoDto.Idade,
                
                Telefones = contatoDto.Telefones.Select(t => new Telefone
                {
                    Numero = t.Numero
                }).ToList()
            };
            
            _context.Contatos.Add(novoContato);
            await _context.SaveChangesAsync();

            var contatoRetornoDto = new ContatoRetornoDTO{
                Id = novoContato.Id,
                Nome = novoContato.Nome,
                Idade = novoContato.Idade,
                Telefones = novoContato.Telefones.Select(t => new TelefoneRetornoDTO
                {
                    Id = t.Id,
                    Numero = t.Numero
                }).ToList()
            };
            return CreatedAtAction(nameof(GetById), new { id = novoContato.Id }, contatoRetornoDto);         
        }


[HttpPut("{id}")]
public async Task<IActionResult> Update(long id, [FromBody] ContatoAlteracaoDTO contatoDto)
{
    if (id != contatoDto.Id)
        return BadRequest(new { message = "O ID da rota não corresponde ao ID do contato no corpo da requisição." });

    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    var contatoExistente = await _context.Contatos
        .Include(c => c.Telefones)
        .FirstOrDefaultAsync(c => c.Id == id);

    if (contatoExistente == null)
        return NotFound();

    contatoExistente.Nome = contatoDto.Nome;
    contatoExistente.Idade = contatoDto.Idade;

    
    var telefonesIdsRecebidos = contatoDto.Telefones.Where(t => t.Id.HasValue && t.Id.Value > 0).Select(t => t.Id.Value).ToList();

    contatoExistente.Telefones
        .Where(t => !telefonesIdsRecebidos.Contains(t.Id))
        .ToList()
        .ForEach(t => _context.Telefones.Remove(t));
    
    foreach (var telefoneRecebido in contatoDto.Telefones){
        if (telefoneRecebido.Id.HasValue && telefoneRecebido.Id.Value > 0){
            var telefoneExistente = contatoExistente.Telefones.FirstOrDefault(t => t.Id == telefoneRecebido.Id.Value);
            if (telefoneExistente != null){
                telefoneExistente.Numero = telefoneRecebido.Numero;
            }
        }
        else{
            contatoExistente.Telefones.Add(new Telefone { Numero = telefoneRecebido.Numero });
        }
    }

    await _context.SaveChangesAsync();

    return NoContent();
}


        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(long id){
            var contato = await _context.Contatos.Include(c => c.Telefones)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (contato == null)
                return NotFound();

            _context.Contatos.Remove(contato);
            await _context.SaveChangesAsync();
            
            var logDir = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
            Directory.CreateDirectory(logDir);
            var logFile = Path.Combine(logDir, "exclusoes.log");
            await System.IO.File.AppendAllTextAsync(logFile,
                $"[{DateTime.Now}] Contato {contato.Nome} (ID {contato.Id}) excluído.\n");

            return NoContent();
        }
    }
}