// Simple confetti effect for the congratulations modal
export default function confetti() {
  // Create canvas element
  const canvas = document.createElement("canvas");
  canvas.style.position = "fixed";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.pointerEvents = "none";
  canvas.style.zIndex = "100";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Confetti particles
  const particles: Particle[] = [];
  const particleCount = 150;
  const colors = ["#10b981", "#34d399", "#6ee7b7", "#ecfdf5", "#ffffff"];

  interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speed: number;
    angle: number;
    rotation: number;
    rotationSpeed: number;
  }

  // Create particles
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      size: Math.random() * 10 + 5,
      color: colors[Math.floor(Math.random() * colors.length)],
      speed: Math.random() * 3 + 2,
      angle: Math.random() * Math.PI * 2,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: Math.random() * 0.2 - 0.1,
    });
  }

  // Animation loop
  let animationFrame: number;
  const animate = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let complete = true;

    // Update and draw particles
    for (const particle of particles) {
      particle.y += particle.speed;
      particle.x += Math.sin(particle.angle) * 0.5;
      particle.rotation += particle.rotationSpeed;

      ctx.save();
      ctx.translate(particle.x, particle.y);
      ctx.rotate(particle.rotation);
      ctx.fillStyle = particle.color;
      ctx.fillRect(
        -particle.size / 2,
        -particle.size / 2,
        particle.size,
        particle.size
      );
      ctx.restore();

      // Check if any particles are still visible
      if (particle.y < canvas.height) {
        complete = false;
      }
    }

    // Remove canvas when all particles are off screen
    if (complete) {
      cancelAnimationFrame(animationFrame);
      document.body.removeChild(canvas);
      return;
    }

    animationFrame = requestAnimationFrame(animate);
  };

  animate();

  // Clean up on window resize
  const handleResize = () => {
    cancelAnimationFrame(animationFrame);
    document.body.removeChild(canvas);
  };

  window.addEventListener("resize", handleResize);

  // Clean up after 8 seconds max
  setTimeout(() => {
    if (document.body.contains(canvas)) {
      cancelAnimationFrame(animationFrame);
      document.body.removeChild(canvas);
      window.removeEventListener("resize", handleResize);
    }
  }, 8000);
}
