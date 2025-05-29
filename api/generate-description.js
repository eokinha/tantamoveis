
// JavaScript para rolagem suave para as seções
document.querySelectorAll('nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Lógica do Modal de Detalhes do Produto
const productModal = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');
const openProductModalBtns = document.querySelectorAll('.open-product-modal');
const modalProductName = document.getElementById('modal-product-name');
const modalProductPrice = document.getElementById('modal-product-price');
const modalProductInstallments = document.getElementById('modal-product-installments');
const modalProductImage = document.getElementById('modal-product-image');
const modalProductDescription = document.getElementById('modal-product-description');
const generatedDescriptionOutput = document.getElementById('generated-description-output');
const loadingIndicator = document.getElementById('loading-indicator');

// Adiciona evento de clique para abrir o modal
openProductModalBtns.forEach(button => {
    button.addEventListener('click', function () {
        const productCard = this.closest('.product-card');
        const productName = productCard.dataset.name;
        const productPrice = productCard.dataset.price;
        const productInstallments = productCard.dataset.installments;
        const productImage = productCard.dataset.image;
        const productBaseDescription = productCard.dataset.description;

        modalProductName.textContent = productName;
        modalProductPrice.textContent = `R$ ${productPrice}`;
        modalProductInstallments.textContent = `A partir de ${productInstallments}`;
        modalProductImage.src = productImage;
        modalProductImage.alt = productName;
        modalProductDescription.textContent = productBaseDescription;
        generatedDescriptionOutput.textContent = 'Clique no botão "Gerar Descrição Detalhada" para uma descrição mais completa!'; // Limpa ou define texto padrão

        productModal.classList.add('show');
    });
});

// Adiciona evento de clique para fechar o modal
closeModalBtn.addEventListener('click', function () {
    productModal.classList.remove('show');
});

// Fecha o modal ao clicar fora do conteúdo
productModal.addEventListener('click', function (e) {
    if (e.target === productModal) {
        productModal.classList.remove('show');
    }
});

