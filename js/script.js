// ========================================
// Wedding Site - JavaScript
// ========================================

document.addEventListener('DOMContentLoaded', function() {

    // ========================================
    // 1. OVERLAY → OPEN → SHOW CONTENT
    // ========================================
    var overlay = document.getElementById('invitationOverlay');
    var openBtn = document.getElementById('openBtn');
    var mainContent = document.getElementById('mainContent');
    var fixedFooter = document.getElementById('fixedFooter');
    var bgVideo = document.getElementById('bgVideo');

    // Pause video initially
    if (bgVideo) {
        bgVideo.pause();
        bgVideo.currentTime = 0;
    }

    function openSite() {
        // Hide overlay
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(function() {
                overlay.style.display = 'none';
            }, 800);
        }

        // Show main content
        if (mainContent) {
            mainContent.classList.add('visible');
        }

        // Show footer
        if (fixedFooter) {
            fixedFooter.classList.add('visible');
        }

        // Start video
        if (bgVideo) {
            bgVideo.load();
            bgVideo.play().catch(function(e) {
                console.log('Video autoplay blocked, retrying muted');
                bgVideo.muted = true;
                bgVideo.playsInline = true;
                bgVideo.play().catch(function() {});
            });
        }

        // Unlock scroll
        document.body.style.overflow = 'auto';

        // Start music
        setTimeout(startMusic, 500);
    }

    if (openBtn) {
        openBtn.addEventListener('click', openSite);
    }

    // Block scroll on load
    document.body.style.overflow = 'hidden';

    // ========================================
    // 2. AUDIO PLAYER
    // ========================================
    var audio = document.getElementById('audioPlayer');
    var playBtn = document.getElementById('musicPlay');
    var stopBtn = document.getElementById('musicStop');
    var musicLabel = document.getElementById('musicLabel');

    if (audio) audio.volume = 0.5;

    function startMusic() {
        if (!audio) return;
        audio.play().then(function() {
            if (playBtn) playBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'inline-block';
            if (musicLabel) musicLabel.classList.add('hidden');
        }).catch(function() {});
    }

    function stopMusic() {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        if (playBtn) playBtn.style.display = 'inline-block';
        if (stopBtn) stopBtn.style.display = 'none';
        if (musicLabel) musicLabel.classList.remove('hidden');
    }

    if (playBtn) {
        playBtn.addEventListener('click', function(e) {
            e.preventDefault();
            startMusic();
        });
    }

    if (stopBtn) {
        stopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            stopMusic();
        });
    }

    // ========================================
    // 3. COUNTDOWN TIMER
    // ========================================
    var deadline = new Date('2026-09-10T18:00:00+03:00');

    function pad(n) {
        return String(n).padStart(2, '0');
    }

    function updateCountdown() {
        var now = new Date();
        var diff = deadline - now;

        if (diff <= 0) {
            document.getElementById('days').textContent = '00';
            document.getElementById('hours').textContent = '00';
            document.getElementById('minutes').textContent = '00';
            document.getElementById('seconds').textContent = '00';
            return;
        }

        var d = Math.floor(diff / 86400000);
        var h = Math.floor((diff % 86400000) / 3600000);
        var m = Math.floor((diff % 3600000) / 60000);
        var s = Math.floor((diff % 60000) / 1000);

        document.getElementById('days').textContent = pad(d);
        document.getElementById('hours').textContent = pad(h);
        document.getElementById('minutes').textContent = pad(m);
        document.getElementById('seconds').textContent = pad(s);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    // ========================================
    // 4. PHONE MASK
    // ========================================
    var phoneInput = document.getElementById('phoneInput');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            var val = e.target.value.replace(/\D/g, '');
            if (val.length > 0) {
                if (val[0] === '7' || val[0] === '8') val = val.substring(1);
                var f = '';
                if (val.length > 0) f = val[0];
                if (val.length > 1) f += ' (' + val.substring(1, 4);
                if (val.length > 4) f += ') ' + val.substring(4, 7);
                if (val.length > 7) f += '-' + val.substring(7, 9);
                if (val.length > 9) f += '-' + val.substring(9, 11);
                e.target.value = f;
            }
        });
    }

    // ========================================
    // 5. FORM SUBMIT
    // ========================================
    var form = document.getElementById('rsvpForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            var fd = new FormData(form);
            var data = {};
            fd.forEach(function(v, k) { data[k] = v; });
            console.log('Form data:', data);
            alert('Спасибо! Ваша заявка отправлена.');
            form.reset();
        });
    }

    // ========================================
    // 6. SMOOTH SCROLL
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(function(a) {
        a.addEventListener('click', function(e) {
            var id = this.getAttribute('href');
            if (id === '#') return;
            var el = document.querySelector(id);
            if (el) {
                e.preventDefault();
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    console.log('Wedding site loaded.');
});
