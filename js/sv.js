if ('serviceWorker' in navigator) {
 navigator.serviceWorker.register('../../js/service-worker.js')
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

import './stay_standalone';
