// المان‌های HTML
const loadingState = document.getElementById("loading-state");
const errorState = document.getElementById("error-state");
const errorMessage = document.getElementById("error-message");
const productsGrid = document.getElementById("products-grid");
const categoriesBar = document.getElementById("categories-bar");
const retryBtn = document.getElementById("retry-btn");

function showState(state) {
  // اول همه را مخفی می‌کنیم
  loadingState.classList.add("hidden");
  errorState.classList.add("hidden");
  productsGrid.classList.add("hidden");
  categoriesBar.classList.add("hidden"); // مخفی کردن دسته‌بندی‌ها

  // نمایش وضعیت فعلی
  if (state === "loading") loadingState.classList.remove("hidden");
  if (state === "error") errorState.classList.remove("hidden");
  if (state === "success") {
    productsGrid.classList.remove("hidden");
    categoriesBar.classList.remove("hidden");
  }
}

// تابع دریافت داده‌ها
async function loadData() {
  showState("loading");

  try {
    // استفاده از Promise.all برای دریافت همزمان محصولات و دسته‌بندی‌ها
    const [productsRes, categoriesRes] = await Promise.all([
      fetch("https://dummyjson.com/products?limit=12"),
      fetch("https://dummyjson.com/products/category-list"),
    ]);

    // بررسی خطای هر دو درخواست به صورت مجزا
    if (!productsRes.ok)
      throw new Error(`خطای دریافت محصولات: ${productsRes.status}`);
    if (!categoriesRes.ok)
      throw new Error(`خطای دریافت دسته‌بندی‌ها: ${categoriesRes.status}`);

    const productsData = await productsRes.json();
    const categoriesData = await categoriesRes.json();

    // رندر کردن هر دو بخش
    renderCategories(categoriesData);
    renderProducts(productsData.products);

    // پنهان کردن لودینگ و نمایش کل محتوا
    showState("success");
  } catch (error) {
    errorMessage.textContent = `متأسفانه مشکلی پیش آمد: ${error.message}`;
    showState("error");
  }
}

// توابع رندر کردن (بسیار تمیزتر و خواناتر)
function renderCategories(categories) {
  categoriesBar.innerHTML = categories
    .map(
      (category) =>
        `<span class="rounded-full bg-slate-100 border border-slate-200 px-4 py-1 text-sm text-slate-600">${category}</span>`,
    )
    .join("");
}

function renderProducts(products) {
  // به جای نوشتن HTML اینجا، فقط تابع createCard را پاس می‌دهیم
  productsGrid.innerHTML = products.map(createCard).join("");
}

// کامپوننت مستقل کارت محصول (با استفاده از Destructuring روی دیزاین شما)
function createCard({ title, description, price, rating, thumbnail }) {
  return `
    <div class="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col">
      <img src="${thumbnail}" alt="${title}" class="h-48 w-full object-contain mb-4 bg-slate-50 rounded-lg">
      <h2 class="font-bold text-lg text-slate-800 mb-2" dir="ltr" style="text-align: right;">${title}</h2>
      <p class="text-sm text-slate-500 mb-4 line-clamp-2" dir="ltr" style="text-align: right;">${description}</p>
      <div class="mt-auto flex justify-between items-center" dir="ltr">
        <span class="font-bold text-indigo-600 text-xl">$${price}</span>
        <span class="text-sm text-amber-500 font-medium">★ ${rating}</span>
      </div>
    </div>
  `;
}

// وصل کردن دکمه تلاش مجدد و اجرای اولیه
retryBtn.addEventListener("click", loadData);
loadData();
