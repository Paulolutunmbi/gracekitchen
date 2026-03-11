const API_URL = "https://mongotest2026.vercel.app/api/foods";

const grid = document.getElementById("foodsGrid");
const loader = document.getElementById("loader");

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const regionFilter = document.getElementById("regionFilter");

const vegFilter = document.getElementById("vegFilter");
const spicyFilter = document.getElementById("spicyFilter");

const clearFilters = document.getElementById("clearFilters");

const favoritesView = document.getElementById("favoritesView");
const clearFavorites = document.getElementById("clearFavorites");

const foodModal = document.getElementById("foodModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.remove("opacity-0");

  setTimeout(() => {
    toast.classList.add("opacity-0");
  }, 2000);
}
const homeBtn = document.getElementById("homeBtn");

homeBtn.addEventListener("click", () => {

  currentView = "all";

  renderFoods(allFoods);

});

let allFoods = [];

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentView = "all";

function saveFavorites() {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

async function fetchFoods() {
  try {
    loader.classList.remove("hidden");
    grid.innerHTML = "";

    const response = await fetch(API_URL);

    if (!response.ok) throw new Error("HTTP error");

    const result = await response.json();

    allFoods = result.data;
    allFoods = allFoods.map(food => ({
  ...food,
  image: food.image || "https://source.unsplash.com/400x300/?food"
}));
    populateFilters();

    renderFoods(allFoods);
  } catch (error) {
    grid.innerHTML = `
<div class="text-center">
<p class="text-red-500">Failed to load foods</p>
<button onclick="fetchFoods()"
class="bg-orange-600 text-white px-4 py-2 rounded">
Retry
</button>
</div>
`;
  } finally {
    loader.classList.add("hidden");
  }
}

function renderFoods(foods) {
  grid.innerHTML = "";

  if (foods.length === 0) {
    grid.innerHTML = `
<div class="col-span-full text-center text-gray-500 py-10">
🍽 No foods match your filters
</div>
`;
    return;
  }

  foods.forEach((food) => {
    const card = document.createElement("div");

    card.className =
"bg-white shadow-md rounded-xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition transform duration-200 cursor-pointer";

    const vegIcon = food.isVegetarian ? "🌱 Vegetarian" : "";
    const spicyIcon = food.isSpicy ? "🌶 Spicy" : "";
    const isFavorite = favorites.some((f) => f.id === food.id);
const heart = `
<svg xmlns="http://www.w3.org/2000/svg"
class="w-6 h-6 transition transform hover:scale-110 ${isFavorite ? "text-orange-600 fill-orange-600" : "text-orange-600 fill-white"}"
viewBox="0 0 24 24"
stroke="currentColor"
stroke-width="1.5"
stroke-linecap="round"
stroke-linejoin="round">

<path d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547C3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79c-.78-1.654-2.39-2.79-4.25-2.79"/>
</svg>
`;
    card.innerHTML = `

<img 
src="${food.image || 'https://via.placeholder.com/400x300'}"
alt="${food.name}"
class="w-full h-44 object-cover">

<div class="p-4">

<h2 class="text-xl font-bold mb-2 flex justify-between items-center">
${food.name}

<button class="favorite-btn">
${heart}
</button>

</h2>
<p class="text-gray-600 text-sm mb-2">${food.description}</p>

<div class="flex gap-3 text-sm mb-2">
${vegIcon}
${spicyIcon}
</div>

<p class="text-sm">Calories: ${food.calories}</p>

<p class="text-sm">Prep Time: ${food.preparationTime} mins</p>

<p class="text-sm font-semibold">₦${food.price}</p>

</div>
`;
card.querySelector(".favorite-btn")
.addEventListener("click",(e)=>{

e.stopPropagation();
toggleFavorite(food);

if (currentView === "favorites") {
  renderFoods(favorites);
} else {
  renderFoods(allFoods);
}

});

    card.addEventListener("click", () => openModal(food));

    grid.appendChild(card);
  });
}

function openModal(food) {
  const isFavorite = favorites.some((f) => f.id === food.id);

  modalContent.innerHTML = `
<h2 class="text-2xl font-bold mb-2">${food.name}</h2>

<p class="mb-2">${food.description}</p>

<p><strong>Calories:</strong> ${food.calories}</p>
<p><strong>Prep Time:</strong> ${food.preparationTime} mins</p>

<div class="flex gap-3 mt-2 mb-3">
${food.isVegetarian ? "🌱 Vegetarian" : ""}
${food.isSpicy ? "🌶 Spicy" : ""}
</div>

<h3 class="font-semibold mt-4 mb-2">Ingredients</h3>

<ul class="list-disc pl-5 text-sm mb-4">
${food.ingredients ? food.ingredients.map((i) => `<li>${i}</li>`).join("") : "<li>No ingredients listed</li>"}
</ul>

<button id="favoriteBtn"
class="bg-orange-600 text-white px-4 py-2 rounded">
${isFavorite ? "Remove Favorite ❤️" : "Add to Favorites 🤍"}
</button>
`;

  foodModal.classList.remove("hidden");

  document.getElementById("favoriteBtn").addEventListener("click", () => {
    toggleFavorite(food);

    openModal(food);
  });
}

function toggleFavorite(food) {
  const exists = favorites.find((f) => f.id === food.id);

  if (exists) {
    favorites = favorites.filter((f) => f.id !== food.id);
    saveFavorites();
    showToast("Removed from favorites");
  } else {
    favorites.push(food);
    saveFavorites();
    showToast("Added to favorites");
  }
}

function populateFilters() {
  const categories = [...new Set(allFoods.map((f) => f.category))];

  const regions = [...new Set(allFoods.map((f) => f.region))];

  categories.forEach((cat) => {
    const option = document.createElement("option");

    option.value = cat;
    option.textContent = cat;

    categoryFilter.appendChild(option);
  });

  regions.forEach((reg) => {
    const option = document.createElement("option");

    option.value = reg;
    option.textContent = reg;

    regionFilter.appendChild(option);
  });
}

function applyFilters() {
  let filtered = [...allFoods];

  if (categoryFilter.value)
    filtered = filtered.filter((f) => f.category === categoryFilter.value);

  if (regionFilter.value)
    filtered = filtered.filter((f) => f.region === regionFilter.value);

  if (vegFilter.checked) filtered = filtered.filter((f) => f.isVegetarian);

  if (spicyFilter.checked) filtered = filtered.filter((f) => f.isSpicy);

  const searchValue = searchInput.value.toLowerCase();

  if (searchValue) {
    filtered = filtered.filter(
      (f) =>
        f.name.toLowerCase().includes(searchValue) ||
        f.description.toLowerCase().includes(searchValue),
    );
  }

  renderFoods(filtered);
}

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

favoritesView.addEventListener("click", () => {
  currentView = "favorites";
  renderFoods(favorites);
});

clearFavorites.addEventListener("click", () => {

  favorites = [];

  saveFavorites();

  showToast("Favorites cleared");

  if(currentView === "favorites"){
    renderFoods([]);
  }

});

closeModal.addEventListener("click", () => {
  foodModal.classList.add("hidden");
});

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    foodModal.classList.add("hidden");
  }
});

fetchFoods();
