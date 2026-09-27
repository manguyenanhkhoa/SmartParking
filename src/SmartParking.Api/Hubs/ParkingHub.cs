using Microsoft.AspNetCore.SignalR;

namespace SmartParking.Api.Hubs;

public class ParkingHub : Hub
{
    public async Task UpdateSlot(int slotId, string status)
    {
        await Clients.All.SendAsync("SlotUpdated", slotId, status);
    }
}
