import { ExamDefinition, Role, TestCategory } from '../types';

// Real answer keys for the standar  { id: 'ob-2', questionText: 'What gluten-free beers & ciders do we offer by the bottle/can ?', correctAnswer: "Original Sin Black Widow (Cider), Dry Wrought 'Mulled' (Cider), High Noon Pineapple (Seltzer), Long Drink Traditional (Seltzer), Strawberry Orange Mimosa / South Beach Mimosa (Blonde Ale - Gluten Free).", points: 4 },ized tests
const BARTENDER_KEY = [
  { id: 'b1', questionText: 'Which cocktail contains the following ingredients: 1.5oz Stoli Citrus Vodka 0.75oz Triple Sec 0.5oz Cranberry Juice 0.5oz Lime Juice', correctAnswer: 'Cosmopolitan', points: 1 },
  { id: 'b2', questionText: 'List the exact ingredients in an Amaretto Sour: Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Amaretto Liqueur, 1oz Sour Mix, 1oz Egg White (optional)', points: 3 },
  { id: 'b3', questionText: 'What are the exact ingredients in an Espresso Martini? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz House Vodka, 1oz (House) Coffee Liqueur, 1oz Cold Brew, 1oz Simple Syrup', points: 3 },
  { id: 'b4', questionText: 'What two ingredients Non-Alcoholic ingredients make up a "Mule" based Cocktail?', correctAnswer: 'Lime Juice and Ginger Beer', points: 2 },
  { id: 'b5', questionText: 'What are the exact ingredients featured in a Negroni? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1oz Campari, 1oz House London Dry Gin, 1oz Sweet Vermouth', points: 3 },
  { id: 'b6', questionText: 'What are the exact ingredients featured in a Paloma? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Blanco Tequila/Cazadores Blanco Tequila, 0.5oz Lime Juice, 1oz Grapefruit Juice, 0.25oz Simple Syrup', points: 3 },
  { id: 'b7', questionText: 'How many dashes of Angostura Bitters traditionally go into an Old Fashioned?', correctAnswer: 'Three dashes of Angostura Bitters', points: 1 },
  { id: 'b8', questionText: 'What are the exact ingredients featured in a Manhattan? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz House Rye Whiskey, 1oz Antica Sweet Vermouth, 2 dashes Angostura Bitters', points: 3 },
  { id: 'b9', questionText: 'What are the exact ingredients featured in a Mojito?', correctAnswer: '1.5oz House Rum/Bacardi Superior (White), 0.75oz Simple Syrup, 0.5oz Lime Juice, Top Soda Water, 6-8 leaves Mint', points: 3 },
  { id: 'b10', questionText: 'A guest asks for a margarita served "Up". What does "Up" mean?', correctAnswer: 'Served chilled without ice in a stemmed glass (like a coupe or martini glass).', points: 1 },
  { id: 'b11', questionText: 'What is our standard measurement for a single?', correctAnswer: '1.25oz', points: 1 },
  { id: 'b12', questionText: 'What kind of tequila is typically featured in a House Margarita?', correctAnswer: 'Tequila Blanco/Cazadores Blanco Tequila', points: 1 },
  { id: 'b13', questionText: 'How long do we typically stir an Old Fashioned?', correctAnswer: '20-30 seconds', points: 1 },
  { id: 'b14', questionText: 'What are some of the most common bartender tools?', correctAnswer: 'Shaker, strainer (Hawthorne/Julep/Fine Mesh), Jigger/measuring tool, Bar Spoon, Muddler, Peeler/Zester.', points: 2 },
  { id: 'b15', questionText: 'List two classic cocktails that are stirred including their base liquor. Example: 1. Side Car with Cognac 2. Cantarito with Tequila', correctAnswer: '1. Manhattan with Rye Whiskey (or Bourbon) 2. Negroni with Gin (or Old Fashioned with Bourbon)', points: 2 },
  { id: 'b16', questionText: 'Select the BEST answer: Why do we primarily shake cocktails?', correctAnswer: 'To thoroughly chill and dilute the drink, especially those containing citrus juice, egg white, or cream/liqueurs.', points: 2 },
  { id: 'b17', questionText: 'What are the exact ingredients featured in a Gimlet? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz House Dry Gin, 1oz Lime Juice, 0.75oz Simple Syrup', points: 3 },
  { id: 'b18', questionText: 'What spirits make up a Long Island Iced Tea?', correctAnswer: 'Vodka/E11Even/Svedka (house), Bombay Dry Gin/Gin (house), Bacardi Superior Rum/Rum (house), Cazadores Blanco Tequila/Blanco Tequila (house), Triple Sec', points: 3 },
  { id: 'b19', questionText: 'What kind of bitters are featured in an Old Fashioned?', correctAnswer: 'Orange Bitters and Angostura Bitters', points: 1 },
  { id: 'b20', questionText: 'What does SCS stand for?', correctAnswer: 'Service Consistency Speed', points: 1 },
  { id: 'b21', questionText: 'What are the exact ingredients in a Buttery Nipple?', correctAnswer: '1oz Butterscotch Liqueur, 0.5oz McGuire\'s Irish Cream/Irish Cream', points: 2 },
  { id: 'b22', questionText: 'What ingredients go into a Kamikaze?', correctAnswer: '0.5oz Svedka Vodka/Vodka/E11Even, 0.5oz Triple Sec, 0.25oz Lime Juice', points: 2 },
  { id: 'b23', questionText: 'List the exact ingredients and measurements in a Pink Starburst Shot:', correctAnswer: '0.5oz Three Olives Vanilla Vodka, 0.5oz Watermelon Schnapps, (splash) Sour', points: 2 },
  { id: 'b24', questionText: 'What ingredients go into a Breakfast shot?', correctAnswer: '1oz House Irish Whiskey/Jameson, 1oz Butterscotch Liqueur, OJ (Back)', points: 2 },
  { id: 'b25', questionText: 'What ingredients go into a Red Headed Slut?', correctAnswer: '0.5oz Jagermeister, 0.5oz Peach Schnapps, (splash) Cranberry Juice', points: 2 },
  { id: 'b26', questionText: 'What ingredients go in our Johnny Vegas shot?', correctAnswer: '0.25oz Patron (blanco tequila), 0.25oz Watermelon pucker, 0.25oz (coconut Rum) Malibu, (splash) Pineapple, (splash) Cranberry, (top) Redbull', points: 3 },
  { id: 'b27', questionText: 'List the exact ingredients and measurements in a White Gummy Bear Shot:', correctAnswer: '0.5oz Raspberry Vodka, 0.5oz Peach Schnapps, 0.25oz Sour Mix, (Top) Sprite', points: 3 },
  { id: 'b28', questionText: 'What ingredients go into a Water Moccasin?', correctAnswer: '0.5oz Crown Royal, 0.5oz Peach Schnapps, Splash Sour Mix', points: 2 },
  { id: 'b29', questionText: 'What ingredients go into our Oatmeal Cookie shot?', correctAnswer: '0.25oz Fireball, 0.5oz McGuire’s Irish Cream, 0.5oz Butterscotch Liqueur', points: 2 },
  { id: 'b30', questionText: 'List the two ingredients that go into our Cinnamon Toast Crunch Shot', correctAnswer: '0.5oz Fireball, 0.5oz Rumchata', points: 2 }
];

