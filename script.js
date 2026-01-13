document.addEventListener('DOMContentLoaded', () => {
    
    // --- GLOBAL UTILITIES ---
    window.fastCopy = function(text) {
        if (!text) return;
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.position = "fixed"; textArea.style.left = "-9999px"; textArea.style.top = "0";
        document.body.appendChild(textArea);
        textArea.focus(); textArea.select();
        try { document.execCommand('copy'); } catch (err) { navigator.clipboard.writeText(text); }
        document.body.removeChild(textArea);
    };
    window.toLatin = (s) => s ? s.replace(/[٠-٩]/g, d => "٠١٢٣٤٥٦٧٨٩".indexOf(d)).replace(/[۰-۹]/g, d => "۰۱۲۳۴۵۶۷۸۹".indexOf(d)) : '';

    // --- PWA INSTALL LOGIC ---
    let deferredPrompt;
    const installBtn = document.getElementById('installAppBtn');
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault(); deferredPrompt = e;
        if(installBtn) installBtn.style.display = 'flex';
    });
    if(installBtn) {
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((r) => {
                    if (r.outcome === 'accepted') installBtn.style.display = 'none';
                    deferredPrompt = null;
                });
            }
        });
    }

    // --- TABS LOGIC ---
    const tabs = document.querySelectorAll('.nav-tab');
    const sections = document.querySelectorAll('.app-section');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            if (tab.classList.contains('install-btn')) return;
            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => { s.classList.remove('active-section'); s.style.display = 'none'; });
            tab.classList.add('active');
            const target = document.getElementById(tab.getAttribute('data-target'));
            if (target) { target.style.display = 'block'; setTimeout(() => target.classList.add('active-section'), 10); }
        });
    });
    document.getElementById('tab-extractor').style.display = 'block';
    setTimeout(() => document.getElementById('tab-extractor').classList.add('active-section'), 10);

    // ===========================
    // EXTRACTOR LOGIC
    // ===========================
    (function initExtractor() {
        const f = {
            card: document.querySelector('.data-card'),
            nameAr: document.getElementById('nameArabic'), grpNameAr: document.getElementById('grp-nameAr'),
            nameEn: document.getElementById('nameEnglish'), grpNameEn: document.getElementById('grp-nameEn'),
            aqama: document.getElementById('aqamaNumber'), grpAqama: document.getElementById('grp-aqama'),
            dobH: document.getElementById('dobHijri'), grpDobH: document.getElementById('grp-dobH'),
            dobG: document.getElementById('dobGregorian'), grpDobG: document.getElementById('grp-dobG'),
            grpNat: document.getElementById('grp-nat'),
            input: document.getElementById('inputText'),
            btn: document.getElementById('processBtn'),
            clear: document.getElementById('clearAllBtn'),
            header: document.getElementById('headerReload')
        };

        if (f.header) { f.header.addEventListener('click', () => window.location.reload()); }

        function cleanArabicForIqama(text) {
            if (!text) return "";
            let cleaned = text.replace(/\uFDF2/g, "اللہ").replace(/[\u064B-\u0652\u0670\u06D6-\u06ED]/g, "");
            return cleaned.replace(/اللہ/g, "ال\u200Dله").replace(/الله/g, "ال\u200Dله").replace(/لل/g, "ل\u200Dل").trim();
        }

        function extract() {
            let text = f.input.value.trim();
            if (!text) return;
            document.querySelectorAll('.skeleton-target').forEach(el => { el.classList.add('loading'); el.value = ''; });

            setTimeout(() => {
                const lines = text.split('\n');
                let foundData = false;
                lines.forEach(line => {
                    const raw = line.trim(), clean = window.toLatin(raw);
                    const aqamaMatch = clean.match(/[0-9]{10}/);
                    if (aqamaMatch && !f.aqama.value) { f.aqama.value = aqamaMatch[0]; foundData = true; }
                    const nameEnMatch = raw.match(/[a-zA-Z\s]{5,}/);
                    if (nameEnMatch && !f.nameEn.value && !/[0-9]/.test(raw)) { f.nameEn.value = nameEnMatch[0].trim().toUpperCase(); foundData = true; }
                    const nameArMatch = raw.match(/[\u0600-\u06FF\s]{8,}/);
                    if (nameArMatch && !f.nameAr.value) {
                        if (clean.replace(/\D/g, '').length < 8 && !['الجنسية', 'بنجلاديش'].some(w => raw.includes(w))) {
                            f.nameAr.value = cleanArabicForIqama(nameArMatch[0]); foundData = true;
                        }
                    }
                    const dateMatches = clean.match(/([0-9]{4}[/-][0-9]{1,2}[/-][0-9]{1,2})|([0-9]{1,2}[/-][0-9]{1,2}[/-][0-9]{4})/g);
                    if (dateMatches) {
                        dateMatches.forEach(dateStr => {
                            const std = dateStr.replace(/-/g, '/'), p = std.split('/');
                            let year = p[0].length === 4 ? parseInt(p[0]) : parseInt(p[2]), fmt = p[0].length === 4 ? "YYYY/MM/DD" : "DD/MM/YYYY";
                            if (window.moment) {
                                if (year >= 1600) {
                                    const g = moment(std, fmt);
                                    if (g.isValid()) { f.dobG.value = g.format('DD/MM/YYYY'); f.dobH.value = g.format('iYYYY/iMM/iDD'); foundData = true; }
                                } else if (year >= 1300 && year <= 1500) {
                                    const h = moment(std, fmt.replace('YYYY','iYYYY').replace('MM','iMM').replace('DD','iDD'));
                                    if (h.isValid()) { f.dobH.value = h.format('iYYYY/iMM/iDD'); f.dobG.value = h.format('DD/MM/YYYY'); foundData = true; }
                                }
                            }
                        });
                    }
                });
                document.querySelectorAll('.skeleton-target').forEach(el => el.classList.remove('loading'));
                if (foundData) {
                    f.card.style.display = 'block';
                    f.grpNameAr.style.display = f.nameAr.value ? 'block' : 'none';
                    f.grpNameEn.style.display = f.nameEn.value ? 'block' : 'none';
                    f.grpAqama.style.display = f.aqama.value ? 'block' : 'none';
                    f.grpDobH.style.display = f.dobH.value ? 'block' : 'none';
                    f.grpDobG.style.display = f.dobG.value ? 'block' : 'none';
                    f.grpNat.style.display = 'block';
                    if (f.nameAr.value) f.nameAr.style.height = f.nameAr.scrollHeight + "px";
                }
            }, 500);
        }

        f.btn.addEventListener('click', extract);
        
        // --- CTRL + ENTER NEW LINE FIX ---
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

        document.querySelectorAll('.nat-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const en = btn.getAttribute('data-en'), ar = btn.getAttribute('data-ar');
                let copyText = (btn.innerText === en) ? en : ar;
                window.fastCopy(copyText);
                btn.innerText = (btn.innerText === en) ? ar : en;
                btn.classList.toggle('active-ar');
            });
        });
        f.clear.addEventListener('click', () => {
            f.input.value = '';
            [f.nameAr, f.nameEn, f.aqama, f.dobH, f.dobG].forEach(el => el.value = '');
            f.card.style.display = 'none';
        });
        document.querySelectorAll('.copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const input = btn.parentElement.querySelector('input, textarea');
                if (input && input.value) { window.fastCopy(input.value); btn.classList.add('copied'); setTimeout(() => btn.classList.remove('copied'), 1500); }
            });
        });
    })();

    // ===========================
    // GENERATOR LOGIC
    // ===========================
    (function initGenerator() {
        const GenApp = {
            dataStore: {
                pakistan: {
                    prefixes: { 'Punjab': '33100', 'Islamabad': '61101', 'Lahore': '35202', 'Karachi': '42101', 'Peshawar': '17101', 'Quetta': '54401', 'Azad Kashmir': '90202' },
                    streets: ['Street 4', 'Street 11', 'Main Boulevard', 'Street 7, Block B', 'Lane 5', 'Sector F', 'Block C'],
                    areas: {
                        'Punjab': { prov: 'Punjab', places: ['Satellite Town, Gujranwala', 'Peoples Colony, Faisalabad', 'Cantt, Sialkot', 'Civil Lines, Multan'] },
                        'Lahore': { prov: 'Punjab', places: ['Model Town', 'DHA Phase 6', 'Johar Town', 'Gulberg III', 'Bahria Town', 'Wapda Town'] },
                        'Karachi': { prov: 'Sindh', places: ['Clifton Block 4', 'Gulshan-e-Iqbal', 'DHA Phase 5', 'North Nazimabad', 'PECHS Block 6'] },
                        'Islamabad': { prov: 'ICT', places: ['F-7/2', 'G-11 Markaz', 'E-11/3', 'Bahria Enclave', 'DHA Phase 2', 'Blue Area'] },
                        'Peshawar': { prov: 'Khyber Pakhtunkhwa', places: ['Hayatabad Phase 3', 'University Town', 'Gulbahar No. 2', 'DHA Peshawar'] },
                        'Quetta': { prov: 'Balochistan', places: ['Jinnah Town', 'Zarghoon Road', 'Cantt Area', 'Satellite Town'] },
                        'Azad Kashmir': { prov: 'AJK', places: ['Sector B-3, Mirpur', 'Upper Plate, Muzaffarabad', 'Rawalakot City'] }
                    }
                },
                other: {
                    India: { cities: ['Mumbai', 'Delhi', 'Bangalore'], areas: ['Andheri West', 'Connaught Place', 'Indiranagar'] },
                    UAE: { cities: ['Dubai', 'Abu Dhabi'], areas: ['Marina', 'Downtown', 'Al Barsha', 'Jumeirah'] },
                    Qatar: { cities: ['Doha', 'Al Rayyan'], areas: ['West Bay', 'The Pearl', 'Lusail City'] },
                    Bangladesh: { cities: ['Dhaka', 'Chittagong'], areas: ['Gulshan 2', 'Banani', 'Dhanmondi'] },
                    Nepal: { cities: ['Kathmandu', 'Pokhara'], areas: ['Thamel', 'Lakeside', 'Baluwatar'] },
                    Afghanistan: { cities: ['Kabul', 'Herat'], areas: ['Shahr-e-Naw', 'Wazir Akbar Khan'] }
                }
            },
            elements: {},
            
            init() {
                if(!document.getElementById('generate-btn')) return;
                this.cacheElements();
                this.bindEvents();
                this.setLiveDate();
                this.handleGeneration(); 
            },

            cacheElements() {
                this.elements = {
                    countrySelect: document.getElementById('country-select'),
                    cityContainer: document.getElementById('city-selection-container'),
                    citySelect: document.getElementById('city-select'),
                    generateBtn: document.getElementById('generate-btn'),
                    copyAllBtn: document.getElementById('copy-all-btn'),
                    grid: document.querySelector('.gen-grid'),
                    toast: document.getElementById('gen-toast'),
                    boxes: document.querySelectorAll('.gen-data-box'),
                    outputs: {
                        idNumber: document.getElementById('id-number'),
                        licenseNumber: document.getElementById('license-number'),
                        issueDate: document.getElementById('issue-date'),
                        expiryDate: document.getElementById('expiry-date'),
                        fullAddress: document.getElementById('full-address'),
                        currentDate: document.getElementById('current-date'),
                        weekday: document.getElementById('weekday'),
                    }
                };
            },

            bindEvents() {
                if(this.elements.generateBtn) this.elements.generateBtn.addEventListener('click', () => this.handleGeneration());
                if(this.elements.countrySelect) this.elements.countrySelect.addEventListener('change', () => {
                    this.elements.cityContainer.style.display = (this.elements.countrySelect.value === 'Pakistan') ? 'flex' : 'none';
                    this.handleGeneration();
                });
                if(this.elements.citySelect) this.elements.citySelect.addEventListener('change', () => this.handleGeneration());
                if(this.elements.grid) this.elements.grid.addEventListener('click', (e) => this.handleCopyClick(e));
                if(this.elements.copyAllBtn) this.elements.copyAllBtn.addEventListener('click', () => this.handleCopyAll());
            },

            generateData() {
                const country = this.elements.countrySelect.value;
                const city = this.elements.citySelect.value;
                const pad = (n) => String(n).padStart(2,'0');
                const rand = (min, max) => Math.floor(Math.random()*(max-min+1))+min;
                const randItem = (arr) => arr[Math.floor(Math.random()*arr.length)];

                let issueDate = new Date(2022, rand(0,11), rand(1,28));
                const expiryDate = new Date(issueDate); 
                expiryDate.setFullYear(expiryDate.getFullYear()+5); 
                expiryDate.setDate(expiryDate.getDate()-1);
                const fmt = (d) => `${pad(d.getDate())}-${pad(d.getMonth()+1)}-${d.getFullYear()}`;

                let idNum, addr;
                
                if (country === 'Pakistan') {
                    idNum = `${this.dataStore.pakistan.prefixes[city]}-${rand(1000000,9999999)}-${rand(1,9)}`;
                    const cData = this.dataStore.pakistan.areas[city];
                    const houseNum = rand(1, 400);
                    const street = randItem(this.dataStore.pakistan.streets);
                    const area = randItem(cData.places);
                    const cityStr = city==='Punjab'?'':city+', ';
                    addr = `House ${houseNum}, ${street}, ${area}, ${cityStr}${cData.prov}, Pakistan`;
                } else {
                    const cData = this.dataStore.other[country] || {cities:['Capital'], areas:['City Center']};
                    const bldg = randItem(['Tower', 'Residency', 'Heights']);
                    const flat = rand(101, 1205);
                    const area = randItem(cData.areas);
                    const cityName = randItem(cData.cities);
                    
                    if (country === 'UAE') {
                         addr = `Flat ${flat}, ${randItem(['Al Attar', 'Marina', 'Gold'])} ${bldg}, ${area}, ${cityName}, UAE`;
                         idNum = `784-${rand(1982, 2004)}-${rand(10000,9999999)}-${rand(1,9)}`;
                    } else if (country === 'Qatar') {
                        addr = `Zone ${rand(10,90)}, Street ${rand(200,999)}, Bldg ${rand(1,100)}, ${area}, ${cityName}, Qatar`;
                        idNum = `2${rand(80,99)}352${rand(10000,99999)}`; 
                    } else if (country === 'India') {
                        addr = `Flat ${flat}, ${randItem(['Shanti', 'Gokul'])} Niwas, ${area}, ${cityName} - ${rand(400001, 400099)}, India`;
                        idNum = `${rand(2000,9999)} ${rand(1000,9999)} ${rand(1000,9999)}`;
                    } else if (country === 'Bangladesh') {
                        addr = `House ${rand(1,99)}, Road ${rand(1,30)}, ${area}, ${cityName}, Bangladesh`;
                        idNum = `${rand(1000000000, 9999999999)}`;
                    } else if (country === 'Afghanistan') {
                        addr = `House ${rand(1,200)}, Street ${rand(1,15)}, ${area}, ${cityName}, Afghanistan`;
                        idNum = `19${rand(85,99)}-${rand(1000,9999)}-${rand(10000,99999)}`;
                    } else {
                        addr = `Apt ${flat}, ${rand(1,99)} St, ${area}, ${cityName}, ${country}`;
                        idNum = `${rand(1000000000,9999999999)}`;
                    }
                }

                return {
                    idNumber: idNum,
                    licenseNumber: `${pad(rand(10,99))}-${rand(1000,9999)}`,
                    issueDate: fmt(issueDate),
                    expiryDate: fmt(expiryDate),
                    fullAddress: addr
                };
            },

            handleGeneration() {
                if(!this.elements.boxes) return;
                this.elements.boxes.forEach(b => { b.classList.remove('fade-in'); b.classList.add('fade-out'); });
                setTimeout(() => {
                    const data = this.generateData();
                    Object.keys(this.elements.outputs).forEach(k => { if(data[k]) this.elements.outputs[k].textContent = data[k]; });
                    this.elements.boxes.forEach(b => { b.classList.remove('fade-out'); void b.offsetWidth; b.classList.add('fade-in'); });
                }, 300);
            },

            handleCopyClick(e) {
                const btn = e.target.closest('.gen-copy-btn');
                if (!btn) return;
                const txt = document.getElementById(btn.getAttribute('data-target')).innerText;
                window.fastCopy(txt);
                this.showToast();
            },

            handleCopyAll() {
                const txt = `ID: ${this.elements.outputs.idNumber.textContent}\nAddress: ${this.elements.outputs.fullAddress.textContent}`;
                window.fastCopy(txt);
                this.showToast('All Details Copied!');
            },

            showToast(msg = 'Copied!') {
                this.elements.toast.textContent = msg;
                this.elements.toast.classList.add('show');
                setTimeout(() => this.elements.toast.classList.remove('show'), 2000);
            },

            setLiveDate() {
                if(!window.moment) return;
                const now = new Date();
                const hijri = moment().format('iYYYY/iMM/iDD');
                const engDate = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
                
                this.elements.outputs.currentDate.innerHTML = `${hijri} -<br>${engDate}`;
                this.elements.outputs.weekday.textContent = now.toLocaleString('en-US', { weekday: 'long' });
            }
        };

        setTimeout(() => GenApp.init(), 1000);
    })();

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./service-worker.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.error('Service Worker Error', err));
    }
});