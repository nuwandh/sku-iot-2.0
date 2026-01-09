/**
 * Magnetic Dot Grid Background
 * 
 * Features:
 * - Canvas-based rendering for performance (60fps)
 * - Interactive magnetic field effect around cursor
 * - Smooth damping/spring physics for dot return
 * - Responsive to window resizing
 */

(function () {
    // --- Configuration ---
    const CONFIG = {
        bgColor: '#09090b',         // Deep Dark Zinc
        dotColor: 'rgba(59, 130, 246, 0.15)', // Default Blue low opacity
        dotActiveColor: 'rgba(59, 130, 246, 0.8)', // Active Blue high opacity 
        dotRadius: 1.5,
        gridSpacing: 30,
        mouseRadius: 150,
        pullStrength: 0.6,          // Factor for displacement
        damping: 0.1                // Speed of return (0.1 = smooth spring)
    };

    // --- Setup ---
    const container = document.getElementById('canvas-container');
    if (!container) return; // Exit if container not found

    const canvas = document.createElement('canvas');
    canvas.id = 'magnetic-grid';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let dots = [];

    // Mouse State
    const mouse = {
        x: -1000,
        y: -1000,
        isActive: false
    };

    // --- Dot Class ---
    class Dot {
        constructor(x, y) {
            this.originX = x;
            this.originY = y;
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            this.color = CONFIG.dotColor;
            this.glow = 0;
        }

        update() {
            // 1. Calculate distance to mouse
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // 2. Magnetic Logic
            if (distance < CONFIG.mouseRadius) {
                // Calculate pull factor (closer = stronger)
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (CONFIG.mouseRadius - distance) / CONFIG.mouseRadius;

                // Displacement target
                const pull = force * CONFIG.pullStrength * 50;
                this.targetX = this.originX + (forceDirectionX * pull);
                this.targetY = this.originY + (forceDirectionY * pull);

                // Visual Feedback
                this.color = CONFIG.dotActiveColor;
                this.glow = force * 15; // Max glow
            } else {
                // Return to origin
                this.targetX = this.originX;
                this.targetY = this.originY;
                this.color = CONFIG.dotColor;
                this.glow = 0;
            }

            // 3. Physics (Damping / Lerp)
            // Simple ease-out: current + (target - current) * damping
            this.x += (this.targetX - this.x) * CONFIG.damping;
            this.y += (this.targetY - this.y) * CONFIG.damping;
        }

        draw(context) {
            context.beginPath();
            context.arc(this.x, this.y, CONFIG.dotRadius, 0, Math.PI * 2);
            context.fillStyle = this.color;

            if (this.glow > 0) {
                context.shadowBlur = this.glow;
                context.shadowColor = CONFIG.dotActiveColor;
            } else {
                context.shadowBlur = 0;
            }

            context.fill();
            context.shadowBlur = 0; // Reset
        }
    }

    // --- Initialization ---
    function init() {
        resize();
        createGrid();
        animate();

        // Event Listeners
        window.addEventListener('resize', () => {
            resize();
            createGrid(); // Re-create grid to fit new dimensions
        });

        window.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.isActive = true;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = -1000;
            mouse.y = -1000;
            mouse.isActive = false;
        });
    }

    function resize() {
        width = container.clientWidth;
        height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function createGrid() {
        dots = [];
        const cols = Math.floor(width / CONFIG.gridSpacing) + 1;
        const rows = Math.floor(height / CONFIG.gridSpacing) + 1;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                const x = i * CONFIG.gridSpacing;
                const y = j * CONFIG.gridSpacing;
                dots.push(new Dot(x, y));
            }
        }
    }

    // --- Animation Loop ---
    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw Dot Grid
        dots.forEach(dot => {
            dot.update();
            dot.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    // Start
    init();

})();
