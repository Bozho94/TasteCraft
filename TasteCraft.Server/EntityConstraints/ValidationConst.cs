namespace TasteCraft.Server.EntityConstraints
{
    public class ValidationConst
    {
        public class Product
        {
            public const int NameMaxLength = 100;

            public const int DescriptionMaxLength = 500;

        }

        public class Category
        {
            public const int NameMaxLength = 100;
            public const int DescriptionMaxLength = 500;
        }

        public class Order
        {
            public const int FullNameMaxLength = 150;
            public const int AddressMaxLength = 50;
            public const int PhoneMaxLength = 20;
            public const int StatusMaxLength = 20;
        }
        public class OrderItem
        {             
            public const int ProductNameMaxLength = 100;
        }
    }
}
