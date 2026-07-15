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
    var bgVideo = document.getElementById('bgVideo');

    // Pause video initially
    if (bgVideo) {
        bgVideo.pause();
        bgVideo.currentTime = 0;
        bgVideo.playbackRate = 0.7;
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

        // Start video
        if (bgVideo) {
            bgVideo.load();
            bgVideo.playbackRate = 0.7;
            bgVideo.play().catch(function(e) {
                console.log('Video autoplay blocked, retrying muted');
                bgVideo.muted = true;
                bgVideo.playsInline = true;
                bgVideo.playbackRate = 0.7;
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
            if (musicLabel) {
                musicLabel.innerHTML = 'Выключить<br>музыку';
            }
        }).catch(function() {});
    }

    function stopMusic() {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
        if (playBtn) playBtn.style.display = 'inline-block';
        if (stopBtn) stopBtn.style.display = 'none';
        if (musicLabel) {
            musicLabel.innerHTML = 'Включить<br>музыку';
        }
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
    var deadline = new Date('2026-10-10T11:00:00+03:00');

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
    // 5. FORM SUBMIT → Google Apps Script
    // ========================================
    // ⚠️ ЗАМЕНИТЕ ЭТУ ССЫЛКУ на URL вашего Apps Script после деплоя
    var SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxpD9RKkLR4e24HcGPEefvLZCp0rci_VKA7o2CjJ5G7junW6eio8w4qxqD_MR3ZMxzM5g/exec';

    var form = document.getElementById('rsvpForm');
    var submitBtn = form ? form.querySelector('.submit-btn') : null;

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            // Собираем данные
            var fd = new FormData(form);
            var data = {};
            fd.forEach(function(v, k) { data[k] = v; });

            // Блокируем кнопку
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.textContent = 'ОТПРАВКА...';
            }

            // Отправляем в Google Apps Script
            fetch(SCRIPT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify(data)
            })
            .then(function(resp) { return resp.json(); })
            .then(function(res) {
                if (res.success) {
                    alert('Спасибо! Ваша анкета отправлена. Мы ждём вас на нашем празднике!');
                    form.reset();
                } else {
                    alert('Ошибка: ' + (res.message || 'Попробуйте ещё раз'));
                }
            })
            .catch(function(err) {
                console.error('Ошибка отправки:', err);
                alert('Произошла ошибка при отправке. Попробуйте ещё раз или свяжитесь с нами напрямую.');
            })
            .finally(function() {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'ОТПРАВИТЬ';
                }
            });
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

    // ========================================
    // 7. HOST PHONE BUTTON
    // ========================================
    var hostShowBtn = document.getElementById('hostShowBtn');
    var hostPhoneRow = document.getElementById('hostPhoneRow');
    var hostCopyBtn = document.getElementById('hostCopyBtn');
    var hostCopyToast = document.getElementById('hostCopyToast');

    if (hostShowBtn && hostPhoneRow) {
        hostShowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hostShowBtn.style.opacity = '0';
            hostShowBtn.style.transform = 'scale(0.9)';
            setTimeout(function() {
                hostShowBtn.style.display = 'none';
                hostPhoneRow.classList.add('visible');
            }, 400);
        });
    }

    if (hostCopyBtn) {
        hostCopyBtn.addEventListener('click', function() {
            var phone = '+7 (800) 555 35-35';
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(phone);
            } else {
                var ta = document.createElement('textarea');
                ta.value = phone;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            if (hostCopyToast) {
                hostCopyToast.classList.add('show');
                setTimeout(function() { hostCopyToast.classList.remove('show'); }, 2000);
            }
        });
    }

    // ========================================
    // 8. VENUE BUTTON
    // ========================================
    var venueShowBtn = document.getElementById('venueShowBtn');
    var venueDetails = document.getElementById('venueDetails');
    var venueCopyBtns = document.querySelectorAll('.venue-copy-btn');
    var venueCopyToast = document.getElementById('venueCopyToast');

    if (venueShowBtn && venueDetails) {
        venueShowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            venueShowBtn.style.opacity = '0';
            venueShowBtn.style.transform = 'scale(0.9)';
            setTimeout(function() {
                venueShowBtn.style.display = 'none';
                venueDetails.classList.add('visible');
            }, 400);
        });
    }

    if (venueCopyBtns) {
        venueCopyBtns.forEach(function(btn) {
            btn.addEventListener('click', function() {
                var text = btn.getAttribute('data-copy');
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text);
                } else {
                    var ta = document.createElement('textarea');
                    ta.value = text;
                    document.body.appendChild(ta);
                    ta.select();
                    document.execCommand('copy');
                    document.body.removeChild(ta);
                }
                if (venueCopyToast) {
                    venueCopyToast.classList.add('show');
                    setTimeout(function() { venueCopyToast.classList.remove('show'); }, 2000);
                }
            });
        });
    }

    console.log('Wedding site loaded.');
});
