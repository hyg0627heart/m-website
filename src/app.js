import Router from './router/index'

const MODE = 'history';

class App {
  constructor() {
    this.initEvent();
    this.router = new Router(MODE);
    this.initSwipper();
  }

  initEvent() {
    var self = this;
    $("nav").on('click', 'li', function () {
      let path = $(this).attr("data-hash");
      if (MODE === 'hash') {
        location.hash = path;
      } else {
        history.pushState({ url: path }, "", path);
        self.router.loadView(path);
      }
      let index = $(this).index();
      self.mySwiper.slideTo(index, 500, false);
      self.navActive(index)
    })
  }

  navActive(index) {
    $("#nav li").eq(index).addClass("active").siblings().removeClass('active');
  }

  initSwipper() {
    var self = this;
    this.mySwiper = new Swiper('.swiper-container', {
      // loop: true, // 循环模式选项
      on: {
        slideChangeTransitionEnd: function () {
          let index = this.activeIndex;
          switch (index) {
            case 0:
              self.router.loadView();
              break;
            case 1:
              self.router.loadView('search');
              break;
            case 2:
              self.router.loadView('profile');
              break;
          }
          self.navActive(index);
          console.log();
        }
      }
    })
  }

}

new App();