using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models
{

    [Table("Order")]
    public class Order
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int OrderID { get; set; }

        [Required]
        [MaxLength(50)]
        public string CustomerFirstName { get; set; } = "Sam";

        [Required]
        [MaxLength(50)]
        public string CustomerLastName { get; set; } = "Kan";

        [Required]
        public DateTime Date { get; set; } = DateTime.Now;

        [Required]
        [MaxLength(20)]
        public string OrderStatus { get; set; } = "ORDERED";
    }
}
