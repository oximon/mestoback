export default class Card {
  constructor(api) {
    this.api = api;
  }
  createCard = (name, link, likes, cardId, userId) => {
    const fragment = document.createDocumentFragment();
    const placeCard = document.createElement("div");
    const placeCardImage = document.createElement("div");
    const placeCardDescription = document.createElement("div");
    const placeCardName = document.createElement("h3");
    const placeCardLikeIcon = document.createElement("button");
    const placeCardLikeContainer = document.createElement("div");
    const placeCardLikeCounter = document.createElement("p");

    placeCard.classList.add("place-card");
    placeCardImage.classList.add("place-card__image");
    placeCardDescription.classList.add("place-card__description");
    placeCardName.classList.add("place-card__name");
    placeCardLikeIcon.classList.add("place-card__like-icon");
    placeCardLikeContainer.classList.add("place-card__like-container");
    placeCardLikeCounter.classList.add("place-card__like-counter");

    fragment.appendChild(placeCard);
    placeCard.appendChild(placeCardImage);
    placeCard.appendChild(placeCardDescription);
    placeCardDescription.appendChild(placeCardName);
    placeCardDescription.appendChild(placeCardLikeContainer);
    placeCardLikeContainer.appendChild(placeCardLikeIcon);
    placeCardLikeContainer.appendChild(placeCardLikeCounter);

    const placeCardImageSelector = placeCard.querySelector(
      ".place-card__image"
    );
    const placeCardNameSelector = placeCard.querySelector(".place-card__name");
    const placeCardLikeCounterSelector = placeCard.querySelector(
      ".place-card__like-counter"
    );

    placeCardNameSelector.textContent = name;
    placeCardImageSelector.setAttribute(
      "style",
      `background-image: url('${link}')`
    );
    placeCardLikeCounterSelector.textContent = likes.length;
    placeCard.setAttribute("id", cardId);

    if (userId === "fc8b37efc08119d285ecc9c0") {
      const placeCardDeleteIcon = document.createElement("button");
      placeCardDeleteIcon.classList.add("place-card__delete-icon");
      placeCardImage.appendChild(placeCardDeleteIcon);
    }

    for (let like of likes) {
      if (like._id === "fc8b37efc08119d285ecc9c0") {
        placeCardLikeIcon.classList.add("place-card__like-icon_liked");
      }
    }

    return fragment;
  };

  like = event => {
    if (event.target.classList.contains("place-card__like-icon_liked")) {
      this.api.removeLike(event.target.closest(".place-card").id).then(res => {
        event.target.nextElementSibling.textContent = res.likes.length;
        event.target.classList.remove("place-card__like-icon_liked");
      });
    }

    if (event.target.classList.contains("place-card__like-icon")) {
      this.api.addLike(event.target.closest(".place-card").id).then(res => {
        event.target.nextElementSibling.textContent = res.likes.length;
        event.target.classList.add("place-card__like-icon_liked");
      });
    }
  };

  remove = event => {
    if (event.target.classList.contains("place-card__delete-icon")) {
      if (confirm("Вы уверены, что хотите удалить карточку?")) {
        this.api.removeCard(event.target.closest(".place-card").id).then(() => {
          event.target.closest(".place-card").remove();
        });
      }
    }
  };
}
