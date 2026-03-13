const API_URL = "https://mongotest2026.vercel.app/api/foods";

let allFoods = [];
let favorites = (JSON.parse(localStorage.getItem("favorites")) || []).map(String);
let showFavoritesOnly = false;

const foodGrid = document.getElementById("foodGrid");
const favoritesBtn = document.getElementById("favoritesBtn");

const categoryFilter = document.getElementById("categoryFilter");
const regionFilter = document.getElementById("regionFilter");
const vegFilter = document.getElementById("vegFilter");
const spicyFilter = document.getElementById("spicyFilter");
const searchInput = document.getElementById("searchInput");
const clearFilters = document.getElementById("clearFilters");

const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const toast = document.getElementById("toast");

// IMAGES
const imageMap = {
  "Jollof Rice":"https://kikifoodies.com/wp-content/uploads/2021/09/00394B9D-0996-41CE-B905-B2EDACB37FCF.jpeg",
  "Egusi Soup":"https://simshomekitchen.com/wp-content/uploads/2025/09/Egusi-in-a-bowl-with-assorted-meat-1152x1536.jpg",
  "Pounded Yam":"https://www.chefspencil.com/wp-content/uploads/Pounded-Yam-4-1.jpg.webp",
  "Suya":"https://simshomekitchen.com/wp-content/uploads/2021/03/Nigerian-beef-suya-on-kebab-sticks-with-red-onions-tomato-and-cucmbers.jpg",
  "Akara":"https://3.bp.blogspot.com/-a8-5WMmGbPI/UY00_4h7s3I/AAAAAAAAAvk/XA4KE3tAn08/s1600/akara+nigerian+akara.jpg",
  "Moi Moi":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Moi_moi_with_fresh_fish_and_boiled_egg.jpg/500px-Moi_moi_with_fresh_fish_and_boiled_egg.jpg",
  "Efo Riro":"https://dooneyskitchen.com/wp-content/uploads/2021/05/Efo-Riro.jpg",
  "Fried Rice":"https://kikifoodies.com/wp-content/uploads/2024/01/5447E9BE-44B1-428D-8E53-27805DFB7F27-1024x576.jpeg",
  "Pepper Soup":"https://sisijemimah.com/wp-content/uploads/2016/11/IMG_7616.jpg",
  "Amala":"https://yummieliciouz.com/wp-content/uploads/2023/04/easy-amala-fele-fele-1024x683.jpg",
  "Boli (Roasted Plantain)":"https://eatwellabi.com/wp-content/uploads/2021/05/air-fryer-plantain-1.jpg",
  "Ofada Rice":"https://cdn.vanguardngr.com/wp-content/uploads/2021/06/Ofada-rice.jpg",
  "Edikang Ikong":"https://dooneyskitchen.com/wp-content/uploads/2021/05/65420802_2351646824919470_1276905204786332548_n.jpg",
  "Tuwo Shinkafa":"https://eatwellabi.com/wp-content/uploads/2022/10/Jamaican-chicken-soup-and-tuwo-15.jpg",
  "Puff Puff":"https://simshomekitchen.com/wp-content/uploads/2023/01/Puff-puffs-in-a-white-bowl.jpg",
  "Oha Soup":"https://sisijemimah.com/wp-content/uploads/2016/09/IMG_7848.jpg",
  "Chin Chin":"https://www.myactivekitchen.com/wp-content/uploads/2015/08/chin-chin-recipe_image-4.jpg",
  "Afang Soup":"https://dooneyskitchen.com/wp-content/uploads/2021/05/62136809_2571314322902319_6293184519991610311_n.jpg",
  "Nkwobi":"https://dooneyskitchen.com/wp-content/uploads/2021/03/nkwobi-2.jpg",
  "Ewa Agoyin":"https://www.citysaver.ng/wp-content/uploads/2024/03/beans-768x756.jpg",
  "Gizdodo":"https://momj3kitchen.com/wp-content/uploads/2022/02/Add-a-heading-41-min.png",
  "Okro Soup":"https://foods.africanmarketdubai.com/wp-content/uploads/2024/10/okro-soup.jpeg",
  "Banga Soup":"https://cdn.businessday.ng/2019/11/ofe-akwu.png",
  "Masa":"https://afrifoodnetwork.com/wp-content/uploads/2023/07/B08B0940-B539-4FE3-A6FC-F1D25E4597FB.jpeg",
  "Abacha (African Salad)":"https://www.foodnify.com/wp-content/uploads/2024/09/abacha-food.jpg",
  "Ofensala (White Soup)":"https://i.ytimg.com/vi/FXI1dAdwl-8/sddefault.jpg",
  "Dodo (Fried Plantain)":"https://simshomekitchen.com/wp-content/uploads/2021/09/Cooked-plantain-in-a-white-plate-and-a-silver-fork.jpg",
  "Miyan Kuka":"https://www.foodnify.com/wp-content/uploads/2024/09/miyan-kuka.jpg",
  "Asaro (Yam Porridge)":"https://pan-african.net/wp-content/uploads/2021/04/Yam-porridge-768x432.jpg",
  "Yamarita (Egg-coated Yam)":"https://i0.wp.com/dobbyssignature.com/wp-content/uploads/2023/04/yamarita-recipe.jpg?fit=948%2C528&ssl=1"
};

