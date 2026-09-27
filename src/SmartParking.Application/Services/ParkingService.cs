using SmartParking.Application.DTOs;
using SmartParking.Application.Interfaces;

namespace SmartParking.Application.Services;

public class ParkingService : IParkingService
{
    public IEnumerable<ParkingSlotDto> GetSlots()
    {
        return new[]
        {
            new ParkingSlotDto(1, "A01", "Available"),
            new ParkingSlotDto(2, "A02", "Occupied"),
            new ParkingSlotDto(3, "A03", "Reserved")
        };
    }
}
