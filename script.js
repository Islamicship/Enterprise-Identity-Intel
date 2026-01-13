document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Including Groups for Hiding/Showing
    const f = {
        card: document.querySelector('.data-card'),
        
        nameAr: document.getElementById('nameArabic'),
        grpNameAr: document.getElementById('grp-nameAr'),
        
        nameEn: document.getElementById('nameEnglish'),
        grpNameEn: document.getElementById('grp-nameEn'),
        
        aqama: document.getElementById('aqamaNumber'),
        grpAqama: document.getElementById('grp-aqama'),
        
        dobH: document.getElementById('dobHijri'),
        grpDobH: document.getElementById('grp-dobH'),
        
        dobG: document.getElementById('dobGregorian'),
        grpDobG: document.getElementById('grp-dobG'),
        
        grpNat: document.getElementById('grp-nat'), // Nationality Box
        
        input: document.getElementById('inputText'),
        btn: document.getElementById('processBtn'),
        clear: document.getElementById('clearAllBtn'),
        header: document.getElementById('headerReload')
    };

    // 1. Reload Logic
    if (f.header) { f.header.addEventListener('click', () => window.location.reload()); }

    // Utility
    const toLatin = (s) => s ? s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)) : '';

    // --- INSTANT COPY ENGINE ---
    function fastCopy(text) {
        if (!text) return;
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed";
        textArea.style.left = "-9999px";
        textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try { document.execCommand('copy'); } 
        catch (err) { console.error('Fast copy failed', err); navigator.clipboard.writeText(text); }
        document.body.removeChild(textArea);
    }

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

    // --- 2. MANUAL DATE LOGIC ---
    function handleManualDate(e, type) {
        if (e.inputType === 'deleteContentBackward') return;
        let input = e.target;
        let cursor = input.selectionStart;
        let val = toLatin(input.value).replace(/\D/g, ''); 
        let formatted = "";

        if (type === 'G') {
            if (val.length > 0) formatted += val.substring(0, 2);
            if (val.length > 2) formatted += '/' + val.substring(2, 4);
            if (val.length > 4) formatted += '/' + val.substring(4, 8);
        } else {
            if (val.length > 0) formatted += val.substring(0, 4);
            if (val.length > 4) formatted += '/' + val.substring(4, 6);
            if (val.length > 6) formatted += '/' + val.substring(6, 8);
        }

        const oldLen = input.value.length;
        input.value = formatted;
        if (formatted.length > oldLen && (formatted[cursor - 1] === '/')) { cursor++; }
        input.setSelectionRange(cursor, cursor);

        if (formatted.length === 10) {
            const m = moment(formatted, type === 'G' ? 'DD/MM/YYYY' : 'iYYYY/iMM/iDD');
            if (m.isValid()) {
                if (type === 'G') f.dobH.value = m.format('iYYYY/iMM/iDD');
                else f.dobG.value = m.format('DD/MM/YYYY');
            }
        }
    }

    f.dobG.addEventListener('input', (e) => handleManualDate(e, 'G'));
    f.dobH.addEventListener('input', (e) => handleManualDate(e, 'H'));

    // --- 3. ARABIC CLEANER (ALLAH FIX) ---
    function cleanArabicForIqama(text) {
        if (!text) return "";
        let cleaned = text.replace(/\uFDF2/g, "اللہ");
        cleaned = cleaned.replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, "");
        cleaned = cleaned.replace(/اللہ/g, "ال\u200Dله");
        cleaned = cleaned.replace(/الله/g, "ال\u200Dله");
        cleaned = cleaned.replace(/لل/g, "ل\u200Dل"); 
        return cleaned.trim();
    }

    // --- 4. EXTRACTION ENGINE (WITH DYNAMIC HIDE/SHOW) ---
    function extract() {
        let text = f.input.value.trim();
        if (!text) return;

        // Reset: Hide everything initially (Internal reset)
        // Note: We don't hide the card immediately to avoid flickering if already open
        
        document.querySelectorAll('.skeleton-target').forEach(el => {
            el.classList.add('loading'); el.value = ''; el.classList.remove('valid', 'invalid');
        });

        setTimeout(() => {
            // Processing
            const lines = text.split('\n');
            let foundData = false; // Flag to check if we found anything

            lines.forEach(line => {
                const raw = line.trim(), clean = toLatin(raw);
                
                // Iqama
                const aqamaMatch = clean.match(/[0-9]{10}/);
                if (aqamaMatch && !f.aqama.value) { 
                    f.aqama.value = aqamaMatch[0]; 
                    foundData = true; 
                }

                // Name English
                const nameEnMatch = raw.match(/[a-zA-Z\s]{5,}/);
                if (nameEnMatch && !f.nameEn.value && !/[0-9]/.test(raw)) { 
                    f.nameEn.value = nameEnMatch[0].trim().toUpperCase(); 
                    foundData = true; 
                }

                // Name Arabic
                const nameArMatch = raw.match(/[\u0600-\u06FF\s]{8,}/);
                if (nameArMatch && !f.nameAr.value) {
                    const unwanted = ['الجنسية', 'بنجلاديش', 'باكستان', 'الهند', 'نيبال'];
                    if (clean.replace(/\D/g, '').length < 8 && !unwanted.some(w => raw.includes(w))) {
                        f.nameAr.value = cleanArabicForIqama(nameArMatch[0]);
                        foundData = true;
                    }
                }

                // Dates
                const dateRegex = /([0-9]{4}[/-][0-9]{1,2}[/-][0-9]{1,2})|([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4})/g;
                const dateMatches = clean.match(dateRegex);
                if (dateMatches) {
                    dateMatches.forEach(dateStr => {
                        const std = dateStr.replace(/-/g, '/'), p = std.split('/');
                        let year = p[0].length === 4 ? parseInt(p[0]) : parseInt(p[2]), fmt = p[0].length === 4 ? "YYYY/MM/DD" : "DD/MM/YYYY";
                        if (year >= 1600) {
                            const g = moment(std, fmt);
                            if (g.isValid()) { 
                                f.dobG.value = g.format('DD/MM/YYYY'); 
                                f.dobH.value = g.format('iYYYY/iMM/iDD'); 
                                foundData = true;
                            }
                        } else if (year >= 1300 && year <= 1500) {
                            const h = moment(std, fmt.replace('YYYY','iYYYY').replace('MM','iMM').replace('DD','iDD'));
                            if (h.isValid()) { 
                                f.dobH.value = h.format('iYYYY/iMM/iDD'); 
                                f.dobG.value = h.format('DD/MM/YYYY'); 
                                foundData = true;
                            }
                        }
                    });
                }
            });

            // STOP Loading Animation
            document.querySelectorAll('.skeleton-target').forEach(el => el.classList.remove('loading'));

            // --- DYNAMIC SHOW LOGIC ---
            if (foundData) {
                f.card.style.display = 'block'; // Show Main Card
                
                // Only show fields that have values
                f.grpNameAr.style.display = f.nameAr.value ? 'block' : 'none';
                f.grpNameEn.style.display = f.nameEn.value ? 'block' : 'none';
                f.grpAqama.style.display = f.aqama.value ? 'block' : 'none';
                f.grpDobH.style.display = f.dobH.value ? 'block' : 'none';
                f.grpDobG.style.display = f.dobG.value ? 'block' : 'none';
                
                // Show Nationality Box if any data found
                f.grpNat.style.display = 'block';
                
                validateFields(); 
                adjustArHeight();
            } else {
                // If nothing found, keep hidden or show Alert? 
                // Currently keeping hidden as per "Hide/Unhide" logic
                // But generally good to keep card hidden if no result.
            }

        }, 500);
    }

    f.btn.addEventListener('click', extract);
    f.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.ctrlKey) {
                const s = f.input.selectionStart;
                f.input.value = f.input.value.substring(0, s) + "\n" + f.input.value.substring(f.input.selectionEnd);
                f.input.selectionStart = f.input.selectionEnd = s + 1;
            } else { extract(); }
        }
    });

    // Nationality Buttons
    document.querySelectorAll('.nat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const en = btn.getAttribute('data-en'), ar = btn.getAttribute('data-ar');
            let copyText = (btn.innerText === en) ? en : ar;
            fastCopy(copyText);
            btn.innerText = (btn.innerText === en) ? ar : en;
            btn.classList.toggle('active-ar');
        });
    });

    // Clear Button (Hides everything again)
    f.clear.addEventListener('click', () => {
        f.input.value = '';
        [f.nameAr, f.nameEn, f.aqama, f.dobH, f.dobG].forEach(el => { el.value = ''; el.classList.remove('valid', 'invalid'); });
        f.nameAr.style.height = '46px';
        
        // Hide Everything Logic
        f.card.style.display = 'none';
        f.grpNameAr.style.display = 'none';
        f.grpNameEn.style.display = 'none';
        f.grpAqama.style.display = 'none';
        f.grpDobH.style.display = 'none';
        f.grpDobG.style.display = 'none';
        f.grpNat.style.display = 'none';
    });

    // Copy Buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input, textarea');
            if (input && input.value) {
                fastCopy(input.value);
                btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1500);
            }
        });
    });
});
