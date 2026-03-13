# MealNest

MealNest is a responsive web application for discovering Nigerian dishes. It fetches meal data from a REST API and presents results in an interactive card grid, with search, filtering, favorites, and detailed modal views.

The project is designed as a clean front-end portfolio app built with HTML, Tailwind CSS, and vanilla JavaScript.

## Features

- Browse Nigerian dishes in a responsive card layout
- Fetch food data from an external REST API
- Search meals by name or description
- Filter meals by:
  - Category
  - Region
  - Vegetarian
  - Spicy
- Favorite/unfavorite meals with persistence in localStorage
- Open a detailed modal view for each meal
- View ingredients, region, category, and calories in the modal
- Toast notifications for favorite actions
- Smooth UI animations and hover interactions

## Technologies Used

- HTML5
- Tailwind CSS (via CDN)
- Vanilla JavaScript (ES6+)
- Browser localStorage API
- REST API integration (Fetch API)

## Project Structure

```text
mealnest/
├── index.html      # Main UI structure and Tailwind styling
└── script.js       # Data fetching, rendering, filters, favorites, modal logic
```

## How the Filtering System Works

The filtering logic is centralized in the applyFilters function in script.js.

Filtering is applied in sequence:

1. Start with all fetched foods.
2. Optionally limit to favorites-only mode.
3. Apply category and region dropdown filters.
4. Apply vegetarian and spicy checkbox filters.
5. Apply text search against:
   - Food name
   - Food description
6. Re-render the filtered result set to the card grid.

Filter controls trigger applyFilters through event listeners (change/input), so updates are immediate.

## How Favorites Work (localStorage)

Favorites are stored as an array of food IDs in localStorage under the key favorites.

Behavior:

1. On app load, favorites are read from localStorage.
2. Clicking a heart icon toggles favorite state for that meal.
3. The updated favorites array is saved back to localStorage.
4. UI is refreshed so card and modal favorite states stay in sync.
5. A toast notification confirms add/remove actions.

This keeps favorite selections persistent across page refreshes.

## Run the Project Locally

### Option 1: Open directly

1. Clone or download this repository.
2. Open the project folder.
3. Open index.html in your browser.

### Option 2: Use a local server (recommended)

Using a local server is more reliable for frontend development.

If you have VS Code, you can use Live Server:

1. Open the folder in VS Code.
2. Start Live Server on index.html.
3. Open the generated localhost URL.

## API Endpoint

Meal data is fetched from:

https://mongotest2026.vercel.app/api/foods

Expected behavior:

- The app reads the response JSON
- Uses the data array to populate cards and filter options

## Implementation Notes

- Dish images are assigned using a manual imageMap object in script.js.
- If a dish is missing in imageMap, a placeholder image is used.
- Modal and favorites are fully client-side state interactions.

## Future Improvements

- Add pagination or infinite scroll for larger datasets
- Add loading skeletons and improved API error states
- Add sorting (A-Z, calories, popularity)
- Add category/region chips and multi-select filters
- Add unit/integration tests for core UI logic
- Add dark mode toggle
- Move image mapping to API or CMS-backed source
- Add accessibility enhancements (ARIA labels and keyboard trap in modal)

## Author

Paulolutunmbi

If you are using this project as a template, feel free to replace this section with your name, GitHub profile, and portfolio links.
