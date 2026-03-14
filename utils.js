// js/utils.js - HELPER FUNCTIONS
export const Utils = {
    // Create gradient texture
    createGradientTexture(color1, color2) {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        const gradient = ctx.createLinearGradient(0, 0, 256, 256);
        gradient.addColorStop(0, color1);
        gradient.addColorStop(1, color2);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 256, 256);
        return new THREE.CanvasTexture(canvas);
    },
    
    // Create text texture
    createTextTexture(text, color = '#ffffff', bgColor = 'rgba(0,0,0,0)') {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = 'Bold 60px "Space Grotesk"';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, canvas.width/2, canvas.height/2);
        return new THREE.CanvasTexture(canvas);
    },
    
    // Format date
    formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short' 
        });
    },
    
    // Check if mobile
    isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
}; 