using SmartParking.Application.Services;

namespace SmartParking.UnitTests;

public class ParkingServiceTests
{
    [Fact]
    public void GetSlots_ReturnsSlots()
    {
        var service = new ParkingService();
        var slots = service.GetSlots().ToList();

        Assert.NotEmpty(slots);
        Assert.Equal("A01", slots[0].Code);
    }
}
