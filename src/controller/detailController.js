export default class DetailController {

  render(id) {
    $("#main").html(`detail id: ${id}`);
  }
}