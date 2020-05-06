export default class CardList {
  constructor(container, card, api) {
    this.container = container;
    this.card = card;
    this.api = api;
  }
  // Деструктуризация параметров -- круто!
  addCard = ({ name, link, likes, cardId, userId }) => {
    return this.container.appendChild(
      this.card.createCard(name, link, likes, cardId, userId)
    );
  };

  addCardApi = (name, link) => {
    return this.api.addNewCard(name, link).then(data => {
      this.addCard({
        name: data.name,
        link: data.link,
        likes: data.likes,
        cardId: data._id,
        userId: data.owner._id
      });
    });
  };

  render = array => {
    for (let element of array) {
      this.addCard({
        name: element.name,
        link: element.link,
        likes: element.likes,
        cardId: element._id,
        userId: element.owner._id
      });
    }
  };

  renderApi = () => {
    this.api.getCards().then(data => {
      this.render(data);
    });
  };

  addListeners = () => {
    this.container.addEventListener("click", this.card.like);
    this.container.addEventListener("click", this.card.remove);
  };
}
