document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // ===== 1. Nome com letras que tremem (mantém o <br>) =====
    const titulo = document.querySelector(".nomeprincipal");
    if (titulo) {
        let indice = 0;
        titulo.innerHTML = titulo.innerHTML.split("<br>").map((linha) => {
            return linha.trim().split("").map((c) => {
                const letra = c === " " ? "&nbsp;" : c;
                return '<span class="letra" style="--letra-index: ' + (indice++) + ';">' + letra + "</span>";
            }).join("");
        }).join("<br>");
    }

    // ===== 2. Bolhas do mar =====
    const fundoMar = document.getElementById("fundo-mar");
    for (let i = 0; i < 30; i++) {
        const bolha = document.createElement("div");
        const tamanho = Math.random() * 8 + 3;
        bolha.className = "particle";
        bolha.style.width = bolha.style.height = tamanho + "px";
        bolha.style.left = Math.random() * 100 + "vw";
        bolha.style.animationDuration = Math.random() * 7 + 5 + "s";
        bolha.style.animationDelay = Math.random() * 6 + "s";
        fundoMar.appendChild(bolha);
    }

    // ===== 3. Tema claro/escuro com transição =====
    const botaoTema = document.getElementById("botao-tema");
    const overlayTema = document.getElementById("transicao-tema");
    let trocando = false;

    function aplicarTema(claro) {
        body.classList.toggle("light-mode", claro);
        botaoTema.textContent = claro ? "🌊" : "☀️";
        localStorage.setItem("tema", claro ? "claro" : "escuro"); // lembra a escolha
    }

    aplicarTema(localStorage.getItem("tema") === "claro");

    botaoTema.addEventListener("click", () => {
        if (trocando) return;
        trocando = true;

        const caixa = botaoTema.getBoundingClientRect();
        overlayTema.style.setProperty("--x", caixa.left + caixa.width / 2 + "px");
        overlayTema.style.setProperty("--y", caixa.top + caixa.height / 2 + "px");

        const indoParaClaro = !body.classList.contains("light-mode");
        overlayTema.className = "transicao-tema " + (indoParaClaro ? "sol" : "bolha");

        setTimeout(() => aplicarTema(indoParaClaro), 500);   // troca com a tela coberta
        setTimeout(() => {
            overlayTema.className = "transicao-tema";
            trocando = false;
        }, 950);
    });

    // ===== 4. Transição ao trocar de seção =====
    const paginaOverlay = document.getElementById("transicao-pagina");

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener("click", (evento) => {
            const alvo = document.querySelector(link.getAttribute("href"));
            if (!alvo) return;
            evento.preventDefault();
            if (paginaOverlay.classList.contains("ativa")) return;

            paginaOverlay.classList.add("ativa");
            setTimeout(() => alvo.scrollIntoView({ behavior: "instant" }), 420);
            setTimeout(() => paginaOverlay.classList.remove("ativa"), 900);
        });
    });

    // ===== 5. Aparecer ao rolar (e encher as barras de skill) =====
    const observador = new IntersectionObserver((itens) => {
        itens.forEach((item) => {
            if (item.isIntersecting) {
                item.target.classList.add("visivel");
                observador.unobserve(item.target);
            }
        });
    }, { threshold: 0.15 });

    document.querySelectorAll(".revelar").forEach((el) => observador.observe(el));

    // ===== 6. Filtro de projetos =====
    const filtros = document.querySelectorAll(".filtro");
    const projetos = document.querySelectorAll(".card-projeto");

    filtros.forEach((botao) => {
        botao.addEventListener("click", () => {
            filtros.forEach((b) => b.classList.remove("ativo"));
            botao.classList.add("ativo");
            projetos.forEach((card) => {
                const mostrar = botao.dataset.filtro === "todos" || card.dataset.categoria === botao.dataset.filtro;
                card.classList.toggle("escondido", !mostrar);
            });
        });
    });

    // ===== 7. Formulário de contato =====
    const form = document.getElementById("form-contato");
    const msg = document.getElementById("form-msg");

    form.addEventListener("submit", (evento) => {
        evento.preventDefault();
        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const texto = document.getElementById("mensagem").value.trim();

        if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || texto.length < 10) {
            msg.className = "form-msg erro";
            msg.textContent = "Preencha nome, um e-mail válido e uma mensagem com pelo menos 10 letras.";
            return;
        }

        window.location.href = "mailto:seuemail@exemplo.com?subject=" +
            encodeURIComponent("Contato pelo portfólio - " + nome) +
            "&body=" + encodeURIComponent(texto + "\n\nDe: " + nome + " (" + email + ")");

        msg.className = "form-msg ok";
        msg.textContent = "Obrigado, " + nome + "! Seu app de e-mail foi aberto com a mensagem pronta.";
        form.reset();
    });
});


// ===== 8. Mouse personalizado + animações de scroll =====
document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;

    // --- Mouse (só em computador) ---
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        const ponto = document.createElement("div");
        const anel = document.createElement("div");
        ponto.className = "cursor-ponto";
        anel.className = "cursor-anel";
        body.append(ponto, anel);

        let mx = 0, my = 0, ax = 0, ay = 0;

        document.addEventListener("mousemove", (e) => {
            mx = e.clientX;
            my = e.clientY;
            ponto.style.transform = "translate(" + mx + "px, " + my + "px)";
            ponto.classList.add("cursor-visivel");
            anel.classList.add("cursor-visivel");
        });

        // o anel segue o ponto com um atraso suave
        (function seguir() {
            ax += (mx - ax) * 0.15;
            ay += (my - ay) * 0.15;
            anel.style.transform = "translate(" + ax + "px, " + ay + "px)";
            requestAnimationFrame(seguir);
        })();

        document.addEventListener("mouseover", (e) => {
            const clicavel = e.target.closest("a, button, .card-skill, .card-projeto, .card-contato");
            body.classList.toggle("cursor-hover", !!clicavel);
        });
        document.addEventListener("mousedown", () => body.classList.add("cursor-clique"));
        document.addEventListener("mouseup", () => body.classList.remove("cursor-clique"));
        document.addEventListener("mouseleave", () => {
            ponto.classList.remove("cursor-visivel");
            anel.classList.remove("cursor-visivel");
        });
    }

    // --- Scroll: barra de progresso, menu ativo e parallax ---
    const progresso = document.getElementById("progresso");
    const secoes = document.querySelectorAll("section[id]");
    const links = document.querySelectorAll("nav a");
    const sol = document.querySelector(".sol-fundo");
    const foto = document.querySelector(".foto-perfil");

    function atualizarScroll() {
        const y = window.scrollY;
        const total = document.documentElement.scrollHeight - window.innerHeight;
        progresso.style.width = (y / total) * 100 + "%";

        let atual = "";
        secoes.forEach((s) => {
            if (s.getBoundingClientRect().top <= window.innerHeight * 0.4) atual = s.id;
        });
        links.forEach((l) => l.classList.toggle("ativo", l.getAttribute("href") === "#" + atual));

        sol.style.transform = "translateY(" + y * 0.2 + "px)";
        foto.style.transform = "translateY(" + y * 0.08 + "px)";
    }

    window.addEventListener("scroll", () => requestAnimationFrame(atualizarScroll));
    atualizarScroll();
});
