using System.ComponentModel.DataAnnotations;

namespace BugerApis.Model
{
    public class PhoneNumber
    {
        public Guid Id { get; set; } = Guid.NewGuid();

        [Required]
        [StringLength(10, MinimumLength = 10, ErrorMessage = "Mobile number should be 10 digits")]
        [RegularExpression("^[0-9]*$", ErrorMessage = "Mobile number must be numeric")]
        public string? MobileNumber { get; set; }
    }
}
