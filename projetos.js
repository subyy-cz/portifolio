document.addEventListener("DOMContentLoaded", () => {
    const botoes = document.querySelectorAll(".filtro");
    const cards = document.querySelectorAll(".card-projeto");

    botoes.forEach((botao) => {
        botao.addEventListener("click", () => {
            const filtro = botao.dataset.filtro;

            botoes.forEach((b) => b.classList.remove("ativo"));
            botao.classList.add("ativo");

            cards.forEach((card) => {
                const mostrar = filtro === "todos" || card.dataset.categoria === filtro;
                card.classList.toggle("escondido", !mostrar);
            });
        });
    });
});
