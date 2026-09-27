using SmartParking.Application.DTOs;

namespace SmartParking.Application.Interfaces;

public interface IParkingService
{
    IEnumerable<ParkingSlotDto> GetSlots();
}
