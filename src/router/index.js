import positionController from '../controller/positionController';
import searchController from '../controller/searchController';
import profrileController from '../controller/profileController';
import detailController from '../controller/detailController';
import errorpageController from '../controller/errorpageController';

export default class Routr {
  constructor() {
    this.initEvent();

    this.mode = "history";
    this.routers = {
      'position': positionController,
      'search': searchController,
      'profile': profrileController,
      'detail': detailController,
      'errorpage': errorpageController
    }
    this.loadView();

  }

  //加载视图
  loadView(path = "position") {
    console.log(path)
    if (this.routers[path]) {
      new this.routers[path]().render();
    } else {
      new errorpageController().render()
    }

  }

  initEvent() {
    if (this.mode === "hash") {
      window.addEventListener('hashchange', () => {
        console.log(location.hash);
        var hash = location.hash.replace('#', '');
        let id;
        if (/details\//.test(hash)) {
          id = hash.split('/')[1];
          hash = hash.split('/')[0];
        }
        this.loadView(hash);
      })
    } else {
      window.addEventListener('popstate', () => {
        let path = history.state ? history.state.url : undefined;
        this.loadView(path);
        let index = $("#nav").find("li[data-hash=" + (path ? path : 'position') + "]").index();
        $("#nav li").eq(index).addClass("active").siblings().removeClass('active');

      })


    }

  }

}