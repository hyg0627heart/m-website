export default class fetch {

  getPositionlist(params) {
    return new Promise((resolve, reject) => {
      $.ajax({
        type: 'get',
        url: `/api/listmore.json?pageNo=${params.pageNo}&pageSize=${params.pageSize}`,
        success(data) {
          resolve(data);
        },
        error(msg) {
          reject(msg);
        }
      })
    })

  }
}