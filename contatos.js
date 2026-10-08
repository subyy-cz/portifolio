document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("form-contato");
    if (!form) return;

    const campos = {
        nome: document.getElementById("nome"),
        email: document.getElementById("email"),
        mensagem: document.getElementById("mensagem")
    };
    const sucesso = document.getElementById("mensagem-sucesso");

    function mostrarErro(campo, texto) {
        const grupo = campo.parentElement;
        const span = document.getElementById("erro-" + campo.id);
        grupo.classList.add("invalido");
        span.textContent = texto;
    }

    function limparErro(campo) {
        campo.parentElement.classList.remove("invalido");
        document.getElementById("erro-" + campo.id).textContent = "";
    }

    function emailValido(valor) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
    }

    Object.values(campos).forEach((campo) => {
        campo.addEventListener("input", () => limparErro(campo));
    });

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        sucesso.textContent = "";
        let ok = true;

        const nome = campos.nome.value.trim();
        const email = campos.email.value.trim();
        const mensagem = campos.mensagem.value.trim();

        if (nome.length < 2) {
            mostrarErro(campos.nome, "Digite seu nome.");
            ok = false;
        }
        if (!emailValido(email)) {
            mostrarErro(campos.email, "Digite um e-mail válido.");
            ok = false;
        }
        if (mensagem.length < 10) {
            mostrarErro(campos.mensagem, "A mensagem precisa ter pelo menos 10 caracteres.");
            ok = false;
        }

        if (!ok) return;

        const assunto = encodeURIComponent("Contato pelo portfólio - " + nome);
        const corpo = encodeURIComponent(mensagem + "\n\nDe: " + nome + " (" + email + ")");
        window.location.href = "mailto:seuemail@exemplo.com?subject=" + assunto + "&body=" + corpo;

        sucesso.textContent = "Obrigado, " + nome + "! Seu app de e-mail foi aberto com a mensagem pronta.";
        form.reset();
    });
});
