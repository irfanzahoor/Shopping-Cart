// elements
const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cart-sidebar");
const closeBtn = document.getElementById("close-btn");
const cartProducts = document.getElementById("cart-products");
const totalPriceElement = document.getElementById("total-price");
const totalQuantityElement = document.getElementById("total-quantity");
const totalQuantityText = document.getElementById("total-quantity-text");

cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("show");
});

closeBtn.addEventListener("click", () => {
  cartSidebar.classList.remove("show");
});

/* variables */
// products data
let productsArray = [];
// all products (as NodeList)
let productsNodeList;
// all products (as Array)
let productsNodeArray;

/* functions */
// get products
const getProducts = async () => {
  const response = await fetch("./products-data.json");
  const data = await response.json();
  productsArray = data.products;
};

// display products
const displayProducts = () => {
  let productsHTML = "";
  productsArray.forEach((product) => {
    productsHTML += `
        <div id="${product.id}" class="product">
          <div class="details">
            <img src=${product.img} alt=${product.name} class="product-img" />
            <div class="product-info">
              <p class="product-name">${product.name}</p>
              <p class="product-price">$${product.price}</p>
            </div>
          </div>
          <div class="controls">
            <div class="quantity">
              <button data-product-id="${product.id}" class="decrement-btn">
                <i class="fa-solid fa-minus fa-sm"></i>
              </button>
              <p class="quantity-num">${product.quantity}</p>
              <button data-product-id="${product.id}" class="increment-btn">
                <i class="fa-solid fa-plus fa-sm"></i>
              </button>
            </div>
            <button data-product-id="${product.id}" class="trash-btn">
              <i class="fa-solid fa-trash-can fa-lg"></i>
            </button>
          </div>
        </div>
    `;
  });

  cartProducts.innerHTML = productsHTML;
};

// remove a product
const removeProduct = (trashButton) => {
  // product to remove
  const productToRemove = productsNodeArray.find(
    (product) => product.id === trashButton.dataset.productId
  );

  // steps:
  // 1- update products array
  // 2- update UI

  // remove product from DOM
  productToRemove.remove();
  // remove product from products array
  productsArray = productsArray.filter(
    (product) => product.id !== parseInt(trashButton.dataset.productId)
  );
  // update the Nodes array
  updateNodesArray();
};

// decrease quantity
const decreaseQuantity = (decrementButton) => {
  // product to decrease
  const productToDecrease = productsNodeArray.find(
    (product) => product.id === decrementButton.dataset.productId
  );

  // index of product
  const productIndex = productsArray.findIndex(
    (product) => product.id === parseInt(decrementButton.dataset.productId)
  );

  // steps:
  // 1- update products array
  // 2- update UI

  // if quantity is 1, remove the product
  if (productsArray[productIndex].quantity === 1) {
    // remove product from DOM
    productToDecrease.remove();
    // remove product from products array
    productsArray = productsArray.filter(
      (product) => product.id !== parseInt(decrementButton.dataset.productId)
    );
    // update the Nodes array
    updateNodesArray();
  }
  // if quantity is greater than 1,
  else {
    // update products array
    productsArray[productIndex].quantity =
      productsArray[productIndex].quantity - 1;
    // update quantity element
    const quantityNumElement = productToDecrease.querySelector(".quantity-num");
    quantityNumElement.textContent = productsArray[productIndex].quantity;
  }
};

// increase quantity
const increaseQuantity = (incrementButton) => {
  // product to increase
  const productToIncrease = productsNodeArray.find(
    (product) => product.id === incrementButton.dataset.productId
  );

  // index of product
  const productIndex = productsArray.findIndex(
    (product) => product.id === parseInt(incrementButton.dataset.productId)
  );

  // steps:
  // 1- update products array
  // 2- update UI

  // update products array
  productsArray[productIndex].quantity =
    productsArray[productIndex].quantity + 1;
  // update quantity element
  const quantityNumElement = productToIncrease.querySelector(".quantity-num");
  quantityNumElement.textContent = productsArray[productIndex].quantity;
};

// add event listeners to elements
const addEvents = () => {
  // all trash buttons
  const allTrashButtons = document.querySelectorAll(".trash-btn");
  // add an event for each trash button
  allTrashButtons.forEach((trashButton) => {
    trashButton.addEventListener("click", () => {
      removeProduct(trashButton);
      // update total price
      updateTotalPrice();
      // update total quantity
      updateTotalQuantity();
    });
  });

  // all decrement buttons
  const allDecrementButtons = document.querySelectorAll(".decrement-btn");
  // add an event for each decrement button
  allDecrementButtons.forEach((decrementButton) => {
    decrementButton.addEventListener("click", () => {
      decreaseQuantity(decrementButton);
      // update total price
      updateTotalPrice();
      // update total quantity
      updateTotalQuantity();
    });
  });

  // all increment buttons
  const allIncrementButtons = document.querySelectorAll(".increment-btn");
  // add an event for each increment button
  allIncrementButtons.forEach((incrementButton) => {
    incrementButton.addEventListener("click", () => {
      increaseQuantity(incrementButton);
      // update total price
      updateTotalPrice();
      // update total quantity
      updateTotalQuantity();
    });
  });
};

// in case of removing a product from DOM, update the Nodes array
const updateNodesArray = () => {
  // all products as NodeList
  productsNodeList = document.querySelectorAll(".product");
  // convert a NodeList to an Array; to use array functions
  productsNodeArray = Array.from(productsNodeList);
};

// update total price
const updateTotalPrice = () => {
  const initialTotalPrice = 0;

  const totalPrice = productsArray.reduce(
    (total, product) => total + product.price * product.quantity,
    initialTotalPrice
  );

  totalPriceElement.textContent = totalPrice;
};

// update total quantity
const updateTotalQuantity = () => {
  const initialTotalQuantity = 0;

  const totalQuantity = productsArray.reduce(
    (total, product) => total + product.quantity,
    initialTotalQuantity
  );

  totalQuantityElement.textContent = totalQuantity;

  // "item" or "items" based on total quantity
  if (totalQuantity === 1) {
    totalQuantityText.textContent = "item";
  } else {
    totalQuantityText.textContent = "items";
  }
};

// after fetching data
getProducts().then(() => {
  displayProducts();
  updateNodesArray();
  updateTotalPrice();
  updateTotalQuantity();
  addEvents();
});
