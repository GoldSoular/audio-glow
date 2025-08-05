(function () {
  // Utility: get dominant color from image using canvas
  async function getDominantColor(img) {
    return new Promise((resolve) => {
      if (!img || !img.src) {
        resolve(null);
        return;
      }
      let image = new Image();
      image.crossOrigin = "anonymous";
      image.src = img.src;

      image.onload = () => {
        let canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        let ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, 1, 1);
        let data = ctx.getImageData(0, 0, 1, 1).data;
        resolve(`rgba(${data[0]},${data[1]},${data[2]},0.8)`);
      };
      image.onerror = () => resolve(null);
    });
  }

  // Update tabs with glow
  async function updateTabGlows() {
    let tabs = document.querySelectorAll(".tabbrowser-tab");
    for (const tab of tabs) {
      // Check if tab is playing audio (has muted or audible icon)
      let isPlaying =
        tab.hasAttribute("soundplaying") || tab.hasAttribute("audible");
      if (!isPlaying) {
        tab.style.removeProperty("--tab-glow-color");
        tab.classList.remove("tab-icon-glow");
        continue;
      }

      let icon = tab.querySelector(".tab-icon-image");
      if (!icon) {
        tab.style.removeProperty("--tab-glow-color");
        tab.classList.remove("tab-icon-glow");
        continue;
      }

      let color = await getDominantColor(icon);
      if (color) {
        tab.style.setProperty("--tab-glow-color", color);
        tab.classList.add("tab-icon-glow");
      } else {
        tab.style.removeProperty("--tab-glow-color");
        tab.classList.remove("tab-icon-glow");
      }
    }
  }

  // Observe tab changes to update glow dynamically
  let observer = new MutationObserver(() => {
    updateTabGlows();
  });

  let tabContainer = document.getElementById("tabbrowser-tabs");
  if (tabContainer) {
    observer.observe(tabContainer, {
      attributes: true,
      subtree: true,
      attributeFilter: ["soundplaying", "audible"],
    });
  }

  // Initial update
  updateTabGlows();

  // Also update every few seconds in case attribute changes missed
  setInterval(updateTabGlows, 3000);
})();