const SERVER_KEY = [
  { id: 's1', questionText: 'The mission of Three Points Hospitality emphasizes enriching the dining experience of whom?', correctAnswer: 'The mission of Three Points Hospitality is to enrich the dining experience of our guests, our employees, and owners with superior quality food and beverages, excellent guest service, sales growth, cost controls, and treating employees with respect.', points: 2 },
  { id: 's2', questionText: 'What is worn as part of your dining room dress code? List Top & Bottom Requirements.', correctAnswer: 'OAK/Cantina/Company Shirt or Polo. Dark jeans without holes or designs, paired with belt. Black non-slip shoes. Clothing must be neat and clean, long hair must be tied back, hands and fingernails must be well-groomed. Avoid wearing scented lotions or perfumes.', points: 3 },
  { id: 's3', questionText: "What is the key focus (First and most important focus) of the 'Five Basics of Service Excellence' at Three Points Hospitality?", correctAnswer: 'The first and most important focus is "Look at me".', points: 2 },
  { id: 's4', questionText: 'When should a server at all Three Points Hospitality venues arrive for their shift?', correctAnswer: 'A server should arrive promptly to their shift', points: 1 },
  { id: 's5', questionText: 'List a suggested practice for enhancing the guest experience through suggestive selling:', correctAnswer: 'A suggested practice is to use upselling techniques by suggesting additional items, promotions, or upgrades to increase check averages. Other practices include mentioning specials, and learning basic food and drink pairing suggestions', points: 2 },
  { id: 's6', questionText: 'What should a server do if they make a small mistake during service?', correctAnswer: "The server should stay relaxed, alert, and efficient and always maintain control of the situation. If it's a mistake on the bill (over ring), they must immediately notify the kitchen or bar not to prepare the item, split off the incorrect items, and inform the manager.", points: 2 },
  { id: 's7', questionText: 'Which of the following behaviors is a turn-off for guests at Three Points Hospitality?', correctAnswer: 'Behaviors to avoid (turn-offs) include: approaching guests with dirty plates , forming "discussion groups" of three or four idle servers in guest areas , ignoring guests , and having an unpositive attitude.', points: 2 },
  { id: 's8', questionText: 'What is the most important quality for a server to maintain during guest interactions according to the guidelines?', correctAnswer: 'An energetic, friendly, and caring attitude is essential at all times. The server should also be professional and confident.', points: 2 },
  { id: 's9', questionText: 'What is the primary responsibility of a server during the process of pre-bussing a table?', correctAnswer: 'The primary responsibility is clearing used or empty dishes, glasses, and utensils from the table before the guests have finished their meal. This helps keep the table tidy and ensures guests have ample space for the next course.', points: 2 }
];

const HOST_KEY = [
  { id: 'h1', questionText: 'What information do you need to take when making a reservation?', correctAnswer: 'First & last name, Telephone number, E-mail address, and Notes (such as birthday, highchair, wheelchair, booth, outside seating).', points: 3 },
  { id: 'h2', questionText: 'What extra information do you need from a guest to make a reservation during graduation weekends?', correctAnswer: 'A credit card is required to secure the reservation, which must be entered into the Resy app.', points: 2 },
  { id: 'h3', questionText: 'Cancellation within three days or no-shows incur a $___ charge per guest.', correctAnswer: '$10', points: 1 },
  { id: 'h4', questionText: 'For reservation requests, enter details into the Resy app. For parties larger than ___ guests, direct them to book as an event.', correctAnswer: '20', points: 1 },
  { id: 'h5', questionText: 'Tables Occupied for 30-60 Minutes What would be an appropriate quote wait time?', correctAnswer: '15-20 minute wait time.', points: 1 },
  { id: 'h6', questionText: 'If a guest asks to book the private event or catering, please explain what you would say to them on the telephone or in person:', correctAnswer: 'Advise the guest to complete our contact form on the website or email us directly, as reservations over 20 guests, private events, or catering should be directed to management.', points: 3 },
  { id: 'h7', questionText: 'When do we post graduation menus on our website?', correctAnswer: 'A month before the graduation weekend.', points: 1 },
  { id: 'h8', questionText: 'Explain in 2 sentences: What pre-bussing & post-dining clean-up is.', correctAnswer: 'Pre-bussing involves removing unnecessary items from the table while guests are still dining to maintain a clean appearance and improve the experience. Post-dining clean-up is promptly busing, cleaning the tabletop and chairs, and resetting the area with clean linens and place settings once guests have left.', points: 3 },
  { id: 'h9', questionText: 'A guest approaches you and says, "I don\'t see why I need a reservation." What would be the appropriate way to respond?', correctAnswer: '"Reservations help us manage the flow of guests and ensure that everyone receives timely service. While we do accept walk-ins, having a reservation guarantees your table at your preferred time."', points: 3 },
  { id: 'h10', questionText: 'Servers are allowed to tell you when they are no longer taking tables:', correctAnswer: 'FALSE', points: 1 },
  { id: 'h11', questionText: 'A guest asks, "Can you accommodate additional guests in our party?" What would be the best way to respond?', correctAnswer: 'Check availability in Resy first. If space permits, update the party size. If fully booked, inform them politely that we cannot guarantee seats for the extra guests but will try our best upon arrival.', points: 2 },
  { id: 'h12', questionText: 'A guest arrives at the restaurant without a reservation during a busy evening. What is the most appropriate way for the host to handle this situation?', correctAnswer: 'Greet them warmly, inform them of the current wait time, add them to the waitlist if they agree, and suggest they can wait in the bar area or text them when the table is ready.', points: 2 },
  { id: 'h13', questionText: 'If a guest becomes upset because their table isn\'t ready on time, how should you handle the situation?', correctAnswer: 'Remain calm, apologize for the delay, explain the situation honestly (e.g. "The previous guests are just finishing up"), and offer a gesture of hospitality such as a complimentary drink or appetizer if within policy, or update them frequently.', points: 2 },
  { id: 'h14', questionText: 'What is the best way to handle a situation where two different parties claim to have the same reservation?', correctAnswer: 'Verify the reservation details (phone number, confirmation email). Identify which party holds the actual reservation. Apologize to the other party and attempt to accommodate them immediately as a priority walk-in or offer bar seating.', points: 2 },
  { id: 'h15', questionText: 'A guest calls and requests to make a reservation, explain your process in detail with steps.', correctAnswer: 'When a guest calls, I start with a warm greeting and immediately ask for their preferred date, time, and party size to check our availability. Once a slot is confirmed, I collect the guest\'s name and phone number, while also inquiring about any special occasions or dietary restrictions to personalize their experience. Finally, I repeat all the details back to the guest to ensure accuracy before thanking them and concluding the call.', points: 4 }
];

