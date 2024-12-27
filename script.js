let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const getClientCoords = (e) => {
      if (e.type.startsWith("touch")) {
        return { x: e.touches[0]?.clientX || 0, y: e.touches[0]?.clientY || 0 };
      } else {
        return { x: e.clientX, y: e.clientY };
      }
    };

    const moveEvent = (e) => {
      if (!this.holdingPaper) return;

      e.preventDefault();
      const { x, y } = getClientCoords(e);

      if (!this.rotating) {
        this.velX = x - this.prevMouseX;
        this.velY = y - this.prevMouseY;
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      } else {
        const dirX = x - this.mouseTouchX;
        const dirY = y - this.mouseTouchY;
        const angle = Math.atan2(dirY, dirX);
        this.rotation = (180 * angle) / Math.PI;
      }

      this.prevMouseX = x;
      this.prevMouseY = y;

      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    };

    const startEvent = (e) => {
      e.preventDefault();

      const { x, y } = getClientCoords(e);

      if (this.holdingPaper) return;

      this.holdingPaper = true;
      paper.style.zIndex = highestZ++;
      this.mouseTouchX = x;
      this.mouseTouchY = y;
      this.prevMouseX = x;
      this.prevMouseY = y;

      if (e.type.startsWith("touch") && e.touches.length === 2) {
        this.rotating = true;
      }
    };

    const endEvent = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    document.addEventListener("mousemove", moveEvent);
    document.addEventListener("touchmove", moveEvent, { passive: false });

    paper.addEventListener("mousedown", startEvent);
    paper.addEventListener("touchstart", startEvent, { passive: false });

    window.addEventListener("mouseup", endEvent);
    window.addEventListener("touchend", endEvent);
  }
}

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});
