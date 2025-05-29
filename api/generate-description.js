
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
const generateDescriptionBtn = document.getElementById('generate-description-btn');
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

// Lógica para chamar a API Gemini para gerar descrição
generateDescriptionBtn.addEventListener('click', async function () {
    const productName = modalProductName.textContent;
    const productBaseDescription = modalProductDescription.textContent;
    const productInstallments = modalProductInstallments.textContent;

    // Mostra o indicador de carregamento
    loadingIndicator.classList.remove('hidden');
    generatedDescriptionOutput.textContent = ''; // Limpa a descrição anterior

    const prompt = `Gere uma descrição detalhada e apelativa para o produto "${productName}". Considere que a loja "Tanta Móveis" vende para um público de classe média a média baixa, focando em conforto, durabilidade, praticidade e bom preço. Mencione a facilidade de pagamento com crediário. A descrição base é: "${productBaseDescription}". Inclua também a informação de parcelamento: "${productInstallments}". Use uma linguagem acolhedora e direta, como se estivesse a falar com um cliente.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Se quiser usar modelos diferentes de gemini-2.0-flash ou imagen-3.0-generate-002, forneça uma chave de API aqui. Caso contrário, deixe como está.
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            generatedDescriptionOutput.textContent = text;
        } else {
            generatedDescriptionOutput.textContent = 'Não foi possível gerar a descrição. Tente novamente.';
            console.error('Estrutura de resposta inesperada:', result);
        }
    } catch (error) {
        generatedDescriptionOutput.textContent = 'Ocorreu um erro ao gerar a descrição. Por favor, tente novamente mais tarde.';
        console.error('Erro ao chamar a API Gemini:', error);
    } finally {
        // Esconde o indicador de carregamento
        loadingIndicator.classList.add('hidden');
    }
});
