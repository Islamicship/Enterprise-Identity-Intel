document.addEventListener('DOMContentLoaded', () => {
    const f = {
        nameAr: document.getElementById('nameArabic'),
        nameEn: document.getElementById('nameEnglish'),
        aqama: document.getElementById('aqamaNumber'),
        dobH: document.getElementById('dobHijri'),
        dobG: document.getElementById('dobGregorian'),
        input: document.getElementById('inputText'),
        btn: document.getElementById('processBtn'),
        clear: document.getElementById('clearAllBtn'),
        header: document.getElementById('headerReload')
    };

    // 1. Professional Reload
    if (f.header) { f.header.addEventListener('click', () => window.location.reload()); }

    // Number Converter Utility
    const toLatin = (s) => s ? s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)) : '';

    function adjustArHeight() {
        f.nameAr.style.height = "46px";
        if (f.nameAr.value.trim() !== "") { f.nameAr.style.height = f.nameAr.scrollHeight + "px"; }
    }

    function validateFields() {
        [f.aqama, f.nameEn, f.nameAr].forEach(el => el.classList.remove('valid', 'invalid'));
        if (f.aqama.value.length === 10) f.aqama.classList.add('valid');
        if (f.nameEn.value.length > 5) f.nameEn.classList.add('valid');
        if (f.nameAr.value.length > 5) f.nameAr.classList.add('valid');
    }

    // --- 2. MANUAL DATE INPUT LOGIC (AUTO-SLASH & LIVE CONVERSION) ---
    function handleManualDate(e, type) {
        // Backspace guard
        if (e.inputType === 'deleteContentBackward') return;

        let input = e.target;
        let cursor = input.selectionStart;
        let val = toLatin(input.value).replace(/\D/g, ''); // Sirf numbers
        let formatted = "";

        if (type === 'G') { // Format: DD/MM/YYYY
            if (val.length > 0) formatted += val.substring(0, 2);
            if (val.length > 2) formatted += '/' + val.substring(2, 4);
            if (val.length > 4) formatted += '/' + val.substring(4, 8);
        } else { // Format: YYYY/MM/DD
            if (val.length > 0) formatted += val.substring(0, 4);
            if (val.length > 4) formatted += '/' + val.substring(4, 6);
            if (val.length > 6) formatted += '/' + val.substring(6, 8);
        }

        const oldLen = input.value.length;
        input.value = formatted;

        // Auto cursor move
        if (formatted.length > oldLen && formatted[cursor - 1] === '/') {
            cursor++;
        }
        input.setSelectionRange(cursor, cursor);

        // Live Conversion on completion (10 chars)
        if (formatted.length === 10) {
            if (type === 'G') {
                const m = moment(formatted, 'DD/MM/YYYY');
                if (m.isValid()) f.dobH.value = m.format('iYYYY/iMM/iDD');
            } else {
                const m = moment(formatted, 'iYYYY/iMM/iDD');
                if (m.isValid()) f.dobG.value = m.format('DD/MM/YYYY');
            }
        }
    }

    f.dobG.addEventListener('input', (e) => handleManualDate(e, 'G'));
    f.dobH.addEventListener('input', (e) => handleManualDate(e, 'H'));

    // --- 3. EXTRACTION ENGINE ---
    function extract() {
        let text = f.input.value.trim();
        if (!text) return;

        document.querySelectorAll('.skeleton-target').forEach(el => {
            el.classList.add('loading');
            el.value = '';
            el.classList.remove('valid', 'invalid');
        });

        setTimeout(() => {
            const lines = text.split('\n');
            lines.forEach(line => {
                const raw = line.trim();
                const clean = toLatin(raw);

                // Aqama
                const aqamaMatch = clean.match(/[0-9]{10}/);
                if (aqamaMatch && !f.aqama.value) f.aqama.value = aqamaMatch[0];

                // English Name
                const nameEnMatch = raw.match(/[a-zA-Z\s]{5,}/);
                if (nameEnMatch && !f.nameEn.value && !/[0-9]/.test(raw)) {
                    f.nameEn.value = nameEnMatch[0].trim().toUpperCase();
                }

                // Arabic Name
                const nameArMatch = raw.match(/[\u0600-\u06FF\s]{8,}/);
                if (nameArMatch && !f.nameAr.value) {
                    const unwanted = ['الجنسية', 'بنجلاديش', 'باكستان', 'الهند', 'نيbal'];
                    if (clean.replace(/\D/g, '').length < 8 && !unwanted.some(w => raw.includes(w))) {
                        f.nameAr.value = nameArMatch[0].trim();
                    }
                }

                // Dates Extraction
                const dateRegex = /([0-9]{4}[/-][0-9]{1,2}[/-][0-9]{1,2})|([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4})/g;
                const dateMatches = clean.match(dateRegex);
                if (dateMatches) {
                    dateMatches.forEach(dateStr => {
                        const std = dateStr.replace(/-/g, '/');
                        const p = std.split('/');
                        let year = p[0].length === 4 ? parseInt(p[0]) : parseInt(p[2]);
                        let fmt = p[0].length === 4 ? "YYYY/MM/DD" : "DD/MM/YYYY";

                        if (year >= 1600) {
                            const g = moment(std, fmt);
                            if (g.isValid()) {
                                f.dobG.value = g.format('DD/MM/YYYY');
                                f.dobH.value = g.format('iYYYY/iMM/iDD');
                            }
                        } else if (year >= 1300 && year <= 1500) {
                            const h = moment(std, fmt.replace('YYYY','iYYYY').replace('MM','iMM').replace('DD','iDD'));
                            if (h.isValid()) {
                                f.dobH.value = h.format('iYYYY/iMM/iDD');
                                f.dobG.value = h.format('DD/MM/YYYY');
                            }
                        }
                    });
                }
            });

            document.querySelectorAll('.skeleton-target').forEach(el => el.classList.remove('loading'));
            validateFields();
            adjustArHeight();
        }, 500);
    }

    // --- 4. KEYBOARD & UI LISTENERS ---
    f.btn.addEventListener('click', extract);

    f.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.ctrlKey) {
                e.preventDefault();
                const s = f.input.selectionStart;
                f.input.value = f.input.value.substring(0, s) + "\n" + f.input.value.substring(f.input.selectionEnd);
                f.input.selectionStart = f.input.selectionEnd = s + 1;
            } else { e.preventDefault(); extract(); }
        }
    });

    document.querySelectorAll('.nat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const en = btn.getAttribute('data-en'), ar = btn.getAttribute('data-ar');
            let copyText = (btn.innerText === en) ? en : ar;
            btn.innerText = (btn.innerText === en) ? ar : en;
            btn.classList.toggle('active-ar');
            navigator.clipboard.writeText(copyText);
        });
    });

    f.clear.addEventListener('click', () => {
        f.input.value = '';
        [f.nameAr, f.nameEn, f.aqama, f.dobH, f.dobG].forEach(el => {
            el.value = ''; el.classList.remove('valid', 'invalid');
        });
        f.nameAr.style.height = '46px';
    });

    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input, textarea');
            if (input && input.value) {
                navigator.clipboard.writeText(input.value);
                btn.classList.add('copied');
                setTimeout(() => btn.classList.remove('copied'), 1500);
            }
        });
    });
});
