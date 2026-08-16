// Adiciona um ouvinte de evento que espera o DOM estar completamente carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {

    /**
     * ============================================
     * SCROLL SUAVE PARA LINKS ÂNCORA
     * ============================================
     * Seleciona todos os links de navegação e adiciona um evento de clique
     * para rolar suavemente até a seção correspondente.
     */
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"]');
    const logoLink = document.querySelector('.logo');

    // Função para scroll suave até o elemento alvo
    function smoothScrollTo(targetId) {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previne o comportamento padrão do link
            smoothScrollTo(this.getAttribute('href'));
        });
    });

    // Scroll suave para o hero ao clicar no logo, sem alterar a URL
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            e.preventDefault();
            smoothScrollTo('#hero');
        });
    }

    /**
     * ============================================
     * ANIMAÇÃO AO ROLAR (SCROLL REVEAL)
     * ============================================
     * Usa a IntersectionObserver API para adicionar uma classe 'visible'
     * aos cards de serviço quando eles entram na tela.
     */
    const serviceCards = document.querySelectorAll('.service-card');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Para a observação após a animação
            }
        });
    }, {
        rootMargin: '0px',
        threshold: 0.1 // Ativa quando 10% do elemento está visível
    });

    serviceCards.forEach(card => {
        revealObserver.observe(card);
    });

    /**
     * ============================================
     * SCROLLSPY - DESTACAR MENU ATIVO
     * ============================================
     * Observa as seções e destaca o link de menu correspondente
     * quando a seção está visível na tela.
     */
    const sections = document.querySelectorAll('section[id]');
    const navLinksSpy = document.querySelectorAll('.main-nav a');
    const heroLink = document.querySelector('.main-nav a[href="#hero"]');

    // Função auxiliar para remover a classe 'active' de todos os links
    function removeActiveFromAllLinks() {
        navLinksSpy.forEach(link => {
            link.classList.remove('active');
        });
    }

    // Função para ativar o link "Início" quando estiver no topo da página
    function activateHeroLink() {
        removeActiveFromAllLinks();
        if (heroLink) {
            heroLink.classList.add('active');
        }
    }

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Remove a classe ativa de todos os links
                removeActiveFromAllLinks();

                // Adiciona a classe ativa ao link correspondente
                const activeLink = document.querySelector(`.main-nav a[href="#${id}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    }, { 
        rootMargin: '-50% 0px -50% 0px' // Ativa quando o meio da seção cruza o meio da tela
    });

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });

    // Listener de scroll para ativar "Início" quando estiver no topo da página
    // (o observador acima pode não disparar para o hero no carregamento inicial)
    window.addEventListener('scroll', () => {
        // Se o scroll estiver no topo (ou muito próximo), ativa o link "Início"
        if (window.scrollY < 50) {
            activateHeroLink();
        }
    });

    // Ativa o link "Início" no carregamento da página
    activateHeroLink();

    /**
     * ============================================
     * MENU HAMBÚRGUER (MOBILE)
     * ============================================
     * Lógica para abrir/fechar o menu de navegação em dispositivos móveis.
     */
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    // navLinks já está definido acima, podemos reusá-lo

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            document.body.classList.toggle('menu-open'); // Para impedir a rolagem do corpo

            // Alterna o ícone do botão (hambúrguer <-> X)
            const icon = menuToggle.querySelector('i');
            if (mainNav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times'); // Ícone 'X' para fechar
                menuToggle.setAttribute('aria-label', 'Fechar menu');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars'); // Ícone de hambúrguer
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            }
        });

        // Fecha o menu quando um link é clicado (para rolagem suave)
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                document.body.classList.remove('menu-open');
                // Reseta o ícone para hambúrguer
                const icon = menuToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
                menuToggle.setAttribute('aria-label', 'Abrir menu');
            });
        });
    }

});