// TOAST
function showToast(message){
  toast.textContent = message;
  toast.classList.remove("hidden");
  setTimeout(()=>{ toast.classList.add("hidden"); },2000);
}

// FETCH FOODS
async function loadFoods(){
  try{
    const res = await fetch(API_URL);
    const data = await res.json();
    allFoods = data.data;
    populateFilters();
    renderFoods(allFoods);
  } catch(err){
    console.error("API error:", err);
  }
}

// RENDER CARDS
function renderFoods(list){
  foodGrid.innerHTML = "";

  list.forEach(food=>{
    const isFavorite = favorites.includes(String(food.id));

    const card = document.createElement("div");
    card.className = "food-card bg-white shadow rounded-lg p-4 cursor-pointer";

    card.innerHTML = `
      <img src="${imageMap[food.name] || 'https://via.placeholder.com/400'}" loading="lazy" class="w-full h-40 object-cover rounded mb-3 modal-img">
      <h2 class="text-lg font-bold flex justify-between items-center">
        ${food.name}
        <svg data-id="${food.id}" class="favorite-btn w-6 h-6" viewBox="0 0 24 24" fill="${isFavorite ? 'orange' : 'white'}" stroke="orange" stroke-width="1.5">
          <path d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547C3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5c-1.86 0-3.47 1.136-4.25 2.79"/>
        </svg>
      </h2>
      <p class="text-gray-600">${food.description}</p>
    `;

    foodGrid.appendChild(card);

    // OPEN MODAL
    card.addEventListener("click", (e)=>{
      if(e.target.closest(".favorite-btn")) return;
      openModal(food);
    });

    // FAVORITE BUTTON
    card.querySelector(".favorite-btn").addEventListener("click",(e)=>{
      e.stopPropagation();
      toggleFavorite(food.id);
    });
  });
}

