// html den gelenler
const basketBtn = document.querySelector("#basket");
const closeBtn = document.querySelector("#close");
const modalWrapper = document.querySelector(".modal-wrapper");
const productList = document.querySelector(".products");
const categoryList = document.querySelector(".categories");
const basketList = document.querySelector("#mList");
const totalSpan = document.querySelector("#total-price");
const totalCount = document.querySelector("#count");
//html yüklenme anı

document.addEventListener("DOMContentLoaded", () => {
  fetchCategories();
  fetchProducts();
});

const baseUrl = "https://api.escuelajs.co/api/v1";
/*
kategori bilgilerini alma
1- api istek at
2- gelen veriyi işle
3- gelen veriyi ekrana basacak fonk bastır
4- cvp hatalı olırsa kullanıcıyı bilgilendir.

*/

function fetchCategories() {
  fetch(`${baseUrl}/categories`)
    .then((res) => res.json())
    .then((data) => renderCategories(data.slice(1, 5)))
    .catch((err) => console.log(err));
}

function renderCategories(categories) {
  categories.forEach((category) => {
    // div oluştur
    const categoryDiv = document.createElement("div");

    // dive clas wkle
    categoryDiv.classList.add("category-card");
    //div içeriğini belirleme
    categoryDiv.innerHTML = ` 
    <img src=${category.image} />
    <p>${category.name}</p>
    `;

    //oluşturulan divi categories divine ekle
    categoryList.appendChild(categoryDiv);
  });
}

// ürünler kısmı

//document.addEventListener('DOMContentLoaded', fetchProducts);
function fetchProducts() {
  fetch(`${baseUrl}/products`)
    .then((res) => res.json())
    .then((data) => renderProducts(data.slice(0, 40)))
    .catch((err) => console.log(err));
}

function renderProducts(products) {
  products.forEach((product) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("products-card");
    productDiv.innerHTML = `
        <img src=${product.images}>
            <p>${product.title}</p>
            <p>${product.category.name ? product.category.name : "Diğer"}</p>
            <div class="products-shop">
              <span>${product.price}$</span>
              <button onClick="addToBasket({id:${product.id}, title:'${
      product.title
    }', price:${product.price}, img:'${
      product.images
    }', amount:1})">Sepete Ekle</button>
            </div>`;
    productList.appendChild(productDiv);
  });
}
//sepet değişkeni

let basket = [];
let total = 0;
// modalişlemleri

basketBtn.addEventListener("click", () => {
  modalWrapper.classList.add("active");
  //sepetteki ürünleri listeleme
  renderBasket();
});

closeBtn.addEventListener("click", () => {
  modalWrapper.classList.remove("active");
});

// sepet işlemleri
// addToBasket fonksiyonu html deki on clickden alındı

//sepete ekleme işlemi
function addToBasket(product) {
  const found = basket.find((i) => i.id === product.id);
  if (found) {
    //eleman sepette varsa miktarı artır
    found.amount++;
  } else {
    //eleman sepette yoksa sepete ekle
    basket.push(product);
  }
}

//sepete elemanalrı listeleme

function renderBasket() {
  const cardsHTML = basket
    .map(
      (product) => ` <div class="mItem">
  <img src=${product.img}>
  <h3 class="title">${product.title}</h3>
  <h4 class="price">${product.price}$</h4>
  <p>Miktar: ${product.amount}</p>
  <img id="delete" onclick='deleteItem(${product.id})' src="img/icons8-trash-48.png"> 
</div>  `
    )
    .join(" ");

  basketList.innerHTML = cardsHTML;

  calculateTotal();
}

// sepete toplamı ayarlama

function calculateTotal() {
  //toplam fiyatı hesapla
  const sum = basket.reduce((sum, i) => sum + i.price * i.amount, 0);

  //ürün miktarını hesapla

  const amountTotal = basket.reduce((amount, i) => amount + i.amount, 0);
  totalSpan.innerText = sum;
  totalCount.innerText = amountTotal + " " + "Ürün" + " ";
}

//sepetten ürünsilme

function deleteItem(deleteid) {
  basket = basket.filter((i) => i.id !== deleteid);
  // listeyi günceller
  renderBasket();

  // toplam güncelle
  calculateTotal();
}
