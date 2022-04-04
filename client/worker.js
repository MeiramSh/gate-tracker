console.log("Service Worker Loaded...")

self.addEventListener("push", e => {
    const data = e.data.json()
    console.log("Push Recieved...")
    self.registration.showNotification(data.title, {
        body: "The gate is open more than 5 minutes!"
    })
})