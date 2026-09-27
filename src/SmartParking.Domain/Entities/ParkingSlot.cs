namespace SmartParking.Domain.Entities;

public class ParkingSlot
{
    public int Id { get; set; }
    public int ParkingZoneId { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Status { get; set; } = "Available";
}
