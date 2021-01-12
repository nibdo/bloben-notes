// @ts-ignore
const swListener = new BroadcastChannel('swListener');

const REMINDER_TYPE = 'reminder';
const CACHE_NAME = 'static-cache';
const urlsToCache = [
  //'.',
  '/index.html',
];

self.addEventListener('install', (event) => {
  // @ts-ignore
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});
/*
self.addEventListener('fetch', function(event) {

  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetchAndCache(event.request);
    })
  );

});

function fetchAndCache(url) {
  return fetch(url)
  .then(function(response) {
    // Check if we received a valid response
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(CACHE_NAME)
    .then(function(cache) {
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(function(error) {
    console.log('Request failed:', error);
    // You could return a custom offline 404 page here
  });
}
*/
self.addEventListener('push', (event) => {
  // First get push notification from server
  const data = event.data.json();
  console.log(data);

  // Send data to app to retrieve relevant object from local database
  if (data.type === REMINDER_TYPE) {
    swListener.postMessage(data);
  }

  //self.registration.showNotification(data.title, options)
});

/*
 * Listen to msg
 */

self.addEventListener('message', (event) => {
  //Show notification here
  if (event.data.body.type === 'tasks') {
    // Handle task reminder notification

    const task = event.data.body;
    self.registration.showNotification('New task reminder', {
      body: task.text,
      data: task,
      actions: [
        { action: 'complete', title: 'Mark as completed' },
        { action: 'postpone', title: 'Remind tomorrow' },
      ],
    });
  }
  // console.log(event);
  // console.log(event.data);
  // if (event.data.type === 'push') {
  //   console.log(event.data);
  //   const notification = event.data.data;
  //   console.log(notification);
  //   if (notification.type === 'invite') {
  //     // @ts-ignore
  //     self.registration.showNotification(notification.title, {
  //       body: notification.body,
  //     });
  //   } else {
  //     //Recieve decrypted data from main app and pass content to push msg
  //     // tslint:disable-next-line:no-shadowed-variable
  //     const notification = event.data.data;
  //     // @ts-ignore
  //   }
  // }
});

self.addEventListener('notificationclick', function (e) {
  // Handle clicks from notification
  const notification = e.notification;

  // TODO better notification body parsing
  // Action name from SW
  const action = e.action;

  const notificationClone = {
    data: e.notification.data,
  };

  if (action === 'complete') {
    // Send task to main app and mark as completed
    notificationClone.actionType = 'checkTask';
    swListener.postMessage(notificationClone);
    notification.close();
  } else if (action === 'postpone') {
    // Send task to main app and postpone reminder
    notificationClone.actionType = 'postpone';
    swListener.postMessage(notificationClone);
    notification.close();
  } else {
    // Open task in browser
    const taskLink = `https://tasks.dev.bloben.com/list/${notificationClone.data.listId}/edit/task/${notificationClone.data.id}`;
    e.waitUntil(clients.openWindow(taskLink));
    notification.close();
  }
});

self.addEventListener('fetch', () => console.log('fetch'));
self.addEventListener('taskCheck', () => console.log('check'));
