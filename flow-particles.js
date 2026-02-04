/**
 * Flow Particles - Silk/Smoke Effect
 * Uses Simplex Noise to drive particle movement along flow vectors.
 */

// Simplex Noise Implementation (Lightweight)
const SimplexNoise = (function () {
    var F2 = 0.5 * (Math.sqrt(3.0) - 1.0);
    var G2 = (3.0 - Math.sqrt(3.0)) / 6.0;
    var Perm = new Uint8Array(512);
    var Grad = [
        [1, 1], [-1, 1], [1, -1], [-1, -1],
        [1, 0], [-1, 0], [1, 0], [-1, 0],
        [0, 1], [0, -1], [0, 1], [0, -1]
    ];
    function SimplexNoise(seed) {
        if (seed === undefined) seed = Math.random();
        for (var i = 0; i < 256; i++) Perm[i] = i;
        for (var i = 0; i < 256; i++) {
            var r = (seed = (1664525 * seed + 1013904223) % 4294967296) & 0xFF;
            var t = Perm[i]; Perm[i] = Perm[r]; Perm[r] = t;
        }
        for (var i = 0; i < 256; i++) Perm[i + 256] = Perm[i];
    }
    SimplexNoise.prototype.noise2D = function (x, y) {
        var n0, n1, n2;
        var s = (x + y) * F2;
        var i = Math.floor(x + s);
        var j = Math.floor(y + s);
        var t = (i + j) * G2;
        var X0 = i - t;
        var Y0 = j - t;
        var x0 = x - X0;
        var y0 = y - Y0;
        var i1, j1;
        if (x0 > y0) { i1 = 1; j1 = 0; }
        else { i1 = 0; j1 = 1; }
        var x1 = x0 - i1 + G2;
        var y1 = y0 - j1 + G2;
        var x2 = x0 - 1.0 + 2.0 * G2;
        var y2 = y0 - 1.0 + 2.0 * G2;
        var ii = i & 255;
        var jj = j & 255;
        var gi0 = Perm[ii + Perm[jj]] % 12;
        var gi1 = Perm[ii + i1 + Perm[jj + j1]] % 12;
        var gi2 = Perm[ii + 1 + Perm[jj + 1]] % 12;
        var t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 < 0) n0 = 0.0;
        else { t0 *= t0; n0 = t0 * t0 * (Grad[gi0][0] * x0 + Grad[gi0][1] * y0); }
        var t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 < 0) n1 = 0.0;
        else { t1 *= t1; n1 = t1 * t1 * (Grad[gi1][0] * x1 + Grad[gi1][1] * y1); }
        var t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 < 0) n2 = 0.0;
        else { t2 *= t2; n2 = t2 * t2 * (Grad[gi2][0] * x2 + Grad[gi2][1] * y2); }
        return 70.0 * (n0 + n1 + n2);
    };
    return SimplexNoise;
})();

class FlowField {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;

        this.particles = [];
        this.particleCount = 600; // Dense for silk look
        this.noise = new SimplexNoise();
        this.zoom = 0.003; // Scale of noise
        this.curve = 20; // Intensity of curve

        this.init();
        window.addEventListener('resize', () => this.resize());
        this.animate();
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
        // Initial black fill
        this.ctx.fillStyle = "#050505";
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    createParticle() {
        return {
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            vx: 0,
            vy: 0,
            life: Math.random() * 100 + 50,
            age: 0,
            color: `rgba(255, 255, 255, ${Math.random() * 0.1 + 0.02})` // Very faint white
        };
    }

    resize() {
        this.width = this.canvas.width = this.canvas.offsetWidth;
        this.height = this.canvas.height = this.canvas.offsetHeight;
        // Don't re-init, allows cool glitch effect or just clear
        this.init();
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        // Trail effect: Fade out slowly instead of clearing
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.fillStyle = "rgba(5, 5, 5, 0.05)"; // High transparency creates trails
        this.ctx.fillRect(0, 0, this.width, this.height);

        this.ctx.globalCompositeOperation = 'lighter'; // Additive blending for "glow"

        for (let p of this.particles) {
            // Get Flow Vector from Noise
            let angle = this.noise.noise2D(p.x * this.zoom, p.y * this.zoom) * this.curve;

            p.vx += Math.cos(angle) * 0.1;
            p.vy += Math.sin(angle) * 0.1;

            // Friction
            p.vx *= 0.99;
            p.vy *= 0.99;

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Draw
            this.ctx.beginPath();
            this.ctx.strokeStyle = p.color;
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(p.x - p.vx * 2, p.y - p.vy * 2); // Draw tail
            this.ctx.lineTo(p.x, p.y);
            this.ctx.stroke();

            // Age and Reset
            p.age++;
            if (p.age > p.life ||
                p.x < 0 || p.x > this.width ||
                p.y < 0 || p.y > this.height) {
                // Respawn random
                Object.assign(p, this.createParticle());
            }
        }
    }
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    new FlowField('flow-canvas');
});
