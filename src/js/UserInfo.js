export default class UserInfo {
  constructor(
    userName,
    userJob,
    inputName,
    inputAboutMe,
    api,
    userAvatar,
    inputAvatar
  ) {
    this.userName = userName;
    this.userJob = userJob;
    this.inputName = inputName;
    this.inputAboutMe = inputAboutMe;
    this.api = api;
    this.userAvatar = userAvatar;
    this.inputAvatar = inputAvatar;
  }

  renderLoading = (isLoading, nameButton, changedNameButton, button) => {
    if (isLoading) {
      button.textContent = changedNameButton;
    } else {
      button.textContent = nameButton;
    }
  }

  fillingInputs = () => {
    this.api.getInfo().then(data => {
      this.inputName.value = data.name;
      this.inputAboutMe.value = data.about;
    });
  };

  updateUserInfo = () => {
    this.api.getInfo().then(data => {
      this.userName.textContent = data.name;
      this.userJob.textContent = data.about;
    });
  };

  updateUserInfoApi = () => {
    return this.api
      .editInfo(this.inputName.value, this.inputAboutMe.value)
      .then(data => {
        this.userName.textContent = data.name;
        this.userJob.textContent = data.about;
      });
  };

  updateAvatarUserInfoApi = () => {
    this.api.editAvatarInfo(this.inputAvatar.value).then(data =>
      this.api.getInfo().then(data => {
        this.userAvatar.setAttribute(
          "style",
          `background-image: url('${data.avatar}')`
        );
      })
    );
  };

  updateAvatarUserInfo = () => {
    this.api.getInfo().then(data => {
      this.userAvatar.setAttribute(
        "style",
        `background-image: url('${data.avatar}')`
      );
    });
  };
}
