const imageGallery = document.querySelector('.image--container');
const imageContainer = document.querySelector('.image--selection');
const loading = '<h1 class="loader">Loading...</h1>';
const allInfo = document.querySelector('.product');
const allBtns = document.querySelector('.basket');
const button = document.querySelector('.button');
const plus = document.querySelector('.bt_plus');
const minus = document.querySelector('.bt_minus');
const input = document.querySelector('.quantity');
const label = document.querySelector('.label--container');
const selected = document.querySelector('.quantity_inner');
const next = document.querySelector('.btn_next');
const previous = document.querySelector('.btn_prev');

function blockSelector() {
  label.innerHTML = 'Товара нет в наличии!';
  allBtns.classList.add('disabled');
  selected.classList.add('thisQuantity');
  button.classList.add('disabledBtn');
}

const createImageGallery = (product) => {
  const getUrls = JSON.parse(product.images);
  let output = '';
  imageGallery.innerHTML = `<img src="${getUrls[0].img}" class="animate-entrance image--gallery" alt="${getUrls[0]}">`;
  setTimeout(() => {
    imageGallery.children[0].classList.remove('animate-entrance');
  }, 500);
  getUrls.forEach((urls) => {
    output += `<img src="${urls.img}" alt="url" class="image__item" />`;
  });
  const arrUrls = [];
  getUrls.map((urls) => arrUrls.push(urls.img));
  imageContainer.innerHTML = output;
  if (+product.quantity === 0) {
    blockSelector();
  }
  allInfo.insertAdjacentHTML('afterbegin', `<div class="productInfo">
    <h2 class="postTitle">${product.title}</h2>
    <p>
    ${product.descr}
    </p>
    <strike>${product.priceold} $</strike> 
    ${product.price} $
    <p class='thisQuantity'>
    ${product.quantity}
    </p> 
    <p class='thisUrls'>
    ${arrUrls}
    </p>    
  </div>
`);
};

const showImages = () => {
  if (imageContainer.children.length === 0) imageContainer.innerHTML = loading;
  fetch('https://store.tildacdn.com/api/tgetproduct/')
    .then((res) => {
      res.json().then((product) => {
        createImageGallery(product);
        if (+product.quantity === 0) {
          label.innerHTML = 'Товара нет в наличии!';
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
};

document.addEventListener('DOMContentLoaded', showImages);

document.addEventListener('click', (e) => {
  e.preventDefault();
  const thisQuantity = document.querySelector('.thisQuantity');
  const objUrls = document.querySelector('.thisUrls');
  const str = objUrls.textContent;
  const result = str.replace(/\s+/g, '').split(',');
  if (e.target === plus) {
    if (+input.value < +thisQuantity.textContent) {
      input.value = +input.value + 1;
    }
    if (+input.value === +thisQuantity.textContent) {
      label.innerHTML = 'В наличии больше нет!';
    }
  }
  if (e.target === minus) {
    label.innerHTML = '';
    if (+input.value > 0) {
      input.value = +input.value - 1;
    }
  }
  if (e.target === button) {
    if (+input.value === +thisQuantity.textContent) {
      blockSelector();
    }
    document.querySelector('.item-count').innerHTML = `${input.value}`;
    input.value = 0;
  }
  if (e.target.parentNode === imageContainer) {
    const image = imageGallery.children[0];
    previous.style.display = 'flex';
    next.style.display = 'flex';
    if (e.target.src) {
      image.classList.add('animate-entrance');
      image.src = e.target.src;
      setTimeout(() => {
        image.classList.remove('animate-entrance');
      }, 800);
    }
  }
  if (e.target === next) {
    for (let i = 0; i < result.length; i++) {
      if (i === 0) {
        previous.style.display = 'flex';
      }
      if (i < result.length) {
        i++;
        imageGallery.innerHTML = `<img src="${result[i]}" class="animate-entrance image--gallery" alt="${result[i]}">`;
      }
      if (i === result.length - 1) {
        next.style.display = 'none';
      }
    }
  }
  if (e.target === previous) {
    for (let i = result.length - 1; i > 0; i--) {
      if (i === result.length - 1) {
        next.style.display = 'flex';
      }
      if (i > 0) {
        i--;
        imageGallery.innerHTML = `<img src="${result[i]}" class="animate-entrance image--gallery" alt="${result[i]}">`;
      }
      if (i === 0) {
        previous.style.display = 'none';
      }
    }
  }
}, false);
