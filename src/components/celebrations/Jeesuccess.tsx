
import React, { useEffect, useRef, useState } from 'react';

interface JeesuccessProps {
  onComplete: () => void;
}

export const Jeesuccess: React.FC<JeesuccessProps> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Animation variables
    let animationId: number;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
    }> = [];

    // Create particles
    const createParticles = () => {
      const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57'];
      
      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: canvas.height + 10,
          vx: (Math.random() - 0.5) * 4,
          vy: -Math.random() * 8 - 2,
          life: 0,
          maxLife: Math.random() * 100 + 50,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    };

    // Animation loop
    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.life++;

        if (particle.life > particle.maxLife || particle.y < -10) {
          particles.splice(index, 1);
          return;
        }

        const alpha = 1 - (particle.life / particle.maxLife);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;

      if (particles.length > 0) {
        animationId = requestAnimationFrame(animate);
      } else {
        setTimeout(onComplete, 1000);
      }
    };

    createParticles();
    setShowMessage(true);
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)' }}
      />
      
      {showMessage && (
        <div className="relative z-10 text-center animate-bounce">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              🎉 Congratulations! 🎉
            </h1>
            <p className="text-xl text-gray-600">
              Great job on completing your practice session!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
