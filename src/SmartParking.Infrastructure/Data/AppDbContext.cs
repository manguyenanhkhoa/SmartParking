using Microsoft.EntityFrameworkCore;
using SmartParking.Domain.Entities;

namespace SmartParking.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<ParkingLot> ParkingLots => Set<ParkingLot>();
    public DbSet<ParkingZone> ParkingZones => Set<ParkingZone>();
    public DbSet<ParkingSlot> ParkingSlots => Set<ParkingSlot>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<ParkingLot>().HasMany(x => x.Zones).WithOne().HasForeignKey(x => x.ParkingLotId);
        modelBuilder.Entity<ParkingZone>().HasMany(x => x.Slots).WithOne().HasForeignKey(x => x.ParkingZoneId);
        modelBuilder.Entity<ParkingSlot>().Property(x => x.Code).HasMaxLength(20).IsRequired();
        modelBuilder.Entity<ParkingSlot>().Property(x => x.Status).HasMaxLength(20).IsRequired();
    }
}
