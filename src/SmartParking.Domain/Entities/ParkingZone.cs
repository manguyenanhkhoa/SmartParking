namespace SmartParking.Domain.Entities;

public class ParkingZone
{
    public int Id { get; set; }
    public int ParkingLotId { get; set; }
    public string Name { get; set; } = string.Empty;
    public ICollection<ParkingSlot> Slots { get; set; } = new List<ParkingSlot>();
}
