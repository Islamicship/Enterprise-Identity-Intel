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

    // 1. Reload Functionality
    if (f.header) { f.header.addEventListener('click', () => window.location.reload()); }

    // 2. Utility: Arabic/Urdu Numbers to English
    const toLatin = (s) => s ? s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)) : '';

    // 3. Dynamic Textarea Height
    function adjustArHeight() {
        f.nameAr.style.height = "46px";
        if (f.nameAr.value.trim() !== "") { f.nameAr.style.height = f.nameAr.scrollHeight + "px"; }
    }

    // 4. Border Validation Colors
    function validateFields() {
        if (f.aqama.value.length === 10) f.aqama.classList.add('valid');
        else if (f.aqama.value.length > 0) f.aqama.classList.add('invalid');
        if (f.nameEn.value.length > 5) f.nameEn.classList.add('valid');
        if (f.nameAr.value.length > 5) f.nameAr.classList.add('valid');
    }

    // 5. Extraction Engine
    function extract() {
        let text = f.input.value.trim();
        if (!text) return;

        // Trigger Loading State
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

                // A. Aqama (10 Digits)
                const aqamaMatch = clean.match(/[0-9]{10}/);
                if (aqamaMatch && !f.aqama.value) f.aqama.value = aqamaMatch[0];

                // B. English Name (Auto Uppercase)
                const nameEnMatch = raw.match(/[a-zA-Z\s]{5,}/);
                if (nameEnMatch && !f.nameEn.value && !/[0-9]/.test(raw)) {
                    f.nameEn.value = nameEnMatch[0].trim().toUpperCase();
                }

                // C. Arabic Name (Excludes Unwanted keywords)
                const nameArMatch = raw.match(/[\u0600-\u06FF\s]{8,}/);
                if (nameArMatch && !f.nameAr.value) {
                    const unwanted = ['الجنسية', 'بنجلاديش', 'باكستان', 'الهند', 'نيبال'];
                    if (clean.replace(/\D/g, '').length < 8 && !unwanted.some(w => raw.includes(w))) {
                        f.nameAr.value = nameArMatch[0].trim();
                    }
                }

                // D. Smart Date Detection
                const dateRegex = /([0-9]{4}[/-][0-9]{1,2}[/-][0-9]{1,2})|([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4})/g;
                const dateMatches = clean.match(dateRegex);
                if (dateMatches) {
                    dateMatches.forEach(dateStr => {
                        const standardDate = dateStr.replace(/-/g, '/');
                        const parts = standardDate.split('/');
                        let year = parts[0].length === 4 ? parseInt(parts[0]) : parseInt(parts[2]);
                        let format = parts[0].length === 4 ? "YYYY/MM/DD" : "DD/MM/YYYY";

                        if (year >= 1600) {
                            const g = moment(standardDate, format);
                            if (g.isValid()) { 
                                f.dobG.value = g.format('DD/MM/YYYY'); 
                                f.dobH.value = g.format('iYYYY/iMM/iDD'); 
                            }
                        } else if (year >= 1300 && year <= 1500) {
                            const hFormat = format.replace('YYYY','iYYYY').replace('MM','iMM').replace('DD','iDD');
                            const h = moment(standardDate, hFormat);
                            if (h.isValid()) { 
                                f.dobH.value = h.format('iYYYY/iMM/iDD'); 
                                f.dobG.value = h.format('DD/MM/YYYY'); 
                            }
                        }
                    });
                }
            });
            // Stop Loading & Refresh UI
            document.querySelectorAll('.skeleton-target').forEach(el => el.classList.remove('loading'));
            validateFields();
            adjustArHeight();
        }, 500);
    }

    // 6. Event Listeners
    f.btn.addEventListener('click', extract);

    f.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.ctrlKey) {
                // Ctrl + Enter: Insert New Line
                e.preventDefault();
                const s = f.input.selectionStart;
                f.input.value = f.input.value.substring(0, s) + "\n" + f.input.value.substring(f.input.selectionEnd);
                f.input.selectionStart = f.input.selectionEnd = s + 1;
            } else { 
                // Only Enter: Process
                e.preventDefault(); 
                extract(); 
            }
        }
    });

    // Nationality Quick Toggle & Copy
    document.querySelectorAll('.nat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const en = btn.getAttribute('data-en'), ar = btn.getAttribute('data-ar');
            let copyText = (btn.innerText === en) ? en : ar;
            btn.innerText = (btn.innerText === en) ? ar : en;
            btn.classList.toggle('active-ar');
            navigator.clipboard.writeText(copyText);
        });
    });

    // Clear Everything
    f.clear.addEventListener('click', () => {
        f.input.value = '';
        [f.nameAr, f.nameEn, f.aqama, f.dobH, f.dobG].forEach(el => {
            el.value = ''; el.classList.remove('valid', 'invalid');
        });
        f.nameAr.style.height = '46px';
    });

    // Instant Copy with Feedback
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