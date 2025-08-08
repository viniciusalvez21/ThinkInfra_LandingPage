// --- LÓGICA PARA O MODAL DE SERVIÇOS ---
document.addEventListener('DOMContentLoaded', () => {
    const serviceCards = document.querySelectorAll('.service-card');
    const modalOverlay = document.getElementById('service-modal-overlay');
    const modalBox = document.getElementById('service-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalItemList = document.getElementById('modal-item-list');

    // Função para abrir o modal
    const openModal = (card) => {
        // Pega os dados do card clicado
        const title = card.dataset.modalTitle;
        const description = card.dataset.modalDescription;
        const items = JSON.parse(card.dataset.modalItems);

        // Preenche o modal com os dados
        modalTitle.textContent = title;
        modalDescription.textContent = description;
        
        // Limpa a lista de itens anterior
        modalItemList.innerHTML = '';

        // Cria e adiciona os novos itens da lista
        items.forEach(itemText => {
            const li = document.createElement('li');
            li.innerHTML = itemText; // Usa innerHTML para renderizar as tags <strong>
            modalItemList.appendChild(li);
        });

        // Mostra o modal
        modalOverlay.classList.remove('hidden');
        modalBox.classList.remove('hidden');
    };

    // Função para fechar o modal
    const closeModal = () => {
        modalOverlay.classList.add('hidden');
        modalBox.classList.add('hidden');
    };

    // Adiciona o evento de clique a cada card
    serviceCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    // Adiciona os eventos para fechar o modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modalOverlay) {
        modalOverlay.addEventListener('click', closeModal);
    }
});


// --- CÓDIGO DA ANIMAÇÃO DO CANVAS ---

// Pega o elemento canvas e seu contexto 2D
const canvas = document.getElementById('hero-canvas');

// Só executa a animação se o elemento canvas existir na página
if (canvas) {
    const ctx = canvas.getContext('2d');

    // Define o tamanho do canvas para preencher a seção
    const heroSection = canvas.parentElement;
    canvas.width = heroSection.offsetWidth;
    canvas.height = heroSection.offsetHeight;

    // Array para armazenar as partículas
    let particlesArray;

    // Objeto para armazenar a posição do mouse
    const mouse = {
        x: null,
        y: null,
        radius: 150 // Raio de interação do mouse
    };

    // Event listener para atualizar a posição do mouse
    window.addEventListener('mousemove', (event) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });

    // Event listener para limpar a posição do mouse quando ele sai do canvas
    canvas.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });


    // Configurações das partículas
    const particleConfig = {
        count: 80,
        radius: 2,
        lineDistance: 130,
        speed: 0.4,
        color: 'rgba(56, 189, 248, 0.7)',
        curveFactor: 20
    };

    // Classe para criar uma partícula
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                this.x -= this.directionX * 1.5;
                this.y -= this.directionY * 1.5;
            } else {
                this.x += this.directionX;
                this.y += this.directionY;
            }

            this.draw();
        }
    }

    function init() {
        particlesArray = [];
        let numberOfParticles = particleConfig.count;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = Math.random() * particleConfig.radius + 1;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * particleConfig.speed) - (particleConfig.speed / 2);
            let directionY = (Math.random() * particleConfig.speed) - (particleConfig.speed / 2);
            let color = particleConfig.color;

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[b].x - particlesArray[a].x;
                let dy = particlesArray[b].y - particlesArray[a].y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < particleConfig.lineDistance) {
                    opacityValue = 1 - (distance / particleConfig.lineDistance);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${opacityValue * 0.5})`;
                    ctx.lineWidth = 1;
                    
                    const midX = particlesArray[a].x + dx * 0.5;
                    const midY = particlesArray[a].y + dy * 0.5;
                    const normalX = -dy / distance;
                    const normalY = dx / distance;
                    
                    const controlX = midX + normalX * particleConfig.curveFactor * (a % 2 === 0 ? 1 : -1);
                    const controlY = midY + normalY * particleConfig.curveFactor * (a % 2 === 0 ? 1 : -1);

                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.quadraticCurveTo(controlX, controlY, particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
    }

    window.addEventListener('resize', () => {
        canvas.width = heroSection.offsetWidth;
        canvas.height = heroSection.offsetHeight;
        init();
    });

    init();
    animate();
}
