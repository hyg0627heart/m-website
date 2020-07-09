import errorTpl from '../view/404.html';

export default class errorpageController {

  render() {
    $("#main").html(errorTpl);
  }
}