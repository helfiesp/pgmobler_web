document.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".color-circle");

  circles.forEach((circle, index) => {
    circle.addEventListener("click", () => {
      // Remove the active class from all circles
      circles.forEach((c) => c.classList.remove("active"));

      // Add the active class to the clicked circle
      circle.classList.add("active");

      // Automatically move to the next color
      const nextIndex = (index + 1) % circles.length;
      circles[nextIndex].classList.add("active");
    });
  });
});
