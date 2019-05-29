// service workerが有効なら、service-worker.js を登録します
if ('serviceWorker' in navigator) {
 navigator.serviceWorker.register('../../js/serviceWorker.js')
  .then(
  function (registration) {
      if (typeof registration.update == 'function') {
          registration.update();
      }
  })
  .catch(function (error) {
    console.log("Error Log: " + error);
  });
}
