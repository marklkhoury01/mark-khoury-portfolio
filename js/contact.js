document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        var btn = document.getElementById('submit-btn');
        var msg = document.getElementById('form-msg');
        var data = Object.fromEntries(new FormData(this));

        btn.textContent = 'Sending...';
        btn.disabled = true;
        msg.classList.add('hidden');

        try {
            var res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                msg.textContent = "Message sent. I'll be in touch soon.";
                msg.className = 'text-sm font-bold text-[#4a7c59]';
                form.reset();
            } else {
                var body = await res.json().catch(function () { return {}; });
                msg.textContent = body.error || 'Something went wrong. Try emailing me directly.';
                msg.className = 'text-sm font-bold text-red-500';
            }
        } catch {
            msg.textContent = 'Something went wrong. Try emailing me directly.';
            msg.className = 'text-sm font-bold text-red-500';
        }

        btn.textContent = 'Send';
        btn.disabled = false;
    });
});
