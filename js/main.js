// ========================================
// Particle Background
// ========================================
function createParticles() {
    var container = document.querySelector('.particles');
    if (!container) return;

    // Skip particles on mobile for performance (CWV optimization)
    if (window.innerWidth <= 768 || navigator.hardwareConcurrency <= 2) return;

    var particleCount = Math.min(30, Math.floor(window.innerWidth / 50));

    for (var i = 0; i < particleCount; i++) {
        var particle = document.createElement('div');
        particle.classList.add('particle');

        var size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';

        var colors = [
            'rgba(108, 92, 231, 0.6)',
            'rgba(162, 155, 254, 0.4)',
            'rgba(0, 206, 201, 0.4)',
            'rgba(240, 192, 64, 0.3)',
            'rgba(255, 255, 255, 0.2)'
        ];
        particle.style.background = colors[Math.floor(Math.random() * colors.length)];
        particle.style.boxShadow = '0 0 ' + (size * 2) + 'px ' + particle.style.background;

        container.appendChild(particle);
    }
}

// ========================================
// Counter Animation
// ========================================
function animateCounters() {
    var counters = document.querySelectorAll('.trust-number');
    counters.forEach(function (counter) {
        var text = counter.textContent.trim();
        var hasPlus = text.includes('+');
        var hasPercent = text.includes('%');
        var hasSlash = text.includes('/');

        if (hasSlash) return; // Skip "24/7"
        if (counter.dataset.animated === 'true') return;

        var target = parseFloat(text.replace(/[^0-9.]/g, ''));
        if (isNaN(target)) return;

        counter.dataset.animated = 'true';
        var duration = 2000;
        var startTime = null;
        var suffix = '';
        if (hasPlus) suffix = '+';
        if (hasPercent) suffix = '%';

        function step(timestamp) {
            if (!startTime) startTime = timestamp;
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 4);
            var current = Math.floor(eased * target);

            if (target % 1 !== 0) {
                current = (eased * target).toFixed(1);
            }

            counter.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = text;
            }
        }

        requestAnimationFrame(step);
    });
}

// ========================================
// Main Initialization
// ========================================
document.addEventListener('DOMContentLoaded', function () {
    // Create particles
    createParticles();

    // Mobile Navigation Toggle
    var navToggle = document.querySelector('.nav-toggle');
    var navMenu = document.querySelector('.nav-menu');

    if (navToggle) {
        navToggle.addEventListener('click', function () {
            var expanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !expanded);
            this.setAttribute('aria-label', expanded ? '메뉴 열기' : '메뉴 닫기');
            navMenu.classList.toggle('active');
            this.querySelector('.hamburger').classList.toggle('active');
        });
    }

    // Mobile dropdown toggle
    document.querySelectorAll('.dropdown > a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                this.parentElement.classList.toggle('active');
            }
        });
    });

    // Close mobile menu on link click
    document.querySelectorAll('.nav-menu a:not(.dropdown > a)').forEach(function (link) {
        link.addEventListener('click', function () {
            if (window.innerWidth <= 768 && navMenu) {
                navMenu.classList.remove('active');
                if (navToggle) {
                    navToggle.setAttribute('aria-expanded', 'false');
                    navToggle.querySelector('.hamburger').classList.remove('active');
                }
            }
        });
    });

    // Scroll Animation (Intersection Observer)
    if ('IntersectionObserver' in window) {
        var animateObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    animateObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.service-card, .feature, .region-card, .step, .faq-item, .trust-item, .pricing-card').forEach(function (el) {
            animateObserver.observe(el);
        });

        // Counter observer
        var counterObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        var trustSection = document.querySelector('.hero-trust');
        if (trustSection) counterObserver.observe(trustSection);
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (href === '#') return;
            var target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                var headerHeight = document.querySelector('.header').offsetHeight;
                var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20;
                window.scrollTo({ top: top, behavior: 'smooth' });
            }
        });
    });

    // Header scroll effect
    var header = document.querySelector('.header');
    var lastScroll = 0;

    window.addEventListener('scroll', function () {
        var currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // Form submission → Telegram Bot
    var TELEGRAM_BOT_TOKEN = '8788502594:AAGS2jMp-9_ZzcA0ICKgHXBPl8AGyqvLyLs';
    var TELEGRAM_CHAT_ID = '66397194';

    var form = document.querySelector('.contact-form');
    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var btn = form.querySelector('button[type="submit"]');
            var originalText = btn.textContent;
            btn.textContent = '전송 중...';
            btn.disabled = true;

            var name = (form.querySelector('#name') || {}).value || '-';
            var phone = (form.querySelector('#phone') || {}).value || '-';
            var service = (form.querySelector('#service') || {}).value || '-';
            var region = (form.querySelector('#region') || {}).value || '-';
            var message = (form.querySelector('#message') || {}).value || '-';

            var serviceMap = { development: '카지노솔루션 개발', rental: '카지노솔루션 임대', sale: '카지노솔루션 판매' };
            var regionMap = { seoul: '서울', busan: '부산', daegu: '대구', incheon: '인천', gwangju: '광주', daejeon: '대전', ulsan: '울산', jeju: '제주' };

            var text = '📩 *새로운 상담 신청*\n\n'
                + '👤 *이름:* ' + name + '\n'
                + '📞 *연락처:* ' + phone + '\n'
                + '💼 *관심 서비스:* ' + (serviceMap[service] || service || '미선택') + '\n'
                + '📍 *지역:* ' + (regionMap[region] || region || '미선택') + '\n'
                + '💬 *문의 내용:*\n' + (message || '없음') + '\n\n'
                + '🕐 *접수 시간:* ' + new Date().toLocaleString('ko-KR');

            fetch('https://api.telegram.org/bot' + TELEGRAM_BOT_TOKEN + '/sendMessage', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: text,
                    parse_mode: 'Markdown'
                })
            })
            .then(function (res) { return res.json(); })
            .then(function (data) {
                if (data.ok) {
                    btn.textContent = '✅ 전송 완료!';
                    btn.style.background = 'linear-gradient(135deg, #00cec9, #00b894)';
                    form.reset();
                } else {
                    btn.textContent = '❌ 전송 실패 - 다시 시도해주세요';
                    btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                }
                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            })
            .catch(function () {
                btn.textContent = '❌ 네트워크 오류';
                btn.style.background = 'linear-gradient(135deg, #e74c3c, #c0392b)';
                setTimeout(function () {
                    btn.textContent = originalText;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            });
        });
    }

    // Magnetic effect for buttons (desktop only)
    if (window.innerWidth > 768) {
        document.querySelectorAll('.btn-primary, .btn-nav').forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = this.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                this.style.transform = 'translate(' + (x * 0.15) + 'px, ' + (y * 0.15) + 'px)';
            });

            btn.addEventListener('mouseleave', function () {
                this.style.transform = '';
            });
        });
    }
});
