package com.retail.ordering.config;

import com.retail.ordering.entity.*;
import com.retail.ordering.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Map;
import java.util.HashMap;

@Component
public class DataSeeder implements CommandLineRunner {

        @Autowired
        private ProductRepository productRepository;

        @Autowired
        private CategoryRepository categoryRepository;

        @Autowired
        private BrandRepository brandRepository;

        @Autowired
        private PackagingRepository packagingRepository;

        @Override
        public void run(String... args) {
                if (productRepository.count() > 0) {
                        System.out.println("DataSeeder: Products already exist, skipping seed.");
                        return;
                }

                System.out.println("DataSeeder: Seeding data...");

                // === Brands ===
                Map<String, Brand> brands = new HashMap<>();
                seedBrand(brands, "Pizza Palace", "Premium pizza makers since 1990", null);
                seedBrand(brands, "Burger Barn", "Home of the juiciest burgers", null);
                seedBrand(brands, "Spice Kitchen", "Authentic Indian cuisine", null);
                seedBrand(brands, "Pasta House", "Italian favorites", null);
                seedBrand(brands, "Sweet Tooth", "Desserts and treats", null);

                // === Packaging ===
                Map<String, Packaging> pkgs = new HashMap<>();
                seedPackaging(pkgs, "Box", "Cardboard", true);
                seedPackaging(pkgs, "Bag", "Paper", true);
                seedPackaging(pkgs, "Container", "Plastic", false);
                seedPackaging(pkgs, "Wrap", "Foil", false);
                seedPackaging(pkgs, "Eco Container", "Sugarcane Fiber", true);

                // === Categories ===
                Map<String, Category> categories = new HashMap<>();
                String[] categoryNames = { "Pizza", "Burger", "Indian Mains", "South Indian", "Pasta", "Snacks",
                                "Desserts" };
                String[] categoryDescs = {
                                "Delicious pizzas with various toppings",
                                "Juicy burgers with fresh ingredients",
                                "Rich and flavorful Indian main courses",
                                "Authentic South Indian delicacies",
                                "Classic Italian pasta dishes",
                                "Crispy snacks and quick bites",
                                "Sweet treats and desserts"
                };

                for (int i = 0; i < categoryNames.length; i++) {
                        final int idx = i;
                        Category cat = categoryRepository.findByName(categoryNames[idx])
                                        .orElseGet(() -> Category.builder().build());
                        cat.setName(categoryNames[idx]);
                        cat.setDescription(categoryDescs[idx]);
                        categories.put(categoryNames[idx], categoryRepository.save(cat));
                }

                // === Products (from data.json) ===
                seedProduct(categories, brands, pkgs, "Pizza", "Pizza Palace", "Box",
                                "Paneer Pizza",
                                "Soft paneer cubes with capsicum and spicy red paprika on a cheesy base.",
                                199, "https://foodish-api.com/images/pizza/pizza1.jpg");
                seedProduct(categories, brands, pkgs, "Pizza", "Pizza Palace", "Box",
                                "Classic Margherita",
                                "Authentic Italian taste with fresh basil and premium mozzarella cheese.",
                                149, "https://foodish-api.com/images/pizza/pizza10.jpg");
                seedProduct(categories, brands, pkgs, "Burger", "Burger Barn", "Wrap",
                                "Double Cheese Burger",
                                "Two juicy patties layered with melted cheddar, pickles, and mustard.",
                                179, "https://foodish-api.com/images/burger/burger5.jpg");
                seedProduct(categories, brands, pkgs, "Pizza", "Pizza Palace", "Box",
                                "Veggie Supreme Pizza",
                                "Loaded with onions, bell peppers, olives, mushrooms, and sweet corn.",
                                219, "https://foodish-api.com/images/pizza/pizza22.jpg");
                seedProduct(categories, brands, pkgs, "Burger", "Burger Barn", "Wrap",
                                "Spicy Chicken Burger", "Crispy fried chicken breast with jalapeños and spicy mayo.",
                                189, "https://foodish-api.com/images/burger/burger12.jpg");
                seedProduct(categories, brands, pkgs, "Indian Mains", "Spice Kitchen", "Container",
                                "Butter Chicken",
                                "Rich and creamy tomato-based gravy with tender tandoori chicken pieces.",
                                299, "https://foodish-api.com/images/butter-chicken/butter-chicken11.jpg");
                seedProduct(categories, brands, pkgs, "South Indian", "Spice Kitchen", "Eco Container",
                                "Masala Dosa", "Crispy rice crepe filled with spiced potato mash, served with sambar.",
                                120, "https://foodish-api.com/images/dosa/dosa43.jpg");
                seedProduct(categories, brands, pkgs, "Pizza", "Pizza Palace", "Box",
                                "Pepperoni Feast", "Generous toppings of spicy pepperoni and extra mozzarella cheese.",
                                249, "https://foodish-api.com/images/pizza/pizza35.jpg");
                seedProduct(categories, brands, pkgs, "Indian Mains", "Spice Kitchen", "Container",
                                "Hyderabadi Biryani",
                                "Fragrant basmati rice cooked with exotic spices and marinated chicken.",
                                259, "https://foodish-api.com/images/biryani/biryani20.jpg");
                seedProduct(categories, brands, pkgs, "Pasta", "Pasta House", "Eco Container",
                                "Classic Pasta Alfredo",
                                "Penne pasta tossed in a rich, creamy white sauce with garlic and herbs.",
                                189, "https://foodish-api.com/images/pasta/pasta15.jpg");
                seedProduct(categories, brands, pkgs, "South Indian", "Spice Kitchen", "Eco Container",
                                "Idli Sambar", "Steamed rice cakes served with hot lentil soup and coconut chutney.",
                                80, "https://foodish-api.com/images/idly/idly25.jpg");
                seedProduct(categories, brands, pkgs, "Snacks", "Spice Kitchen", "Bag",
                                "Crispy Samosa (2pcs)", "Fried pastry filled with a savory potato and pea stuffing.",
                                40, "https://foodish-api.com/images/samosa/samosa7.jpg");
                seedProduct(categories, brands, pkgs, "Snacks", "Spice Kitchen", "Container",
                                "Fried Rice", "Wok-tossed rice with fresh vegetables, soy sauce, and scallions.",
                                159, "https://foodish-api.com/images/rice/rice12.jpg");
                seedProduct(categories, brands, pkgs, "Desserts", "Sweet Tooth", "Box",
                                "Chocolate Brownie", "Dense, fudgy brownie with walnuts and a drizzle of hot fudge.",
                                99, "https://foodish-api.com/images/dessert/dessert22.jpg");
                seedProduct(categories, brands, pkgs, "Pasta", "Pasta House", "Eco Container",
                                "Arrabiata Pasta", "Spicy tomato sauce pasta with olives, chili flakes, and garlic.",
                                179, "https://foodish-api.com/images/pasta/pasta3.jpg");
                seedProduct(categories, brands, pkgs, "Pizza", "Pizza Palace", "Box",
                                "Zesty BBQ Pizza", "Smoky BBQ sauce base with grilled chicken and caramelized onions.",
                                269, "https://foodish-api.com/images/pizza/pizza48.jpg");
                seedProduct(categories, brands, pkgs, "Burger", "Burger Barn", "Wrap",
                                "Veggie Burger", "Hand-crafted vegetable patty with lettuce, tomato, and herb sauce.",
                                139, "https://foodish-api.com/images/burger/burger80.jpg");
                seedProduct(categories, brands, pkgs, "Indian Mains", "Spice Kitchen", "Container",
                                "Mutton Biryani", "Slow-cooked rice with tender mutton pieces and aromatic saffron.",
                                329, "https://foodish-api.com/images/biryani/biryani5.jpg");
                seedProduct(categories, brands, pkgs, "Desserts", "Sweet Tooth", "Box",
                                "Cheesecake Slice", "Creamy New York style cheesecake with a graham cracker crust.",
                                149, "https://foodish-api.com/images/dessert/dessert5.jpg");
                seedProduct(categories, brands, pkgs, "Pizza", "Pizza Palace", "Box",
                                "Tandoori Chicken Pizza",
                                "Indian twist pizza with tandoori chicken, mint mayo, and green chilies.",
                                239, "https://foodish-api.com/images/pizza/pizza12.jpg");

                System.out.println("DataSeeder: Seeded " + productRepository.count() + " products, "
                                + brandRepository.count() + " brands, " + packagingRepository.count()
                                + " packaging types!");
        }

        private void seedBrand(Map<String, Brand> brands, String name, String desc, String logoUrl) {
                Brand brand = brandRepository.findByName(name)
                                .orElse(Brand.builder().name(name).description(desc).logoUrl(logoUrl).build());
                brands.put(name, brandRepository.save(brand));
        }

        private void seedPackaging(Map<String, Packaging> pkgs, String type, String material, boolean eco) {
                Packaging pkg = packagingRepository.findByType(type)
                                .orElse(Packaging.builder().type(type).material(material).isEcoFriendly(eco).build());
                pkgs.put(type, packagingRepository.save(pkg));
        }

        private void seedProduct(Map<String, Category> categories, Map<String, Brand> brands,
                        Map<String, Packaging> pkgs, String categoryName, String brandName,
                        String packagingType, String name, String description, int price, String imageUrl) {
                Product product = Product.builder()
                                .name(name)
                                .description(description)
                                .price(BigDecimal.valueOf(price))
                                .stock(100)
                                .imageUrl(imageUrl)
                                .category(categories.get(categoryName))
                                .brand(brands.get(brandName))
                                .packaging(pkgs.get(packagingType))
                                .build();
                productRepository.save(product);
        }
}
