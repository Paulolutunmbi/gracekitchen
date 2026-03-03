const API_URL = "https://mongotest2026.vercel.app/api/foods";

const grid = document.getElementById("foodsGrid");
const loader = document.getElementById("loader");
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const regionFilter = document.getElementById("regionFilter");
const vegFilter = document.getElementById("vegFilter");
const spicyFilter = document.getElementById("spicyFilter");
const clearFilters = document.getElementById("clearFilters");

let allFoods = []; // store all foods globally

// Fetch foods from API
async function fetchFoods() {
  try {
    loader.classList.remove("hidden");
    grid.innerHTML = "";

    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

    const result = await response.json();
    allFoods = result.data;

    populateFilters();
    renderFoods(allFoods);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <div class="text-center">
        <p class="text-red-500 mb-4">Failed to load foods.</p>
        <button onclick="fetchFoods()" class="bg-orange-600 text-white px-4 py-2 rounded">
          Retry
        </button>
      </div>
    `;
  } finally {
    loader.classList.add("hidden");
  }
}

// Render food cards
function renderFoods(foods) {
  grid.innerHTML = "";
  if (foods.length === 0) {
    grid.innerHTML = "<p class='text-center col-span-3'>No foods found.</p>";
    return;
  }

  foods.forEach(food => {
    const card = `
      <div class="bg-white shadow-md rounded-xl p-4 hover:shadow-xl transition">
        <h2 class="text-xl font-bold mb-2">${food.name}</h2>
        <p class="text-gray-600 text-sm mb-2">${food.description}</p>
        <p class="text-sm">Calories: ${food.calories}</p>
        <p class="text-sm">Prep Time: ${food.preparationTime} mins</p>
        <p class="text-sm font-semibold">Price: ₦${food.price}</p>
      </div>
    `;
    grid.innerHTML += card;
  });
}

// Populate category & region filters dynamically
function populateFilters() {
  const categories = [...new Set(allFoods.map(f => f.category))];
  const regions = [...new Set(allFoods.map(f => f.region))];

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  regions.forEach(reg => {
    const option = document.createElement("option");
    option.value = reg;
    option.textContent = reg;
    regionFilter.appendChild(option);
  });
}

// Apply filters
function applyFilters() {
  let filtered = [...allFoods];

  if (categoryFilter.value) filtered = filtered.filter(f => f.category === categoryFilter.value);
  if (regionFilter.value) filtered = filtered.filter(f => f.region === regionFilter.value);
  if (vegFilter.checked) filtered = filtered.filter(f => f.isVegetarian);
  if (spicyFilter.checked) filtered = filtered.filter(f => f.isSpicy);
  
  const searchValue = searchInput.value.toLowerCase();
  if (searchValue) {
    filtered = filtered.filter(f =>
      f.name.toLowerCase().includes(searchValue) ||
      f.description.toLowerCase().includes(searchValue)
    );
  }

  renderFoods(filtered);
}

// Event listeners
categoryFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);
vegFilter.addEventListener("change", applyFilters);
spicyFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);
clearFilters.addEventListener("click", () => {
  categoryFilter.value = "";
  regionFilter.value = "";
  vegFilter.checked = false;
  spicyFilter.checked = false;
  searchInput.value = "";
  renderFoods(allFoods);
});

// Initial load
fetchFoods();