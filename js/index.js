// 1. Создание и рендер разметки по массиву данных galleryItems из app.js и 
// предоставленному шаблону.
// 2. Реализация делегирования на галерее ul.js-gallery и получение url большого изображения.
// 3. Открытие модального окна по клику на элементе галереи.
// 4. Подмена значения атрибута src элемента img.lightbox__image.
// 5. Закрытие модального окна по клику на кнопку button[data-action="close-lightbox"].
// 6. Очистка значения атрибута src элемента img.lightbox__image. Это необходимо для того, 
//чтобы при следующем открытии модального окна, пока грузится изображение, мы не видели предыдущее.

//7. Закрытие модального окна по клику на div.lightbox__overlay.
//8. Закрытие модального окна по нажатию клавиши ESC.
//9. Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".

import { galleryItems } from './app.js';

const refs = {
  galleryListEl: document.querySelector('ul.gallery'),
  modalContainerEl: document.querySelector('div.lightbox'),
  lightboxOverlayEl: document.querySelector('div.lightbox__overlay'),
  modalImgEl: document.querySelector('img.lightbox__image'),
  modalCloseBtnEl: document.querySelector('[data-action="close-lightbox"]'),
};

const galleryMarkup = createGalleryMarkup(galleryItems);
refs.galleryListEl.insertAdjacentHTML('beforeend', galleryMarkup);
refs.galleryListEl.addEventListener('click', onGalleryItemClick);
refs.modalCloseBtnEl.addEventListener('click', closeModal);
refs.lightboxOverlayEl.addEventListener('click', closeModal); // 7. Закрытие модального окна по клику на div.lightbox__overlay.

// 1. Создание и рендер разметки по массиву данных galleryItems из app.js и предоставленному шаблону.

function createGalleryMarkup(galleryItems) {
  return galleryItems
    .map(({ preview, original, description }) => {
      return `<li class="gallery__item">
                    <a class="gallery__link" href="${original}">
                        <img class="gallery__image" src="${preview}" data-source="${original}" alt="${description}"/>
                    </a>
                </li>`;
    })
    .join('');
}

// 2. Реализация делегирования на галерее ul.js - gallery и получение url большого изображения.

function onGalleryItemClick(event) {
  // когда кликаешь на img, отменить по умолчанию перезагрузку страницы
  // превент действует только на событии(event/e)
  event.preventDefault();

  // 3. Открытие модального окна по клику на элементе галереи.
  
  const isGalleryEl = event.target.classList.contains('gallery__image');
  if (!isGalleryEl) {
    return;
  }
  refs.modalContainerEl.classList.add('is-open');

  // 4. Подмена значения атрибута src элемента img.lightbox__image.
  
  refs.modalImgEl.src = event.target.dataset.source;
  refs.modalImgEl.alt = event.target.getAttribute('alt');

  document.addEventListener('keydown', onEscPress);
  document.addEventListener('keydown', onArrowPress);
  
}

// 5. Закрытие модального окна по клику на кнопку button[data - action= "close-lightbox"].

function closeModal() {
  refs.modalContainerEl.classList.remove('is-open');

  // 6. Очистка значения атрибута src элемента img.lightbox__image.
  refs.modalImgEl.src = '';
  refs.modalImgEl.alt = '';

  document.removeEventListener('keydown', onEscPress);
  document.removeEventListener('keydown', onArrowPress);
}

// 8. Закрытие модального окна по нажатию клавиши ESC.

function onEscPress(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

// 9. Пролистывание изображений галереи в открытом модальном окне клавишами "влево" и "вправо".
const turnRight = currentIndex => {
  if (currentIndex === galleryItems.length - 1) return;
  const nextImg = galleryItems[currentIndex + 1].original;
  refs.modalImgEl.setAttribute('src', nextImg);
};

const turnfLeft = currentIndex => {
  if (currentIndex === 0) return;
  const previousImg = galleryItems[currentIndex - 1].original;
  refs.modalImgEl.setAttribute('src', previousImg);
};

function onArrowPress(event) {
  if (refs.modalContainerEl.classList.contains('is-open')) {
    const currentImg = refs.modalImgEl.getAttribute('src');
    const currentIndex = galleryItems.indexOf(
      galleryItems.find(item => item.original === currentImg),
    );
    if (event.code === 'ArrowRight') turnRight(currentIndex);
    if (event.code === 'ArrowLeft') turnfLeft(currentIndex);
  }
}