const OAK_COCKTAILS_KEY = [
  { id: 'oak-sc-1', questionText: 'What ingredients & measurements go into our White Lotus ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5 oz E11even Vodka, 0.5 oz St. Germain, 1 oz Coconut Milk (unsweetened), 0.75 oz Rosemary Syrup, 0.75 oz Pineapple Juice, 0.5 oz Fresh Lime Juice', points: 3 },
  { id: 'oak-sc-2', questionText: 'What ingredients & measurements go into our Duchess of Earl ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: "1.5oz Engine Gin, 1oz Earl Gray Simple Syrup, 0.5oz Lemon Juice, 0.25oz Rockey's Liqueur, 3 drops lavender tinctures, Fever Tree Sicilian Lemonade (Topped)", points: 3 },
  { id: 'oak-sc-3', questionText: 'What ingredients & measurements go into our Strawberry Moon ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1 oz Awayuki Strawberry Gin, 0.5oz JF Haden Lychee Liqueur, 0.75oz House Made Ginger Syrup, 0.75oz Lime juice, 0.25oz Rockey’s Botanical Liqueur, Top Sprite + Soda (split)', points: 3 },
  { id: 'oak-sc-4', questionText: 'What ingredients & measurements go into our Prickly Pearadox ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5 oz Pa’lante Blanco Rum, 0.5 oz Golden Falernum, 0.75 oz Fresh Lime Juice, 0.75 oz Prickly Pear REAL, 6 Mint Leaves, Splash Coca-Cola (0.5oz)', points: 3 },
  { id: 'oak-sc-5', questionText: 'What ingredients & measurements go into our Fire & Flower ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '0.75 oz Arette Reposado Tequila, 0.75 oz Ilegal Mezcal, 0.5oz Ginger Liqueur, 0.25 oz Hibiscus Passion Fruit Syrup, 0.25oz Rosemary Simple, 0.5oz Lemon Juice', points: 3 },
  { id: 'oak-sc-6', questionText: 'What ingredients & measurements go into our Southern Sour ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Disaronno Amaretto, 0.75 oz Bourbon, 0.25oz Campari, 0.5oz Lemon Juice, 0.25oz Simple Syrup, 1 Egg White, 5 angostura “hearts” (semi-circle)', points: 3 },
  { id: 'oak-sc-7', questionText: 'What ingredients & measurements go into our Honeydew Me ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Cazadores Blanco Tequila, 1oz Honeydew Juice, 0.75oz Lemon Juice, 0.5oz Amontillado Sherry, 0.25oz Agave Syrup, 1 jalapeno slice, 6 mint leaves', points: 3 },
  { id: 'oak-sc-8', questionText: 'What ingredients & measurements go into our Smoked Pecan Old Fashion Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2 oz Pecan-Infused Buffalo Trace Bourbon, 0.25 oz 4-Spice Pecan Syrup, 2 dashes Chocolate Bitters', points: 3 },
  { id: 'oak-sc-9', questionText: 'What ingredients & measurements go into our When In Sicily [Zero-Proof] ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Veridoshé Ginesis, 0.25oz Earl Gray Syrup, 0.75oz Lemon Juice, 3 drops saline, 1 dash cardamom, 2oz Fever Tree Sicilian Lemonade', points: 3 },
  { id: 'oak-sc-10', questionText: 'What ingredients & measurements go into our Don\'t Mind If I Dew [Zero-Proof] ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Veridoshé Ginesis, 0.5oz Honeydew Juice, 0.25oz Ginger Syrup, 0.75oz Lime Juice, 3 drops saline, Top with Tonic Water', points: 3 },
  { id: 'oak-sc-11', questionText: 'What ingredients & measurements go into our Fall Sangria ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Hiram Walker Apricot Brandy, 0.5oz Gran Gala Orange Liqueur, 0.5oz Monin Pear Syrup, 0.5oz Fresh Orange Juice, Top: 2oz Merlot', points: 3 },
  { id: 'oak-sc-12', questionText: 'What ingredients & measurements go into our Spellbinding Spritz ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1 oz Aperol, 0.5oz Lemon Juice, 3oz Scandi Sparkling Wine, 0.5oz Butterfly Pea Syrup', points: 3 },
  { id: 'oak-sc-13', questionText: 'What ingredients & measurements go into our Twenty Two ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1oz Patrón Reposado, 0.5oz J.F. Haden\'s Lychee Liqueur, 0.5oz Rosé Wine, 0.5oz Lychee Syrup, 0.5oz Lime Juice, 5 drops 5:1 Saline', points: 3 },
  { id: 'oak-sc-14', questionText: 'What ingredients & measurements go into our Carajillo\'s Older Brother ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1oz Patrón Reposado, 1oz Licor 43, 1oz Real Espresso, 0.25oz Turbinado Simple Syrup', points: 3 },
  { id: 'oak-sc-15', questionText: 'What ingredients & measurements go into our Grey Goose Espresso Martini ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Grey Goose Vodka, 0.75oz Mr. Black Coffee Liqueur, 0.5oz Turbinado Simple Syrup, 1oz Fresh Espresso (pod), 3 drops 5:1 Saline', points: 3 }
];

const OAK_SERVER_KEY = [
  { id: 'os-1', questionText: 'What are our “Ladies Night” specials?', correctAnswer: '$7 select martinis on Thursday from 7 PM - Close!', points: 2 },
  { id: 'os-2', questionText: 'Where would you look to find the daily specials or 86ed items ?', correctAnswer: 'Back of House – White Board; Dry Erase Board', points: 1 },
  { id: 'os-3', questionText: 'What is our brunch drink promotion ?', correctAnswer: '$19.95 bottomless mimosas from 10 AM - 4 PM on Friday - Sunday Brunch.', points: 2 },
  { id: 'os-4', questionText: 'What pants are appropriate for your work uniform?', correctAnswer: 'Dark jeans without holes or design on them and a matching belt.', points: 2 },
  { id: 'os-5', questionText: 'Explain the procedural process of presenting , opening , and pouring a bottle of wine:', correctAnswer: "1. Present the unopened bottle to the host with the label facing them, announcing the producer, vintage, varietal, and region to confirm the order. 2. Neatly cut the foil below the lower lip, pocket the capsule, and wipe the bottleneck with a clean cloth. 3. Insert the corkscrew, leaving one spiral turn visible, then leverage the cork out gently and quietly, presenting it to the host on a plate or napkin. 4. Pour a one-ounce taste for the host and wait for their approval before proceeding. 5. Serve the table clockwise, pouring from the right for ladies first, then gentlemen, and the host last. 6. Fill glasses one-third full, wiping the bottle lip after each pour, and place the bottle near the host with the label facing out. 7. For sparkling wine, twist the bottle at a 45° angle for a silent opening; for aged bottles, decant if sediment is present.", points: 5 },
  { id: 'os-6', questionText: 'You greet a table and one person requests a vodka soda. How would you upsell this guest? Explain in steps using questions and examples.', correctAnswer: 'Look for upselling responses like: “Great! Are we doing Titos, Grey Goose, or something else” or: “Would you like a double for $2 more” etc…', points: 3 },
  { id: 'os-7', questionText: 'What wine varietals do we serve on special for Happy Hour?', correctAnswer: 'Reds: Cabernet Sauvignon, Merlot\nWhites: Pinot Grigio, Chardonnay', points: 2 },
  { id: 'os-8', questionText: 'List the red wines we serve by the glass ( Brand & Varietal ) Example: - Extraction Red Blend, Block Nine Pinot Noir (etc...)', correctAnswer: 'Ferro 13 “The Nerd” – Nero d’Avola\nDon Genaro - Cabernet Sauvignon\nRomulo – Malbec\nLatitude 38 “Sonoma County” – Pinot Noir', points: 4 },
  { id: 'os-9', questionText: 'List the white wines we serve by the glass ( Brand & Varietal ): Example: - Barnard Griffin Chardonnay, Chateau Ste Michelle Sauvignon Blanc (etc...)', correctAnswer: 'Villa Marin – Chardonnay\nVilla Marin – Pinot Grigio\nPonga – Sauvignon Blanc\nEcho Bay – Sauvignon Blanc', points: 4 },
  { id: 'os-10', questionText: 'List six bourbons we serve at OAK :', correctAnswer: "Any six of the following: 4 Roses Single Barrel, 4 Roses Small Batch, Angel's Envy, Basil Hayden's, Buffalo Trace, Bulleit, Bulleit 10 Yr, Bulleit Rye, Calumet Farms, Crown Royal, Crown Royal Apple, Evan Williams (House), Garrison Brothers, George Dickel Rye, Gentleman Jack, High West Double Rye, Jack Daniel's, Jack Daniel's Fire, Jameson, Knob Creek, Maker's 46, Maker's Mark, Michter's Single Barrel Rye, Milam & Green Rye, Milam & Green Single Barrel, Milam & Greene Triple Cask, Old St. Pete, Powers, Rebel Yell 100, Rebel Yell Cask Strength, Templeton Rye, Tullamore Dew, Twin-P Whiskey, Whistlepig Rye 10 Year, Woodford Reserve, Woodford Reserve Rye, Woodinville Straight Rye Whiskey, Wyoming Whiskey, Suntory Toki Japanese Whisky, Kikori Japanese Rice Whiskey.", points: 3 }
];

const OAK_BARTENDER_KEY = [
  { id: 'ob-1', questionText: 'Describe (in detail) five different styles of beer :', correctAnswer: 'Examples include: Lager, Pilsner, IPA (India Pale Ale), Stout, Porter, Wheat Beer, Pale Ale, Blone Ale, Cider', points: 5 },
  { id: 'ob-2', questionText: 'What gluten-free beers & ciders do we offer by the bottle/can ?', correctAnswer: "Original Sin Black Widow (Cider), Dry Wrought ‘Mulled’ (Cider), High Noon Pineapple (Seltzer), Long Drink Traditional (Seltzer). (Note: Strawberry Orange Mimosa is listed as a Blonde Ale, which typically contains gluten).", points: 4 },
  { id: 'ob-3', questionText: 'List three of our IPA beers we carry by the bottle/can :', correctAnswer: 'Bell’s Two Hearted IPA, Founders All Day IPA, Terrapin ‘Luau’ Krunkles IPA, Cypress & Grove “Well & Good”. (Any three of these are acceptable).', points: 3 },
  { id: 'ob-4', questionText: 'List all wines (red & white) we serve by the glass:', correctAnswer: "Red Wines: Don Genaro – Cabernet Sauvignon, Latitude 38 “Sonoma County” – Pinot Noir, Romulo – Malbec, Ferro 13 “The Nerd” – Nero d’Avola. White Wines: Villa Marin – Pinot Grigio, Villa Marin – Chardonnay, Ponga – Sauvignon Blanc, Echo Bay – Sauvignon Blanc.", points: 8 },
  { id: 'ob-5', questionText: 'What wine varietals do we serve on special for Happy Hour?', correctAnswer: "Reds: Impero Cabernet Sauvignon, Impero Merlot. Whites: Albertoni Chardonnay, Albertoni Pinot Grigio.", points: 4 },
  { id: 'ob-6', questionText: 'How many ounces is a standard pour for wine served by the glass?', correctAnswer: '6oz', points: 1 },
  { id: 'ob-7', questionText: 'List six bourbons we serve at OAK:', correctAnswer: "Any six from the extensive list are acceptable. Examples: Garrison Brothers Bourbon, Basil Hayden Bourbon, Maker's Mark Bourbon, Woodford Reserve Bourbon, Four Roses Single Barrel Bourbon, Bulleit Bourbon.", points: 3 },
  { id: 'ob-8', questionText: 'Name all of our “house” brand liquors (Vodka, Gin, Rum, Tequila, Whiskey)', correctAnswer: 'Vodka: E11even Vodka, Gin: Bombay Dry, Rum: Bacardi Superior, Tequila: Cazadores Blanco, Whiskey: Evan Williams.', points: 5 },
  { id: 'ob-9', questionText: 'List our Happy Hour specials:', correctAnswer: "Monday–Friday (4–6 PM): $5 House Spirits; $4 House Wines; $5 Craft Beers: Founders All Day IPA, Kona Big Wave Golden Ale, Dry Wrought Seasonal Cider, and Cypress & Grove Prairie Ride Pale Ale; $6 Classic Cocktails: Margarita, Old Fashioned, and Gimlet; $6–$9 Bourbon Selections: Twin-P Whiskey ($6), Powers Irish Whiskey ($7), Milam & Greene Single Barrel ($8), and Angel's Envy Bourbon ($9); $10 Southern Cocktails: Honeydew Me, Prickly Pearadox, and Duchess of Earl; Food: $10 Southern Bites - Chopped Caesar, Wings, Pretzel & Veggie Dip, Fish Fry; $15 Smash Burger.", points: 5 },
  { id: 'ob-10', questionText: 'What does ABV stand for?', correctAnswer: 'Alcohol by volume', points: 1 }
];

const OAK_HOST_KEY = [
  { id: 'oh-1', questionText: 'When is our last seating for dinner on weekdays and weekends?', correctAnswer: '15 minutes before close on weekdays', points: 2 },
  { id: 'oh-2', questionText: 'What is our physical address?', correctAnswer: '15 SE 1st Ave, Gainesville, FL 32601', points: 2 },
  { id: 'oh-3', questionText: 'What is our telephone number?', correctAnswer: '(352) 558-6696', points: 1 },
  { id: 'oh-4', questionText: 'Part One: What are our hours of operation from open to close (Monday-Sunday)? \nPart Two: During lunch, dinner, and brunch (Monday-Sunday), what are the kitchen’s serving hours?', correctAnswer: 'Part One: Monday–Wednesday: 11:30 AM – 10:00 PM, Thursday: 11:30 AM – 12:00 AM, Friday: 11:30 AM – 1:00 AM, Saturday: 11:00 AM – 2:30 PM, 3:30 PM – 1:00 AM, Sunday: 11:00 AM – 2:30 PM, 3:30 PM – 10:00 PM\nPart Two: Monday–Thursday: 4:00 PM – 10:00 PM, Friday: 4:00 PM – 11:00 PM, Saturday: 11:00 AM – 2:30 PM', points: 8 },
  { id: 'oh-5', questionText: 'Describe acceptable attire for your uniform.', correctAnswer: 'Closed-toe shoes (with grip) and the OAK uniform', points: 2 },
  { id: 'oh-6', questionText: 'What does OAK stand for?', correctAnswer: 'Original American Kitchen', points: 1 }
];

const CANTINA_HOST_KEY = [
  { id: 'ch-1', questionText: 'When is our last seating for dinner on weekdays and weekends?', correctAnswer: 'Weekdays = The last seating is at 9:00 PM. Weekends = The last seating is at 10:00 PM.', points: 2 },
  { id: 'ch-2', questionText: 'What is our physical address?', correctAnswer: '1680 West University Ave Ste. 10, Gainesville, FL 32603', points: 2 },
  { id: 'ch-3', questionText: 'What is our telephone number?', correctAnswer: '(352) 781-2050', points: 1 },
  { id: 'ch-4', questionText: 'What is our website address?', correctAnswer: 'https://www.cantinaanejo.com/', points: 1 },
  { id: 'ch-5', questionText: 'Describe acceptable attire for your uniform.', correctAnswer: 'Acceptable uniform attire means maintaining a polished, professional look with closed-toe shoes (preferably heels with non-slip soles), and fitted, elegant attire such as a black dress or the assigned Cantina cocktail uniform—always kept in excellent condition. Clothing should have no writing or logos unless it’s official branding, and the goal is a sleek, stylish, and chic appearance that matches the high-energy, vibrant atmosphere of the venue. Uniform guidelines may vary by event or specific role, so always refer to your location’s dress code policy or check with management for details.', points: 3 }
];

const CANTINA_SERVER_KEY = [
  { id: 'cs-1', questionText: 'What are our “Ladies Night” specials? (If any, list all — prices included)', correctAnswer: 'Ladies drink free from 8:00–9:00 PM.', points: 2 },
  { id: 'cs-2', questionText: 'What specials do we have on Mondays? (If any, list all) — prices included)', correctAnswer: '$5 House Margaritas', points: 2 },
  { id: 'cs-3', questionText: 'You greet a table and one person requests a vodka soda. How would you upsell this guest? Explain in steps using questions to the guest with examples.', correctAnswer: 'Confirm the Preference or ask what they usually like to drink, then offer other options instead of assuming "house" or "well". Offer a flavorful twist. Suggest signature upgrades; always offer to make it a double', points: 4 },
  { id: 'cs-4', questionText: 'List 5 draft beers we carry on tap:', correctAnswer: 'Blue Moon Draft; Coors Light Draft; Dos XX Ambar Draft; Dos XX Lager Draft; First Mag Cantina Lager Draft; Modelo Especial Draft; Swamphead Forever Florida Lager Draft; VooDoo Ranger IPA', points: 5 },
  { id: 'cs-5', questionText: 'Name 6 different tequilas we carry. Note: You may list unique brands or distinct, specialized expressions within a brand (e.g., Herradura Selección Suprema, and Herradura Colección de la Casa can be considered separate entries). Standard expressions of the same brand (e.g., Herradura Silver, Reposado, or Añejo) will count as one.', correctAnswer: 'Casa Dragones Blanco, Casamigos Anejo, Casamigos Reposado, Cascahuin Tahona Blanco, Cazadores Anejo, Cazadores Blanco (House), Cazadores Cafe, Cazadores Reposado, Cazcanes Anejo, Cazcanes Blanco, Cazcanes Reposado, Clase Azul Anejo, Clase Azul Gold, Clase Azul Reposado, Clase Azul Ultra, Don Fulano Anejo, Don Fulano Blanco, Don Fulano Reposado, Don Julio 1942 Anejo, Don Julio Anejo, Don Julio Blanco, Don Julio Reposado, El Tequileño Anejo, El Tequileño Blanco, El Tequileño Reposado, El Tesoro Extra Anejo Paradiso, Fortaleza Anejo, Fortaleza Blanco, Fortaleza Reposado, G4 Blanco, G4 Madera Blanco, G4 Overproof Blanco, Komos Anejo Cristalino, Komos Extra Anejo, Komos Rosa Reposado, La Gritona Reposado, Lalo Blanco, Lalo Blanco High Proof, Ilegal Joven Mezcal, Mijenta Blanco, Mijenta Reposado, Mijenta Añejo, Patron Barrel Select Cantina Anejo, Patron Cristalino, Patron El Alto Reposado, Patron Gran Burdeos Extra Anejo, Patron Piedra Extra Anejo, Patron Reposado, Patron Silver, Siete Leguas Blanco, Siete Leguas Extra Anejo, Siete Leguas Reposado, Tapatio Anejo, Tapatio Blanco 110, Tears of Llorona Extra Anejo 1L, Tequila Ocho Anejo, Tequila Ocho Blanco, Tequila Ocho Extra Anejo, Tequila Ocho Reposado, Volcan Tahona Blanco, Volcan X.A. Reposado, Wild Common Blanco', points: 6 },
  { id: 'cs-6', questionText: 'When is happy hour? (List all days and hours)', correctAnswer: 'MONDAY-THURSDAY; 5-7 PM', points: 2 },
  { id: 'cs-7', questionText: 'What specials do we have on Tuesdays? (If any, list all — prices included)', correctAnswer: 'Taco Tuesday: $2 Chicken & Pork/Veggie, $4 Carne Asada & Shrimp', points: 3 },
];

const CANTINA_COCKTAILS_KEY = [
  { id: 'cc-1', questionText: 'What ingredients & measurements go into the Classic Margarita ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Cazadores Blanco Tequila, 1oz Triple Sec, 0.75oz Fresh Lime Juice, 0.5oz Agave Syrup', points: 3 },
  { id: 'cc-2', questionText: 'What ingredients & measurements go into the O.G. Paloma ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Cazadores Blanco Tequila, 3-4oz Squirt Soda', points: 2 },
  { id: 'cc-3', questionText: 'What ingredients & measurements go into the Smoked Añejo Old Fashioned ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Patrón Barrel Select Añejo Tequila, 0.5oz Smoked Honey Syrup, 3 dashes Aztec Chocolate Bitters, 2 dashes Angostura Bitters', points: 3 },
  { id: 'cc-4', questionText: 'What ingredients & measurements go into the Mai Tai ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Bacardi Superior Rum, 0.75oz Fresh Lime Juice, 0.5oz Orange Curaçao, 0.5oz Giffard Orgeat, 0.25oz Golden Falernum, 0.5oz Bacardi Black float', points: 4 },
  { id: 'cc-5', questionText: 'What ingredients & measurements go into the Painkiller ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Bacardi Reserve Ocho Rum, 1oz Coco Real, 1.5oz Orange Juice, 1.5oz Pineapple Juice', points: 3 },
  { id: 'cc-6', questionText: 'What ingredients & measurements go into the Añejo Espresso Martini ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Patrón Añejo Tequila, 1oz Cazadores Café Liqueur, 1oz Espresso, 0.5oz Ancho Reyes Chile Liqueur, 3 dashes Aztec Chocolate Bitters, 2 drops Saline Solution', points: 4 },
  { id: 'cc-7', questionText: 'What ingredients & measurements go into the Cucumber Rose ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1oz Patrón Silver Tequila, 1oz Ilegal Mezcal, 1oz Fresh Lime Juice, 1.5oz Cucumber Syrup, 3 dashes Celery Bitters, 3 dashes Cucumber Bitters', points: 4 },
  { id: 'cc-8', questionText: 'What ingredients & measurements go into the Tequila Gold Rush ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Patrón Reposado Tequila, 0.75oz Fresh Lemon Juice, 0.75oz Honey Syrup', points: 3 },
  { id: 'cc-9', questionText: 'What ingredients & measurements go into the Cantina Paloma ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Patrón Silver Tequila, 0.75oz Fresh Grapefruit Juice, 0.75oz Fresh Lime Juice, 0.5oz Simple Syrup, 2 drops Saline, 2 dashes Grapefruit Bitters, Owens Rio Red Soda', points: 4 },
  { id: 'cc-10', questionText: 'What ingredients & measurements go into the Puebla Paloma ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Cazadores Blanco Tequila, 0.75oz Fresh Grapefruit Juice, 0.75oz Fresh Lime Juice, 0.5oz Simple Syrup, Soda Water', points: 3 },
  { id: 'cc-11', questionText: 'What ingredients & measurements go into the Mezmerized ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Ilegal Mezcal, 1oz Lime Juice, 1oz Coco Real, 1oz Finest Call Mango, 0.5oz Golden Falernum, 0.5oz Pineapple Juice, 0.25oz Ancho Reyes, 0.5oz Orange Juice, 6 Mint Leaves, 3 drops Saline', points: 5 },
  { id: 'cc-12', questionText: 'What ingredients & measurements go into the Ultimate Margarita ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Patrón Reposado Tequila, 1oz Citrónge, 1oz Fresh Lime Juice, 0.5oz Simple Syrup', points: 3 },
  { id: 'cc-13', questionText: 'What ingredients & measurements go into the Violet Agave ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Patrón Silver Tequila, 0.75oz Lime Juice, 0.75oz Hibiscus Passion Fruit Syrup, 0.25oz Golden Falernum, 0.75oz Triple Sec, 1oz Pineapple Juice, 3 drops Saline', points: 4 },
  { id: 'cc-14', questionText: 'What ingredients & measurements go into the Cantina Ranch Water ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1.5oz Cazadores Blanco Tequila, 1.5oz Fresh Lime Juice, topped with approximately 3oz Topo Chico', points: 2 },
  { id: 'cc-15', questionText: 'What ingredients & measurements go into The Bullgator ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1oz Don Julio Reposado Tequila, 1oz Fresh Lime Juice, 0.75oz Grand Marnier, 0.5oz Tres Agaves Agave Nectar, 0.25oz Fresh Orange Juice (Sidecar: Don Julio 1942 Mini)', points: 4 },
  { id: 'cc-16', questionText: 'What ingredients & measurements go into the Stargarita Mocktail? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Veridoshé Ginesis, 0.75oz Fresh Lime Juice, 0.5oz Tres Agaves Agave Nectar, Quarter Fresh Squeezed Orange, 3 drops Saline, 1 dash Cardamom', points: 3 },
  { id: 'cc-17', questionText: 'What ingredients & measurements go into the Miami Vice (Frozen) ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '1oz Cool Breeze Strawberry, 2oz Cool Breeze Piña Colada Mix, 1oz Bacardi Superior Rum, 1oz Bacardi Coconut Rum', points: 3 },
  { id: 'cc-18', questionText: 'What ingredients & measurements go into the Piña Colada (Frozen) ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '3oz Cool Breeze Piña Colada Mix, 1oz Bacardi Superior Rum, 1oz Bacardi Coconut Rum', points: 2 },
  { id: 'cc-19', questionText: 'What ingredients & measurements go into our Category E11even (Frozen) ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Cool Breeze Hurricane Mix, 3oz E11EVEN Vodka, 0.5oz Bacardi Mango Chili', points: 2 },
  { id: 'cc-20', questionText: 'What ingredients & measurements go into our Frosé ? Example: 1oz Herradura Blanco Tequila, 1oz Lime Juice, 1oz Simple Syrup', correctAnswer: '2oz Cool Breeze Frosé Mix, 1oz E11EVEN Vodka, 2oz Rosé Wine', points: 2 }
];

const OAK_BRUNCH_KEY = [
  { id: 'obr-1', questionText: 'What are ALL the specific ingredients in the Beignet Croissants?', correctAnswer: 'Baked + buttered croissants. Flash fried. Dusted in powdered sugar. Served with chocolate sauce.', points: 4 },
  { id: 'obr-2', questionText: 'What are ALL the specific ingredients in the Blueberry Buttermilk Biscuits?', correctAnswer: 'Homemade buttermilk biscuits. Fresh blueberries. Lemon glaze. Lemon zest.', points: 4 },
  { id: 'obr-3', questionText: 'What are ALL the specific ingredients in the Brunch Tacos?', correctAnswer: 'Fehrenbacher breakfast sausage. Scrambled eggs. Cheddar cheese. Tater tots. Green onion. Oak hot sauce.', points: 6 },
  { id: 'obr-4', questionText: "What are ALL the specific ingredients in the Luke's Bagel + Lox?", correctAnswer: "North Atlantic cold smoked salmon. Luke's everything or plain bagel. Blackened cream cheese. Capers. Red tomatoes. Red onions. Dill.", points: 7 },
  { id: 'obr-5', questionText: "What are ALL the specific ingredients in the Farmer's Breakfast?", correctAnswer: 'Two eggs any style. Breakfast potatoes. Fehrenbacher sausage or hickory smoked bacon. Buttermilk biscuit.', points: 4 },
  { id: 'obr-6', questionText: 'What are ALL the specific ingredients in the Breakfast Rice Bowl?', correctAnswer: 'Jasmine rice. Angus filet tips. Scrambled eggs. Yellow onion. Fresh cilantro. Avocado. Spicy cilantro sauce.', points: 7 },
  { id: 'obr-7', questionText: 'What are ALL the specific ingredients in the Vegetarian Bowl?', correctAnswer: 'Breakfast potatoes. Sweet potato + black bean mix. Avocado. Asparagus. Heirloom tomatoes. Scrambled eggs. Green onion. Oak hot honey sauce.', points: 8 },
  { id: 'obr-8', questionText: 'What are ALL the specific ingredients in the OAK Smashburger?', correctAnswer: 'Angus beef. Sharp cheddar cheese. Grilled onions. House pickle. Special sauce. Seasoned waffle fries. Brioche bun.', points: 7 },
  { id: 'obr-9', questionText: 'What are ALL the specific ingredients in the Breakfast Burrito?', correctAnswer: 'Scrambled eggs. Cheddar cheese. Hickory smoked bacon. Tater tots. Chipotle sauce. Salsa verde.', points: 6 },
  { id: 'obr-10', questionText: 'What are ALL the specific ingredients in the Short Rib & Eggs?', correctAnswer: 'Braised and sous vide boneless angus beef short rib. Two eggs any style. Breakfast potatoes.', points: 3 },
  { id: 'obr-11', questionText: 'What are ALL the specific ingredients in the Country Fried Steak Sandy?', correctAnswer: 'Deep fried sirloin steak. House hollandaise. Hickory smoked bacon. Buttermilk biscuit. Breakfast potatoes.', points: 5 },
  { id: 'obr-12', questionText: 'What are ALL the specific ingredients in the Pork Belly?', correctAnswer: 'Citrus & tarragon brined pork belly. Brown sugar & molasses rub. House hollandaise. Breakfast potatoes.', points: 4 },
  { id: 'obr-13', questionText: 'What are ALL the specific ingredients in the Fried Green Tomato?', correctAnswer: 'Poached eggs. Fried green tomatoes. Pimento cheese. House hollandaise. Buttermilk biscuits. Breakfast potatoes.', points: 6 },
  { id: 'obr-14', questionText: 'What are ALL the specific ingredients in the Smoked Salmon?', correctAnswer: 'North Atlantic cold smoked salmon. Capers. House hollandaise. Buttermilk biscuits. Micro greens. Breakfast potatoes.', points: 6 },
  { id: 'obr-15', questionText: 'What are ALL the specific ingredients in the Chopped Caesar?', correctAnswer: 'Chopped baby gem lettuce. Shaved parmesan. Seasoned croutons. House made caesar dressing. (*contains raw egg)', points: 4 },
  { id: 'obr-16', questionText: 'What are the exact ingredients listed for the Sweet Potato Pancakes? Include the potato type, batter detail, butter flavor, and syrup.', correctAnswer: 'Organic sweet potatoes. Homemade batter. Cinnamon honey butter. Bourbon maple syrup.', points: 4 },
  { id: 'obr-17', questionText: 'List every ingredient in the Strawberry Spinach salad exactly as written on the menu (base green, all produce, cheese, nuts, and dressing components).', correctAnswer: 'Spinach. Fresh organic strawberries. Asparagus. Goat cheese. Walnuts. Fresh lemon juice. Olive oil.', points: 7 },
  { id: 'obr-18', questionText: 'Provide the complete ingredient list for the Fried Bird & Waffle, including the chicken cut, waffle type, fruit garnish, finishing dust, and syrup.', correctAnswer: 'Fried chicken thigh. Golden malted waffle. Fresh watermelon slices. Powdered sugar. Bourbon maple syrup.', points: 5 },
  { id: 'obr-19', questionText: 'Name all ingredients in the Cinnamon Roll Waffle, including how the base is prepared and the two toppings served with it.', correctAnswer: 'Freshly baked cinnamon roll pressed in waffle maker. Vanilla cream icing. Bourbon maple syrup.', points: 3 },
  { id: 'obr-20', questionText: 'List every single ingredient exactly as described for the Stuffed French Toast (include the bread type, batter, filling composition, and topping).', correctAnswer: 'Thick cut brioche. Vanilla batter. Fresh blueberry compote. Lemon + mascarpone cream cheese filling.', points: 4 }
];

const BEER_WINE_KNOWLEDGE_KEY = [
  { id: 'bw-1', questionText: 'Describe (in detail) five different styles of beer', correctAnswer: 'IPA (India Pale Ale) - Hoppy beer with bold citrus and pine notes, moderate to high bitterness, typically 5-7% ABV. Pilsner - Crisp, light lager with clean malt backbone and floral hop character, golden color. Stout - Dark beer with roasted malt flavors of coffee and chocolate, creamy mouthfeel. Porter - Dark ale with rich, roasted malt profile, chocolate and caramel notes. Pale Ale - Balanced beer with moderate hop bitterness and malt sweetness, citrus/floral notes. Amber/Red Ale - Malty beer with toasted caramel notes, smooth finish. Wheat Beer/Hefeweizen - Light-bodied beer with hints of banana and clove, cloudy appearance. Blonde Ale - Light, easy-drinking ale with subtle malt sweetness. Mexican Lager - Crisp, refreshing lager with clean finish, subtle malt sweetness. Sour Ale - Tart, acidic beer with fruity flavors. (Any 5 styles with detailed descriptions)', points: 5 },
  { id: 'bw-2', questionText: 'What gluten-free beers & ciders do we offer?', correctAnswer: "Original Sin Black Widow (Cider), Dry Wrought 'Mulled' (Cider), High Noon Pineapple (Seltzer), Long Drink Traditional (Seltzer), Strawberry Orange Mimosa / South Beach Mimosa (Blonde Ale - Gluten Free).", points: 4 },
  { id: 'bw-3', questionText: 'List four Florida beers we carry by the bottle/can', correctAnswer: 'First Magnitude Wakulla Hefeweizen (Gainesville, FL), Cypress & Grove Well & Good IPA (Gainesville, FL), Cypress & Grove Prairie Ride Pale Ale (Gainesville, FL), Walking Tree Babycakes Stout (Vero Beach, FL), Dry Wrought Seasonal Cider (Gainesville, FL), Strawberry Orange Mimosa Blonde Ale (Miami, FL). (Any 4 correct)', points: 4 },
  { id: 'bw-4', questionText: 'What wine varietals do we serve on special for Happy Hour?', correctAnswer: 'Reds: Impero Cabernet Sauvignon, Impero Merlot. Whites: Albertoni Chardonnay, Albertoni Pinot Grigio', points: 4 },
  { id: 'bw-5', questionText: 'How many ounces is a standard pour for wine served by the glass?', correctAnswer: '6 ounces', points: 1 },
  { id: 'bw-6', questionText: "List the red wines we serve by the glass (Brand & Varietal - There's 4)", correctAnswer: 'Don Genaro - Cabernet Sauvignon, Latitude 38 "Sonoma County" - Pinot Noir, Romulo - Malbec, Ferro 13 "The Nerd" - Nero d\'Avola', points: 8 },
  { id: 'bw-7', questionText: "List the white wines we serve by the glass (Brand & Varietal - There's 4)", correctAnswer: 'Villa Marin - Chardonnay, Villa Marin - Pinot Grigio, Ponga - Sauvignon Blanc, Echo Bay - Sauvignon Blanc', points: 8 },
  { id: 'bw-8', questionText: 'What does ABV stand for?', correctAnswer: 'Alcohol By Volume', points: 1 },
  { id: 'bw-9', questionText: 'List 5 of our CORE beers, year round on draft (Brand & Style)', correctAnswer: 'Orange Blossom Pilsner (OBP) - Pilsner (Florida Local - Tampa), Free Dive IPA - IPA (Florida Local - Coppertail, Tampa), Big Nose IPA - IPA (Gainesville Local - Swamp Head), Reel Slo Irish Red Ale - Red Ale (Florida Local - 81 Bay, Tampa), Black Butte Porter - Porter (Deschutes, Oregon), Ever Haze Hazy IPA - Hazy IPA (Florida Local - Tripping Animals, Doral), Honey Bee Citrus Blonde Ale - Citrus Blonde Ale (Gainesville Local - First Magnitude), Riot Juice Sour - Pastry Sour (Florida Local - Hidden Springs, Tampa), Tripping Animals Armored - Amber Ale (Florida Local - Doral), Easy Fridays - American Light Lager (Florida Local - Hidden Springs, Tampa), No Mames Mexican Lager - Mexican Lager (Florida Local - Tripping Animals, Doral). (Any 5 correct)', points: 10 }
];

const OAK_SPECIALITY_DESSERT_KEY = [
  // FALL 2025 SOUTHERN COCKTAILS (sc-1 through sc-10 with garnish/glassware)
  { id: 'osd-1', questionText: 'What are the ingredients, measurements, glassware, and garnish for the White Lotus?', correctAnswer: 'Ingredients: 1.5oz E11even Vodka, 0.5oz St. Germain, 1oz Coconut Milk (unsweetened), 0.75oz Rosemary Syrup, 0.75oz Pineapple Juice, 0.5oz Fresh Lime Juice. Glassware: Coupe Glass. Garnish: Float Dehydrated Lime Wheel.', points: 8 },
  { id: 'osd-2', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Duchess of Earl?', correctAnswer: "Ingredients: 1.5oz Engine Gin, 1oz Earl Gray Simple Syrup, 0.5oz Lemon Juice, 0.25oz Rockey's Liqueur, 3 drops lavender tinctures, Fever Tree Sicilian Lemonade (Topped). Glassware: Collins Glass. Garnish: Lavender Sprig + Lemon Wheel on rim.", points: 8 },
  { id: 'osd-3', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Strawberry Moon?', correctAnswer: "Ingredients: 1oz Awayuki Strawberry Gin, 0.5oz JF Haden Lychee Liqueur, 0.75oz Ginger Syrup, 0.75oz Lime Juice, 0.25oz Rockey's Botanical Liqueur, Top Sprite + Soda (split). Glassware: Rocks Glass. Garnish: Strawberry Slice on rim.", points: 8 },
  { id: 'osd-4', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Prickly Pearadox?', correctAnswer: "Ingredients: 1.5oz Pa'lante Blanco Rum, 0.5oz Golden Falernum, 0.75oz Fresh Lime Juice, 0.75oz Prickly Pear REAL, 6 Mint Leaves, Splash Coca-Cola. Glassware: Collins Glass. Garnish: Mint Bouquet.", points: 8 },
  { id: 'osd-5', questionText: 'What are the ingredients, measurements, glassware, and garnish for Fire, Flowers, & Foreplay?', correctAnswer: "Ingredients: 0.75oz Arette Reposado Tequila, 0.75oz Ilegal Mezcal, 0.5oz Ginger Liqueur, 0.5oz Hibiscus Passion, 0.25oz Rosemary Simple, 0.5oz Lemon Juice. Glassware: Rocks Glass + Gentleman's Cube. Garnish: Smoked Rosemary Sprig.", points: 8 },
  { id: 'osd-6', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Southern Sour?', correctAnswer: "Ingredients: 1.5oz Disaronno Amaretto, 0.75oz Evan Williams, 0.25oz Campari, 0.5oz Lemon Juice, 0.25oz Simple Syrup, 1 Egg White, 5 Angostura hearts. Glassware: Rocks Glass + Gentleman's Cube. Garnish: 5 drops of Angostura Bitters in a semi-circle dragged across dropper to create hearts on top of foam.", points: 9 },
  { id: 'osd-7', questionText: 'What are the ingredients, measurements, glassware, and garnish for Honeydew Me?', correctAnswer: 'Ingredients: 2oz Cazadores Blanco Tequila, 1oz Honeydew Juice, 0.75oz Lemon Juice, 0.5oz Amontillado Sherry, 0.5oz Agave Syrup, 1 jalapeno slice, 6 mint leaves. MILD VERSION: Half pipet dropper of jalapeno tinctures. Glassware: Collins Glass. Garnish: Mint Bouquet.', points: 9 },
  { id: 'osd-8', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Smoked Pecan Old Fashioned?', correctAnswer: 'Ingredients: 2oz Pecan-Infused Buffalo Trace Bourbon, 0.25oz 4-Spice Pecan Syrup, 2 dashes Chocolate Bitters. Glassware: Old Fashioned Glass. Garnish: Expressed and twisted orange peel.', points: 5 },
  { id: 'osd-9', questionText: 'What are the ingredients, measurements, glassware, and garnish for When In Sicily [Zero-Proof]?', correctAnswer: 'Ingredients: 2oz Veridoshé Ginesis, 0.25oz Lavender Syrup, 0.25oz Earl Gray Syrup, 0.75oz Lemon Juice, 3 drops saline, 1 dash cardamom. Glassware: Mason Jar. Garnish: Lemon Wheel.', points: 8 },
  { id: 'osd-10', questionText: "What are the ingredients, measurements, glassware, and garnish for Don't Mind If I Dew [Zero-Proof]?", correctAnswer: 'Ingredients: 2oz Veridoshé Ginesis, 0.5oz Honeydew Juice, 0.25oz Ginger Syrup, 0.75oz Lime Juice, 3 drops saline, Top with Tonic Water. Glassware: Mason Jar. Garnish: Ginger Candy Skewer.', points: 8 },
  // DESSERT COCKTAILS
  { id: 'osd-11', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Irish Coffee?', correctAnswer: 'Ingredients: 6oz LavAzza Hot Drip Coffee, 1.5oz Teeling Irish Whiskey, 2tsp granulated sugar, 3tbsp heavy whipping cream. Glassware: Irish Coffee Glass Mug. Garnish: None. Substitutes: (+$2) Jameson Irish, (+$2) Disaronno Amaretto.', points: 5 },
  { id: 'osd-12', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Vodka Espresso Martini?', correctAnswer: 'Ingredients: 1.5oz E11even Vodka, 0.75oz Mr. Black Coffee Liqueur, 0.5oz Turbinado Simple Syrup, 1.5oz Fresh LavAzza Espresso (pod), 3 drops 5:1 Saline. Glassware: Chilled Martini Glass. Garnish: 3 espresso beans.', points: 7 },
  { id: 'osd-13', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Reposado Espresso Martini?', correctAnswer: 'Ingredients: 1.5oz Patrón Reposado Tequila, 0.75oz Patrón XO Cafe Coffee Liqueur, 0.25oz Turbinado Simple Syrup, 1.5oz Fresh LavAzza Espresso (pod), 2 dashes chocolate bitters, 3 drops 5:1 Saline. Glassware: Chilled Martini Glass. Garnish: 3 espresso beans and single dash of nutmeg.', points: 8 },
  { id: 'osd-14', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Affogato Cocktail?', correctAnswer: 'Ingredients: 1oz E11even Vodka, 0.5oz Mr. Black Coffee Liqueur, 0.5oz Turbinado Simple Syrup, 1oz Fresh Espresso (pod), 1 Scoop Ice Cream (Vanilla or Coffee). Glassware: Coupe Glass. Garnish: Chocolate Sauce.', points: 7 },
  { id: 'osd-15', questionText: 'What are the ingredients, measurements, glassware, and garnish for the Key Lime Pie Martini?', correctAnswer: 'Ingredients: 1oz Three Olives Vanilla Vodka, 0.75oz Blue Chair Rum Key Lime Liqueur, 0.75oz Licor 43, 0.5oz Fresh Lime Juice, 0.5oz Simple Syrup, 0.25oz Heavy Cream. Glassware: Coupe Glass. Garnish: Rimmed glass with crushed graham crackers + Fresh Lime Wheel.', points: 8 }
];

// Fallback generator for other exams to keep the UI populated
const generateMockKey = (topic: string): any[] => [
  { id: 'q1', questionText: `What is the primary feature of the ${topic}?`, correctAnswer: 'Specific feature details', points: 1 },
  { id: 'q2', questionText: 'List the three steps of service.', correctAnswer: 'Greet, Take Order, Deliver', points: 3 },
  { id: 'q3', questionText: 'What is the table number for the patio corner booth?', correctAnswer: '41', points: 1 },
  { id: 'q4', questionText: `Explain the allergy protocol for ${topic}.`, correctAnswer: 'Notify manager and chef immediately', points: 2 },
  { id: 'q5', questionText: 'True or False: Napkins must be folded.', correctAnswer: 'True', points: 1 }
];

export const AVAILABLE_EXAMS: ExamDefinition[] = [
  // --- Standardized ---
  {
    id: 'std-bartender',
    title: 'Three Points Hospitality: [Bartender] Standardized Final Examination',
    category: TestCategory.STANDARDIZED,
    role: Role.BARTENDER,
    answerKey: BARTENDER_KEY
  },
  {
    id: 'std-server',
    title: 'Three Points Hospitality: [Server] Standardized Final Examination',
    category: TestCategory.STANDARDIZED,
    role: Role.SERVER,
    answerKey: SERVER_KEY
  },
  {
    id: 'std-host',
    title: 'Three Points Hospitality: [Host] Standardized Final Examination',
    category: TestCategory.STANDARDIZED,
    role: Role.HOST,
    answerKey: HOST_KEY
  },

  // --- OAK ---
  {
    id: 'oak-server',
    title: 'OAK: [Server][Location Specific] Final Examination',
    category: TestCategory.OAK,
    role: Role.SERVER,
    answerKey: OAK_SERVER_KEY
  },
  {
    id: 'oak-bartender',
    title: 'OAK: [Bartender][Location Specific] Final Examination',
    category: TestCategory.OAK,
    role: Role.BARTENDER,
    answerKey: OAK_BARTENDER_KEY
  },
  {
    id: 'oak-host',
    title: 'Original American Kitchen: [Host] Final Examination',
    category: TestCategory.OAK,
    role: Role.HOST,
    answerKey: OAK_HOST_KEY
  },
  {
    id: 'oak-cocktails',
    title: 'OAK: [Bartender][Speciality Cocktails] Test',
    category: TestCategory.OAK,
    role: Role.BARTENDER,
    subType: 'Speciality Cocktails',
    answerKey: OAK_COCKTAILS_KEY
  },
  {
    id: 'oak-brunch',
    title: 'OAK: [Server][Brunch Menu] Final Examination',
    category: TestCategory.OAK,
    role: Role.SERVER,
    subType: 'Brunch Menu',
    answerKey: OAK_BRUNCH_KEY
  },
  {
    id: 'oak-speciality-dessert',
    title: 'OAK: [Bartender][Speciality + Dessert Cocktails] Test',
    category: TestCategory.OAK,
    role: Role.BARTENDER,
    subType: 'Speciality + Dessert',
    answerKey: OAK_SPECIALITY_DESSERT_KEY
  },
  {
    id: 'beer-wine-knowledge',
    title: 'Beer & Wine Knowledge - Supplemental Examination',
    category: TestCategory.OAK,
    role: Role.BARTENDER,
    subType: 'Supplemental',
    answerKey: BEER_WINE_KNOWLEDGE_KEY
  },

  // --- Cantina ---
  {
    id: 'cantina-cocktails',
    title: 'Cantina Añejo: [Bartender][Cocktail Menu] Final Examination',
    category: TestCategory.CANTINA,
    role: Role.BARTENDER,
    subType: 'Cocktail Menu',
    answerKey: CANTINA_COCKTAILS_KEY
  },
  {
    id: 'cantina-server',
    title: 'Cantina Añejo: [Server][Location Specific] Final Examination',
    category: TestCategory.CANTINA,
    role: Role.SERVER,
    answerKey: CANTINA_SERVER_KEY
  },
  {
    id: 'cantina-host',
    title: 'Cantina Añejo: [Host] Final Examination',
    category: TestCategory.CANTINA,
    role: Role.HOST,
    answerKey: CANTINA_HOST_KEY
  },
];