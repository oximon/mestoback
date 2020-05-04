import Api from './js/Api';
import Card from './js/Card';
import CardList from './js/CardList';
import FormValidator from './js/FormValidator';
import Popup from './js/Popup';
import UserInfo from './js/UserInfo';
import { config } from './js/config';

import './pages/index.css';

const formAdd = document.forms.new;
const formEdit = document.forms.newEdit;
const formAvatar = document.forms.newAvatar;
const errorMessages = {
  valueMissing: 'Это обязательное поле',
  tooShort: 'Должно быть от 2 до 30 символов',
  tooLong: 'Должно быть от 2 до 30 символов',
  typeMismatch: 'Здесь должна быть ссылка',
};
const buttonSaveEdit = document.querySelector('.popup__button_fz_edit');
const buttonPlus = document.querySelector('.popup__button_fz_add');
const buttonSaveAvatar = document.querySelector('.popup__button_fz_avatar');
const placesList = document.querySelector('.places-list');
const buttonAdd = document.querySelector('.user-info__button-add');
const buttonEdit = document.querySelector('.user-info__button-edit');
const buttonAvatar = document.querySelector('.user-info__photo');

const api = new Api(config);
const cardList = new CardList(placesList, new Card(api), api);
cardList.addListeners();

const info = new UserInfo(
  document.querySelector('.user-info__name'),
  document.querySelector('.user-info__job'),
  formEdit.elements.name,
  formEdit.elements.aboutMe,
  api,
  document.querySelector('.user-info__photo'),
  formAvatar.elements.avatar,
);

const imagePopupInstance = new Popup(
  document.querySelector('.popup_open-image'),
);
const editPopupInstance = new Popup(document.querySelector('.popup_edit'));
const addPopupInstance = new Popup(document.querySelector('.popup_add'));
const avatarPopupInstance = new Popup(document.querySelector('.popup_avatar'));

const editValidator = new FormValidator(
  formEdit,
  buttonSaveEdit,
  errorMessages,
);
const addValidator = new FormValidator(formAdd, buttonPlus, errorMessages);
const avatarValidator = new FormValidator(
  formAvatar,
  buttonSaveAvatar,
  errorMessages,
);

editValidator.setEventListeners();
addValidator.setEventListeners();
avatarValidator.setEventListeners();

cardList.renderApi();
info.fillingInputs();
info.updateUserInfo();
info.updateAvatarUserInfo();

// Слушатели //

// открыть/закрыть попап с аватаром
buttonAvatar.addEventListener('click', () => {
  avatarPopupInstance.toggle();
});
avatarPopupInstance.addListeners();

// Открыть/закрыть попап с картинкой
document.addEventListener('click', (event) => {
  if (event.target.classList.contains('place-card__image')) {
    imagePopupInstance.toggle();
    document
      .querySelector('.popup__image')
      .setAttribute('src', event.target.getAttribute('style').slice(23, -2));
  }
});

imagePopupInstance.addListeners();

// открыть/закрыть попап с попапом добавления карточки

buttonAdd.addEventListener('click', () => {
  addPopupInstance.toggle();
});
addPopupInstance.addListeners();

// открыть/закрыть попал с редактированием профиля

buttonEdit.addEventListener('click', () => {
  editPopupInstance.toggle();
});
editPopupInstance.addListeners();

// Кнопка сохранить edit

formEdit.addEventListener('submit', (event) => {
  event.preventDefault();
  info.renderLoading(true, 'Сохранить', 'Загрузка...', buttonSaveEdit);

  info.updateUserInfoApi().then(() => {
    info.renderLoading(false, 'Сохранить', 'Загрузка...', buttonSaveEdit);

    editPopupInstance.toggle();
  });
});

// Кнопка 'добавить' карточку

formAdd.addEventListener('submit', (event) => {
  event.preventDefault();
  info.renderLoading(true, '+', '...', buttonPlus);

  cardList
    .addCardApi(formAdd.elements.name.value, formAdd.elements.link.value)
    .then(() => {
      info.renderLoading(false, '+', '...', buttonPlus);

      addPopupInstance.toggle();
      formAdd.reset();
      addValidator.buttonDissable();
    });
});

formAvatar.addEventListener('submit', (event) => {
  event.preventDefault();

  info.updateAvatarUserInfoApi();

  avatarPopupInstance.toggle();
  formAvatar.reset();
  avatarValidator.buttonDissable();
});
