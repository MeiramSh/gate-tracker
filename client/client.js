const publicVapidKey = 'BB4HYa1ZLggzGWtKTmvfALPW9sWuFhrjFNZ-5g7YN_Sp5118sWXY5i22GLh5yj9RDVcDTU-x88jNZYBij0HaI84'
var element = document.getElementById('subscribe')
element.addEventListener('click', subscribe, false)
function subscribe() {
    if ('serviceWorker' in navigator) {
        send().catch(err => console.log(err))
    }
}


async function send() {
    console.log("Registering service worker...");
    const register = await navigator.serviceWorker.register("/worker.js", {
        scope: "/"
    })
    console.log("Service Worker Registered...")

    // Register Push
    console.log("Registering Push...");
    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
    })
    console.log("Push Registered...");

    // Subscribe request
    console.log("Subscribing...");
    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: {
            "content-type": "application/json"
        }
    })
    console.log("Subscribed!")
}

function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, "+")
        .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}