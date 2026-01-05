using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TasteCraft.Server.Migrations
{
    /// <inheritdoc />
    public partial class RenamePriceAndQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PricePerKg",
                table: "OrderItems");

            migrationBuilder.RenameColumn(
                name: "PricePerKg",
                table: "Products",
                newName: "PricePerUnit");

            migrationBuilder.RenameColumn(
                name: "WeightKg",
                table: "OrderItems",
                newName: "UnitPrice");

            migrationBuilder.AddColumn<int>(
                name: "Quantity",
                table: "OrderItems",
                type: "integer",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Quantity",
                table: "OrderItems");

            migrationBuilder.RenameColumn(
                name: "PricePerUnit",
                table: "Products",
                newName: "PricePerKg");

            migrationBuilder.RenameColumn(
                name: "UnitPrice",
                table: "OrderItems",
                newName: "WeightKg");

            migrationBuilder.AddColumn<decimal>(
                name: "PricePerKg",
                table: "OrderItems",
                type: "numeric(10,2)",
                precision: 10,
                scale: 2,
                nullable: false,
                defaultValue: 0m);
        }
    }
}
