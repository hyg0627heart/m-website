import positionlistTpl from '../view/positionlist.html';
import positionlistItem from '../view/positionlist-item.html'
import fetch from '../model/fetch';
import BScroll from 'better-scroll';

export default class PositionController {

  constructor() {
    this.container = $(".swiper-slide").eq(0);
    this.pageNo = 1;
    this.pageSize = 15;
    this.datalist = [];
  }


  async getlist() {
    let list = await new fetch().getPositionlist({
      pageNo: this.pageNo,
      pageSize: this.pageSize
    });
    let result = list.content.data.page.result;
    this.datalist = this.datalist.concat(result);
    return this.datalist;
  }

  async render() {
    var self = this;
    this.container.html(positionlistTpl);
    $(".loading").attr('style', 'display:flex;')
    let list = await this.getlist();
    let items = template.render(positionlistItem, { data: list });
    $(".positionlist").html(items);
    $(".loading").hide();
    let scroll = new BScroll('#main-position', {
      probeType: 2,
      click: true,
      scrollY: true
    })

    scroll.scrollTo(0, -35);


    scroll.on('scroll', function () {
      if (this.y >= 0) {
        $(".reload img").attr('src', "./images/ajax-loader.gif")
      }

    })

    scroll.on('touchEnd', async function () {
      console.log(this.y);
      //刷新
      if (this.y > 0) {
        let items = template.render(positionlistItem, { data: await self.getlist() });
        $(".positionlist").html(items);
        $(".reload img").attr('src', "./images/arrow.png")
        scroll.scrollTo(0, -35);
      }

      //翻页
      if (this.y < this.maxScrollY) {
        console.log("page change..")
        self.pageNo++;
        let items = template.render(positionlistItem, { data: await self.getlist() });
        $(".positionlist").html(items);
        scroll.refresh();
        scroll.scrollTo(0, -35);
      }

    })

    this.initEvent();
  }

  initEvent() {
    $('.positionlist').on('click', 'li', function () {
      let id = $(this).attr("data-id");
      location.hash = 'details/' + id;
    })
  }

}