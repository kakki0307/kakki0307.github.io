var CACHE_NAME  = "fb-cache-v8-10";

var urlsToCache = [
    "../html/customerTop/index.html",
    "../html/off/offline.html",
    "../css/index.css",
    "../img/icon/icon-192.png",
    "../img/icon/icon-256.png",
    "../img/icon/icon-512.png",
    "../img/icon/icon.png"
];

const CACHE_KEYS = [
  CACHE_NAME
];

self.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(CACHE_NAME) // 上記で指定しているキャッシュ名
          .then(
          function(cache){
              return cache.addAll(urlsToCache); // 指定したリソースをキャッシュへ追加
              console.log(urlsToCache);
              // 1つでも失敗したらService Workerのインストールはスキップされる
          })
    );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => {
          return !CACHE_KEYS.includes(key);
        }).map(key => {
          // 不要なキャッシュを削除
          console.log(key);
          return caches.delete(key);
        })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  //ブラウザが回線に接続しているかをboolで返してくれる
  var online = navigator.onLine;

  //回線が使えるときの処理
  if(online){
    console.log('on');
    event.respondWith(
      caches.match(event.request)
        .then(
        function (response) {
          if (response) {
            console.log('onres');
            return response;
          }
          //ローカルにキャッシュがあればすぐ返して終わりですが、
          //無かった場合はここで新しく取得します
          return fetch(event.request)
            .then(function(response){
              // 取得できたリソースは表示にも使うが、キャッシュにも追加しておきます
              // ただし、Responseはストリームなのでキャッシュのために使用してしまうと、ブラウザの表示で不具合が起こる(っぽい)ので、複製しましょう
              cloneResponse = response.clone();
              if(response){
                //ここ&&に修正するかもです
                if(response || response.status == 200){
                  //現行のキャッシュに追加
                  caches.open(CACHE_NAME)
                    .then(function(cache)
                    {
                      cache.put(event.request, cloneResponse)
                      .then(function(){
                        //正常にキャッシュ追加できたときの処理(必要であれば)
                      });
                    });
                }else{
                  //正常に取得できなかったときにハンドリングしてもよい
                  return response;
                }
                return response;
              }
            }).catch(function(error) {
              //デバッグ用
              return console.log(error);
            });
        })
    );
  }else{
    //オフラインのときの制御
    event.respondWith(
      caches.match(event.request)
        .then(function(response) {
          // キャッシュがあったのでそのレスポンスを返す
          if (response) {
            console.log('erroroffc');
            return response;
          }
          //オフラインでキャッシュもなかったパターン
          return caches.match("../off/offline.html")
              .then(function(responseNodata)
              {
                console.log('erroroffhtml');
                //適当な変数にオフラインのときに渡すリソースを入れて返却
                //今回はoffline.htmlを返しています
                return responseNodata;
              });
        }
      )
    );
  }
});
