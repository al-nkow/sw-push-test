const publicVapidKey = 'XXXXXXXXXXXXXXXXXXXXXXXX';
const triggerPush = document.querySelector('.trigger-push');

// click TRIGGER PUSH button
triggerPush.addEventListener('click', () => {
  triggerPushNotification().catch(error => console.error(error));
});

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}


async function triggerPushNotification() {
  if ('serviceWorker' in navigator) {

    const register = await navigator.serviceWorker.register('/sw.js', {
      scope: '/'
    });

    const subscription = await register.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    const permission = await window.Notification.requestPermission();

    if (permission !== 'granted') {
      throw new Error('Permission not granted for Notification');
    } else {

      await fetch('/subscribe', {
        method: 'POST',
        body: JSON.stringify(subscription),
        headers: {
          'Content-Type': 'application/json',
        },
      });

    }

  } else {
    console.error('Service workers are not supported in this browser');
  }
}

