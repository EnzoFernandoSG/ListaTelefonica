using Microsoft.AspNetCore.Mvc;
using AgendaAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace AgendaAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase{
        private readonly AppDbContext _context;

        public TestController(AppDbContext context){
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> Get(){
            try
            {
                var result = await _context.Database.CanConnectAsync();
                return Ok(new { success = result, message = result ? "Conexão OK com o Supabase!" : "Falha ao conectar com o banco." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { success = false, error = ex.Message });
            }
        }
    }
}
