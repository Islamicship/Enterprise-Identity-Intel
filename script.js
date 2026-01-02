document.addEventListener('DOMContentLoaded', () => { toLatin = (s) => s ? s.replace(/[٠-٩]/g, d => "٠١
    const f = {
        nameAr: document.getElementById('nameArabic'),
        nameEn: document٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => ".getElementById('nameEnglish'),
        aqama: document.getElementById('aqamaNumber'),
        dobH: document.getElementById('dobHijri'),
        dobG: document.getElementById('dobGregorian'),
        input۰۱۲۳۴۵۶۷۸۹".indexOf(d)) : '';

    // 3. Auto-height: document.getElementById('inputText'),
        btn: document.getElementById('processBtn'),
        clear: document. for Arabic Name Textarea
    function adjustArHeight() {
        f.nameAr.style.height = "46pxgetElementById('clearAllBtn'),
        header: document.getElementById('headerReload')
    };

    // ";
        if (f.nameAr.value.trim() !== "") { f.nameAr.style.height =1. Professional Reload logic
    if (f.header) { f.header.addEventListener('click', () => window.location.reload f.nameAr.scrollHeight + "px"; }
    }

    // 4. UI Validation (Border()); }

    const toLatin = (s) => s ? s.replace(/[٠-٩]/g, Colors)
    function validateFields() {
        [f.aqama, f.nameEn, f. d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => "۰۱۲nameAr].forEach(el => el.classList.remove('valid', 'invalid'));
        if (f.۳۴۵۶۷۸۹".indexOf(d)) : '';

    function adjustArHeight() {
        aqama.value.length === 10) f.aqama.classList.add('valid');
        f.nameAr.style.height = "46px";
        if (f.nameAr.valueif (f.nameEn.value.length > 5) f.nameEn.classList.add('valid.trim() !== "") {
            f.nameAr.style.height = f.nameAr.scrollHeight + "px";
        }
');
        if (f.nameAr.value.length > 5) f.nameAr.classList.    }

    function validateFields() {
        [f.aqama, f.nameEn, f.nameAradd('valid');
    }

    // 5. Manual Date Input Logic (Auto-Slash & Conversion)
    function].forEach(el => el.classList.remove('valid', 'invalid'));
        if (f.aqama.value.length === 10) f.aqama.classList.add('valid');
        if (f.nameEn.value. handleDateInput(e, type) {
        if (e.inputType === 'deleteContentBackward') return; // Don't format on backspace

        let input = e.target;
        let cursor = input.selectionStartlength > 5) f.nameEn.classList.add('valid');
        if (f.nameAr;
        let v = toLatin(input.value).replace(/\D/g, '');
        let formatted.value.length > 5) f.nameAr.classList.add('valid');
    }

     = "";

        if (type === 'G') { // Gregorian: DD/MM/YYYY
            if (v.length > 0// --- 2. ROCK-SOLID MANUAL DATE FORMATTING ---
    function formatManualDate(e, type) {
) formatted += v.substring(0, 2);
            if (v.length > 2) formatted += '/' + v.substring(2, 4);
            if (v.length > 4) formatted        if (e.inputType === 'deleteContentBackward') return; // Backspace guard

        let input = e.target;
        let += '/' + v.substring(4, 8);
        } else { // Hijri: YYYY/MM/DD
            if (v.length > 0) formatted += v.substring(0, 4);
            if (v.length > 4) formatted += '/' + v.substring(4, 6);
            if (v.length > 6) formatted += '/' + v.substring(6,  value = toLatin(input.value).replace(/\D/g, ''); // Numbers only
        let formatted = "";8);
        }

        const oldLen = input.value.length;
        input.value = formatted;
        


        if (type === 'G') { // Gregorian: DD/MM/YYYY
            if (value.length > 0        // Fix cursor position
        if (formatted.length > oldLen && formatted[cursor - 1] === '/') cursor++;
        input.setSelectionRange(cursor, cursor);

        // Conversion on completion
        if (formatted.length === ) formatted += value.substring(0, 2);
            if (value.length > 2) formatted10) {
            const m = moment(formatted, type === 'G' ? 'DD/MM/YYYY' : 'iYYYY/iMM/iDD');
            if (m.isValid()) {
                if (type === 'G') f.dobH.value = m.format('iYYYY/iMM/iDD');
                else f.dobG.value = m.format('DD/MM/YYYY');
 += '/' + value.substring(2, 4);
            if (value.length > 4) formatted            }
        }
    }

    f.dobG.addEventListener('input', (e) => handleDateInput(e, 'G'));
    f.dobH.addEventListener('input', (e) => handleDateInput(e, 'H'));

    // 6. Core Extraction Engine
    function extract() {
        let text = f.input += '/' + value.substring(4, 8);
        } else { // Hijri: YYYY/MM/DD
            if (value.length > 0) formatted += value.substring(0, 4);
            if (value.length > 4) formatted += '/' + value.substring(4, 6);
            if (value.length > 6) formatted += '/' + value.substring(6, 8);
        }

        input.value = formatted;

        // Auto-Conversion on Completion
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

    f.dobG.addEventListener('input', (e) => formatManualDate(e, 'G'));
    f.dobH.addEventListener('input', (e) => formatManualDate(e, 'H'));

    // --- 3. MAIN EXTRACTION ENGINE ---
    function extract() {
        let text = f.input.value.trim();
        if (!text) return;

        document.querySelectorAll('.skeleton-target').forEach(el => {
            el.classList.add('loading'); el.value = ''; el.classList.remove('valid', 'invalid');
        });

        setTimeout(() => {
            const lines = text.split('\n');
            lines.forEach(line =>.value.trim();
        if (!text) return;

        // Visual Loader State
        document.querySelectorAll('.skeleton-target').forEach(el => {
            el.classList.add('loading'); el.value = ''; el.classList.remove('valid', 'invalid');
        });

        setTimeout(() => {
            const lines = text.split('\n');
             {
                const raw = line.trim(), clean = toLatin(raw);
                
                // Aqama 10 Digits
                const aqamaMatch = clean.match(/[0-9]{10}/);
lines.forEach(line => {
                const raw = line.trim(), clean = toLatin(raw);
                
                // Extract Aqama
                const aqamaMatch = clean.match(/[0-9]{10}/);
                if                if (aqamaMatch && !f.aqama.value) f.aqama.value = aqamaMatch[0];

                // English Name
                const nameEnMatch = raw.match(/[a-zA- (aqamaMatch && !f.aqama.value) f.aqama.value = aqamaMatch[0];

                // Extract English Name
                const nameEnMatch = raw.match(/[a-zA-ZZ\s]{5,}/);
                if (nameEnMatch && !f.nameEn.value &&\s]{5,}/);
                if (nameEnMatch && !f.nameEn.value && ! !/[0-9]/.test(raw)) {
                    f.nameEn.value = nameEnMatch[0].trim().toUpperCase();
                }

                // Arabic Name
                const nameArMatch = raw.match(/[\u0600-\u06FF\s]{8,}/);
                if (nameArMatch &&/[0-9]/.test(raw)) f.nameEn.value = nameEnMatch[0].trim().toUpperCase();

                // Extract Arabic Name
                const nameArMatch = raw.match(/[\u06 !f.nameAr.value) {
                    const unwanted = ['الجنسية', 'بنجلادي00-\u06FF\s]{8,}/);
                if (nameArMatch && !f.nameAr.value) {
                    const unwanted = ['الجنسية', 'بنجلاديش',ش', 'باكستان', 'الهند', 'نيبال'];
                    if (clean.replace(/\D/g, '').length < 8 && !unwanted.some(w => raw.includes(w))) {
                        f.nameAr. 'باكستان', 'الهند', 'نيبال'];
                    if (clean.replace(/\D/g, '').length < 8 && !unwanted.some(w => raw.includes(w))) f.nameAr.value = nameArMatch[0].trim();
                }

                // Extract and Convert Dates
                const dateRegex = /([0-9]{4}[/-][0-9]{1,2}[/-][0-9]{1,value = nameArMatch[0].trim();
                    }
                }

                // Smart Date Extraction
                const dateRegex =2})|([0-9]{1,2}[/-][0-9]{1,2}[/-][ /([0-9]{4}[/-][0-9]{1,2}[/-][0-9]{1,2})|([00-9]{4})/g;
                const dateMatches = clean.match(dateRegex);
                if-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4})/g;
                const dateMatches = clean.match(dateRegex);
                if (dateMatches) {
                    dateMatches.forEach( (dateMatches) {
                    dateMatches.forEach(dateStr => {
                        const std = dateStr.replace(/-/g, '/'), p = std.split('/');
                        let year = p[0].length === 4 ? parseInt(p[dateStr => {
                        const std = dateStr.replace(/-/g, '/');
                        const p =0]) : parseInt(p[2]), fmt = p[0].length === 4 ? "YYYY/MM/DD" : "DD/MM/YYYY";
                        
                        if (year >= 1600) {
                            const g = moment(std, fmt);
                            if (g.isValid()) { f.dobG.value = g.format('DD/MM/YYYY'); f.dobH.value = g.format('iYYYY/iMM/iDD'); }
                        } else if (year >= 1300 && year <= 1 std.split('/');
                        let year = p[0].length === 4 ? parseInt(p[0]) : parseInt(p[2]);
                        let fmt = p[0].length === 4 ? "YYYY/MM/DD" : "DD/MM/YYYY";

                        if (year >= 1600) {
                            const g = moment(std, fmt);
                            if (g.isValid()) { 
                                f.dobG.value =500) {
                            const h = moment(std, fmt.replace('YYYY','iYYYY').replace('MM','iMM').replace('DD','iDD'));
                            if (h.isValid()) { f. g.format('DD/MM/YYYY'); 
                                f.dobH.value = g.format('iYYYY/iMM/iDD'); 
                            }
                        } else if (year >= 1300 && year <= 1500) {
                            const h = moment(std, fmt.replace('YYYY','iYYYY').replace('MM','iMM').replace('DD','iDD'));
                            if (h.isValid()) { 
                                f.dobH.value = h.format('iYYYY/iMM/iDD'); 
                                fdobH.value = h.format('iYYYY/iMM/iDD'); f.dobG.value = h.format('DD/MM/YYYY'); }
                        }
                    });
                }
            });.dobG.value = h.format('DD/MM/YYYY'); 
                            }
                        }
                    });
                }
            });
            document.querySelectorAll('.skeleton-target').forEach(el => el.
            document.querySelectorAll('.skeleton-target').forEach(el => el.classList.remove('loading'));
            validateFields(); adjustArHeight();
        }, 500);
    }

    f.btn.addEventListener('clickclassList.remove('loading'));
            validateFields(); adjustArHeight();
        }, 500);
    }

    f.btn.addEventListener('click', extract);

    // Enter for Process | Ctrl + Enter for New Line
    f.input.', extract);

    // Keyboard Shortcuts
    f.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (e.ctrladdEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            if (e.ctrlKey) {
                const s = f.input.selectionStart;
                f.input.Key) {
                const s = f.input.selectionStart;
                f.input.value = fvalue = f.input.value.substring(0, s) + "\n" + f.input.value.input.value.substring(0, s) + "\n" + f.input.value.substring(f.input.selectionEnd);
                f.input.selectionStart = f.input.selectionEnd = s + 1;
            } else { extract(); }
        }
    });

    // Nationality Quick Buttons.substring(f.input.selectionEnd);
                f.input.selectionStart = f.input.selection
    document.querySelectorAll('.nat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const en = btn.getAttribute('data-en'), ar = btn.getAttribute('data-arEnd = s + 1;
                e.preventDefault();
            } else { 
                e.preventDefault(); extract(); 
            }
        }
    });

    // Nationality Buttons
    document.querySelectorAll('.nat-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const en = btn.getAttribute('data-en'), ar = btn.getAttribute('data-ar');
            let copyText = btn');
            let copyText = (btn.innerText === en) ? en : ar;
            btn.innerText = (btn.innerText ===.innerText === en ? en : ar;
            btn.innerText = btn.innerText === en ? ar : en;
            btn.classList.toggle('active-ar');
            navigator.clipboard.writeText(copyText en) ? ar : en;
            btn.classList.toggle('active-ar');
            navigator.clipboard.writeText(copyText);
        });
    });

    // Clear Logic
    f.clear.addEventListener('click', () => {
        f.input.value = '';
        [f.nameAr, f.nameEn, f.aqama, f.dobH, f.dobG].forEach(el => { el.value = ''; el.classList.remove('valid', 'invalid'); });
        f.nameAr.style.height = '46px';
    });

    // Instant Copy Logic
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('input, textarea');
            if (input && input.value) {
                navigator.clipboard.writeText(input.value);
                btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1500);
            }
        });
    });
});
