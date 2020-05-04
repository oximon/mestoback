export default class Api {
  constructor(config) {
    this.config = config;
  }

  getInfo = () => {
    return fetch(`${this.config.baseUrl}/users/me`, {
      method: "GET",
      headers: this.config.headers
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };

  editInfo = (name, about) => {
    return fetch(`${this.config.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this.config.headers,
      body: JSON.stringify({
        name: name,
        about: about
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };

  getAvatarInfo = () => {
    return fetch(`${this.config.baseUrl}/users/me`, {
      method: "GET",
      headers: this.config.headers
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };

  editAvatarInfo = avatar => {
    return fetch(`${this.config.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this.config.headers,
      body: JSON.stringify({
        avatar: avatar
      })
    });
  };

  getCards = () => {
    return fetch(`${this.config.baseUrl}/cards`, {
      method: "GET",
      headers: this.config.headers
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };

  addNewCard = (name, link) => {
    return fetch(`${this.config.baseUrl}/cards`, {
      method: "POST",
      headers: this.config.headers,
      body: JSON.stringify({
        name: name,
        link: link
      })
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };

  removeCard = cardId => {
    return fetch(`${this.config.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this.config.headers
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };

  addLike = cardId => {
    return fetch(`${this.config.baseUrl}/cards/like/${cardId}`, {
      method: "PUT",
      headers: this.config.headers
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };

  removeLike = cardId => {
    return fetch(`${this.config.baseUrl}/cards/like/${cardId}`, {
      method: "DELETE",
      headers: this.config.headers
    })
      .then(res => {
        if (res.ok) {
          return res.json();
        }

        return Promise.reject(`Ошибка: ${res.status}`);
      })
      .catch(err => console.log(err));
  };
}
