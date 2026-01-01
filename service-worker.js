self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("mcheyne").then(cache => {
      return cache.addAll(["index.html", "mcheyne-plan.json"]);
    })
  );
});
