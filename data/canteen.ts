export type MealCategory = 'Hot Meal' | 'Grill' | 'Vegetarian' | 'Vegan' | 'Soup' | 'Dessert';

export interface MenuItem {
  name: string;
  description: string;
  price: number;
  category: MealCategory;
  calories: number;
  allergens: string[];
}

export type Day = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export const DAYS: Day[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const menu: Record<Day, MenuItem[]> = {
  Monday: [
    { name: 'Beef Lasagne', description: 'Slow-cooked beef ragu layered with pasta and béchamel', price: 5.50, category: 'Hot Meal', calories: 620, allergens: ['Gluten', 'Dairy', 'Egg'] },
    { name: 'Grilled Chicken Burger', description: 'Grilled chicken fillet with lettuce, tomato and mayo on a brioche bun', price: 6.00, category: 'Grill', calories: 540, allergens: ['Gluten', 'Egg'] },
    { name: 'Spinach & Ricotta Cannelloni', description: 'Rolled pasta filled with spinach and ricotta in tomato sauce', price: 5.00, category: 'Vegetarian', calories: 480, allergens: ['Gluten', 'Dairy', 'Egg'] },
    { name: 'Lentil & Coconut Dahl', description: 'Spiced red lentils simmered in coconut milk with basmati rice', price: 4.50, category: 'Vegan', calories: 390, allergens: [] },
    { name: 'Tomato & Basil Soup', description: 'Classic roasted tomato soup served with a bread roll', price: 3.50, category: 'Soup', calories: 220, allergens: ['Gluten', 'Dairy'] },
    { name: 'Chocolate Brownie', description: 'Warm fudge brownie with vanilla cream', price: 2.50, category: 'Dessert', calories: 310, allergens: ['Gluten', 'Dairy', 'Egg'] },
  ],
  Tuesday: [
    { name: 'Roast Turkey & Stuffing', description: 'Carved turkey with sage stuffing, roast potatoes and gravy', price: 6.00, category: 'Hot Meal', calories: 680, allergens: ['Gluten', 'Dairy'] },
    { name: 'Beef Burger', description: 'Classic beef patty with cheese, pickles and house sauce', price: 6.50, category: 'Grill', calories: 610, allergens: ['Gluten', 'Dairy', 'Egg'] },
    { name: 'Mushroom Stroganoff', description: 'Creamy mixed mushroom stroganoff served with egg noodles', price: 5.00, category: 'Vegetarian', calories: 510, allergens: ['Gluten', 'Dairy'] },
    { name: 'Thai Green Vegetable Curry', description: 'Seasonal vegetables in fragrant green curry with jasmine rice', price: 4.50, category: 'Vegan', calories: 420, allergens: [] },
    { name: 'Leek & Potato Soup', description: 'Creamy leek and potato soup with crusty bread', price: 3.50, category: 'Soup', calories: 240, allergens: ['Gluten', 'Dairy'] },
    { name: 'Apple Crumble', description: 'Baked apple crumble with warm custard', price: 2.50, category: 'Dessert', calories: 340, allergens: ['Gluten', 'Dairy', 'Egg'] },
  ],
  Wednesday: [
    { name: 'Pork Sausage Casserole', description: 'Pork sausages slow-cooked in a rich tomato and bean casserole', price: 5.50, category: 'Hot Meal', calories: 590, allergens: ['Gluten'] },
    { name: 'Grilled Salmon Fillet', description: 'Atlantic salmon with lemon butter, new potatoes and green beans', price: 7.00, category: 'Grill', calories: 480, allergens: ['Fish', 'Dairy'] },
    { name: 'Vegetable Quiche', description: 'Shortcrust pastry filled with roasted vegetables and mature cheddar', price: 4.50, category: 'Vegetarian', calories: 430, allergens: ['Gluten', 'Dairy', 'Egg'] },
    { name: 'Chickpea & Spinach Stew', description: 'Moroccan-spiced chickpea stew with couscous', price: 4.50, category: 'Vegan', calories: 370, allergens: ['Gluten'] },
    { name: 'Carrot & Ginger Soup', description: 'Warming carrot and ginger soup with a bread roll', price: 3.50, category: 'Soup', calories: 200, allergens: ['Gluten'] },
    { name: 'Lemon Drizzle Cake', description: 'Moist lemon sponge with tangy drizzle glaze', price: 2.50, category: 'Dessert', calories: 290, allergens: ['Gluten', 'Dairy', 'Egg'] },
  ],
  Thursday: [
    { name: 'Chicken & Mushroom Pie', description: 'Creamy chicken and mushroom filling in a golden shortcrust pastry', price: 6.00, category: 'Hot Meal', calories: 640, allergens: ['Gluten', 'Dairy', 'Egg'] },
    { name: 'BBQ Pulled Pork Wrap', description: 'Slow-cooked pulled pork with slaw and BBQ sauce in a flour wrap', price: 5.50, category: 'Grill', calories: 560, allergens: ['Gluten', 'Egg'] },
    { name: 'Margherita Pizza', description: 'Stone-baked pizza with tomato sauce and mozzarella', price: 5.00, category: 'Vegetarian', calories: 500, allergens: ['Gluten', 'Dairy'] },
    { name: 'Black Bean Tacos', description: 'Corn tacos filled with spiced black beans, salsa and guacamole', price: 5.00, category: 'Vegan', calories: 410, allergens: [] },
    { name: 'Butternut Squash Soup', description: 'Velvety butternut squash soup with toasted seeds', price: 3.50, category: 'Soup', calories: 210, allergens: ['Dairy'] },
    { name: 'Sticky Toffee Pudding', description: 'Classic sticky toffee pudding with toffee sauce', price: 2.80, category: 'Dessert', calories: 360, allergens: ['Gluten', 'Dairy', 'Egg'] },
  ],
  Friday: [
    { name: 'Fish & Chips', description: 'Beer-battered cod with chunky chips, mushy peas and tartare sauce', price: 6.50, category: 'Hot Meal', calories: 720, allergens: ['Gluten', 'Fish', 'Egg'] },
    { name: 'Grilled Beef Steak', description: 'Sirloin steak with peppercorn sauce, chips and salad', price: 8.50, category: 'Grill', calories: 650, allergens: ['Dairy'] },
    { name: 'Mac & Cheese', description: 'Creamy four-cheese macaroni with a breadcrumb crust', price: 4.50, category: 'Vegetarian', calories: 580, allergens: ['Gluten', 'Dairy', 'Egg'] },
    { name: 'Falafel Wrap', description: 'Crispy falafel with hummus, tabbouleh and pickled veg in a flatbread', price: 5.00, category: 'Vegan', calories: 430, allergens: ['Gluten', 'Sesame'] },
    { name: 'Broccoli & Stilton Soup', description: 'Rich broccoli and stilton soup with a bread roll', price: 3.50, category: 'Soup', calories: 260, allergens: ['Gluten', 'Dairy'] },
    { name: 'Cheesecake', description: 'New York-style vanilla cheesecake with berry compote', price: 3.00, category: 'Dessert', calories: 320, allergens: ['Gluten', 'Dairy', 'Egg'] },
  ],
};

export const categoryColor: Record<MealCategory, string> = {
  'Hot Meal':    '#1a1a18',
  'Grill':       '#dc2626',
  'Vegetarian':  '#16a34a',
  'Vegan':       '#15803d',
  'Soup':        '#d97706',
  'Dessert':     '#7c3aed',
};