// TOGGLE FAVORITE
function toggleFavorite(id){
  const idKey = String(id);
  if(favorites.includes(idKey)){
    favorites = favorites.filter(f=>f!==idKey);
    showToast("Removed from favorites");
  } else {
    favorites.push(idKey);
    showToast("Added to favorites");
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
  applyFilters();
}

// MODAL
function openModal(food){
  const isFavorite = favorites.includes(String(food.id));

  modalContent.innerHTML = `
    <img src="${imageMap[food.name] || 'https://via.placeholder.com/400'}" class="w-full h-52 object-cover rounded mb-4">
    <h2 class="text-xl font-bold flex justify-between">
      ${food.name}
      <svg data-id="${food.id}" class="modal-favorite-btn w-7 h-7 cursor-pointer" viewBox="0 0 24 24" fill="${isFavorite ? 'orange' : 'white'}" stroke="orange" stroke-width="1.5">
        <path d="M7.75 3.5C5.127 3.5 3 5.76 3 8.547C3 14.125 12 20.5 12 20.5s9-6.375 9-11.953C21 5.094 18.873 3.5 16.25 3.5"/>
      </svg>
    </h2>
    <p class="mt-2">${food.description}</p>
    <h3 class="font-bold mt-4">Ingredients</h3>
    <ul class="list-disc ml-5">${food.ingredients.map(i=>`<li>${i}</li>`).join("")}</ul>
    <p class="mt-3"><b>Region:</b> ${food.region}</p>
    <p><b>Category:</b> ${food.category}</p>
    <p><b>Calories:</b> ${food.calories}</p>
  `;

  const modalFavoriteBtn = modalContent.querySelector(".modal-favorite-btn");
  if(modalFavoriteBtn){
    modalFavoriteBtn.addEventListener("click",(e)=>{
      e.stopPropagation();
      toggleFavorite(food.id);
      // Update the fill color dynamically
      modalFavoriteBtn.setAttribute("fill", favorites.includes(String(food.id)) ? "orange" : "white");
    });
  }

  modal.classList.remove("hidden");
}

// CLOSE MODAL
closeModal.addEventListener("click", ()=>{ modal.classList.add("hidden"); });
document.addEventListener("keydown", (e)=>{ if(e.key==="Escape") modal.classList.add("hidden"); });

// FILTERS
function applyFilters(){
  let filtered = [...allFoods];

  if(showFavoritesOnly) filtered = filtered.filter(f=>favorites.includes(String(f.id)));
  if(categoryFilter.value) filtered = filtered.filter(f=>f.category===categoryFilter.value);
  if(regionFilter.value) filtered = filtered.filter(f=>f.region===regionFilter.value);
  if(vegFilter.checked) filtered = filtered.filter(f=>f.isVegetarian);
  if(spicyFilter.checked) filtered = filtered.filter(f=>f.isSpicy);

  const searchValue = searchInput.value.toLowerCase();
  if(searchValue){
    filtered = filtered.filter(f=>
      f.name.toLowerCase().includes(searchValue) ||
      f.description.toLowerCase().includes(searchValue)
    );
  }

  renderFoods(filtered);
}

// FILTER EVENTS
categoryFilter.addEventListener("change", applyFilters);
regionFilter.addEventListener("change", applyFilters);
vegFilter.addEventListener("change", applyFilters);
spicyFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// FAVORITES BUTTON
favoritesBtn.addEventListener("click", ()=>{
  showFavoritesOnly = !showFavoritesOnly;
  favoritesBtn.textContent = showFavoritesOnly ? "All Meals" : "Favorites";
  favoritesBtn.classList.toggle("bg-orange-600", showFavoritesOnly);
  favoritesBtn.classList.toggle("bg-orange-500", !showFavoritesOnly);
  applyFilters();
});

// CLEAR FILTERS
clearFilters.addEventListener("click", ()=>{
  categoryFilter.value="";
  regionFilter.value="";
  vegFilter.checked=false;
  spicyFilter.checked=false;
  searchInput.value="";
  applyFilters();
});

// POPULATE FILTER OPTIONS
function populateFilters(){
  const categories = [...new Set(allFoods.map(f=>f.category))];
  categories.forEach(c=>{
    const option = document.createElement("option");
    option.value = c;
    option.textContent = c;
    categoryFilter.appendChild(option);
  });

  const regions = [...new Set(allFoods.map(f=>f.region))];
  regions.forEach(r=>{
    const option = document.createElement("option");
    option.value = r;
    option.textContent = r;
    regionFilter.appendChild(option);
  });
}

// LOAD DATA
loadFoods();