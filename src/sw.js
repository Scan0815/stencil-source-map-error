importScripts("workbox-v6.5.3/workbox-sw.js");

self.addEventListener("message", ({data}) => {
  if (data === "skipWaiting") {
    self.skipWaiting();
  }
});

self.workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

self.workbox.routing.registerRoute(/\.js$/, new workbox.strategies.NetworkFirst());

self.workbox.routing.registerRoute(
  // Cache CSS files.
  /\.css$/,
  // Use cache but update in the background.
  new workbox.strategies.StaleWhileRevalidate({
    // Use a custom cache name.
    cacheName: 'css-cache',
  }),
);

self.addEventListener('push', event => {
  const message = event.data.json()
  event.waitUntil(self.registration.showNotification(message.notification.title, message.notification))
});


self.addEventListener('notificationclick', event => {
  const notification = event.notification;
  const action = event.action;
  if (action === 'dismiss') {
    notification.close();
  } else {
    let url = "/";
    if (notification.data.hasOwnProperty('chat') && notification.data.chat !== null) {
      url = "/chat/" + notification.data.chat._id + "/conversation";
    }
    if (notification.data.hasOwnProperty('activity') && notification.data.activity !== null) {
      url = "/notification";
    }
    if (notification.data.hasOwnProperty('file_stack') && notification.data.file_stack !== null) {
      url = "/file-stack/" + notification.data.file_stack._id;
    }
    notification.close()
    // This looks to see if the current is already open and
    // focuses if it is


    event.waitUntil(clients.matchAll({
      type: "window"
    }).then(function (clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if ('focus' in client)
          client.navigate(url)
        return client.focus()
      }
      if (clients.openWindow)
        return clients.openWindow(url)
    }))
  }
});
