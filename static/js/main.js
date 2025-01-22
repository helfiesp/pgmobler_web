document.addEventListener("DOMContentLoaded", () => {
  const circles = document.querySelectorAll(".color-circle");

  circles.forEach((circle) => {
    circle.addEventListener("click", () => {
      // Remove the active class from all circles
      circles.forEach((c) => c.classList.remove("active"));

      // Add the active class only to the clicked circle
      circle.classList.add("active");
    });
  });
});
