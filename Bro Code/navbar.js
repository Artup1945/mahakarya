      let lastScrollY = window.scrollY;
      const nav = document.querySelector('nav');

      window.addEventListener('scroll', () => {
        if (window.scrollY > lastScrollY) {
          // Scroll ke bawah -> Sembunyikan navbar
          nav.classList.add('nav-hidden');
        } else {
          // Scroll ke atas -> Munculkan navbar
          nav.classList.remove('nav-hidden');
        }
        lastScrollY = window.scrollY;
      });