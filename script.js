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
    const moveEvent = (e) => {
      const isTouch = e.type.startsWith("touch");
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      if (!this.holdingPaper) return;

      if (!this.rotating) {
        this.velX = clientX - this.prevMouseX;
        this.velY = clientY - this.prevMouseY;
        this.currentPaperX += this.velX;
        this.currentPaperY += this.velY;
      } else {
        const dirX = clientX - this.mouseTouchX;
        const dirY = clientY - this.mouseTouchY;
        const angle = Math.atan2(dirY, dirX);
        this.rotation = (180 * angle) / Math.PI;
      }

      this.prevMouseX = clientX;
      this.prevMouseY = clientY;

      paper.style.transform = `translate(${this.currentPaperX}px, ${this.currentPaperY}px) rotate(${this.rotation}deg)`;
    };

    const startEvent = (e) => {
      const isTouch = e.type.startsWith("touch");
      const clientX = isTouch ? e.touches[0].clientX : e.clientX;
      const clientY = isTouch ? e.touches[0].clientY : e.clientY;

      e.preventDefault();

      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ++;
      this.mouseTouchX = clientX;
      this.mouseTouchY = clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;

      if (isTouch && e.touches.length === 2) {
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
