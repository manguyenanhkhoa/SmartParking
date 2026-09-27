using Microsoft.AspNetCore.Mvc;
using SmartParking.Application.Interfaces;

namespace SmartParking.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParkingController(IParkingService parkingService) : ControllerBase
{
    [HttpGet("slots")]
    public IActionResult GetSlots() => Ok(parkingService.GetSlots());
}
