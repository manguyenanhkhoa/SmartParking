namespace SmartParking.Domain.Entities;

public class ParkingLot
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
    public ICollection<ParkingZone> Zones { get; set; } = new List<ParkingZone>();
}
