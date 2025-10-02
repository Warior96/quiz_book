// CONFIGURAZIONE GOOGLE SHEETS
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyURZV6kQXjHZsRJ4DPBY1sQ0uBwRgr_TFt_Ur766HCqh1KN-TnZO6or47RuiO3C0Zw/exec';

// DATI UTENTE
let userData = {
    nome: '',
    haLetto: '',
    risposte: {},
    esito: ''
};

// DOMANDE PER CHI HA LETTO IL LIBRO
const domandeLettoLibro = [
    {
        id: 1,
        domanda: "Che rapporto hai con il tuo passato?",
        opzioni: [
            { id: 'M', testo: "Mi fa male e non sono ancora riuscito a superarlo" },
            { id: 'C', testo: "Passato? Io vivo nel presente!" },
            { id: 'A', testo: "Il passato è una grande lezione" },
            { id: 'F', testo: "Non ho mai riflettuto su questo" }
        ]
    },
    {
        id: 2,
        domanda: "Che rapporto hai con il mondo esterno?",
        opzioni: [
            { id: 'M', testo: "La mia mente è il mio rifugio sicuro" },
            { id: 'C', testo: "Mi piace stare al centro dell'attenzione e relazionarmi con le persone" },
            { id: 'A', testo: "Ciò che succede fuori è importante, ma sono focalizzato su me stesso" },
            { id: 'F', testo: "Non seguo le tendenze, mi piace ispirare gli altri" }
        ]
    },
    {
        id: 3,
        domanda: "In quale di queste situazioni non vorresti mai trovarti?",
        opzioni: [
            { id: 'M', testo: "Fare un lavoro che detesto" },
            { id: 'C', testo: "Scegliere tra vita personale e carriera" },
            { id: 'A', testo: "Vivere un'esistenza fatta di compromessi" },
            { id: 'F', testo: "Rinunciare alla mia personalità e alle mie idee" }
        ]
    },
    {
        id: 4,
        domanda: "Quale frase, tra queste, ti rappresenta di più?",
        opzioni: [
            { id: 'M', testo: "Mi piace vivere con la testa fra le nuvole" },
            { id: 'C', testo: "Mi piace provare emozioni nuove" },
            { id: 'A', testo: "Mi piace coltivare le mie passioni" },
            { id: 'F', testo: "Mi piace rompere gli schemi" }
        ]
    },
    {
        id: 5,
        domanda: "Hai un ultimo tentativo per provare a risolvere un problema. Come ti comporti?",
        opzioni: [
            { id: 'M', testo: "Aspetti finché la situazione non è più rimandabile" },
            { id: 'C', testo: "Non esiste l'ultima volta!" },
            { id: 'A', testo: "Presterò attenzione a tutte le mie mosse" },
            { id: 'F', testo: "Nei problemi ci navigo, è un'abitudine" }
        ]
    }
];

// DOMANDE PER CHI NON HA LETTO IL LIBRO
const domandeNonLettoLibro = [
    {
        id: 1,
        domanda: "Ti reputi:",
        opzioni: [
            { id: 'M', testo: "Introversa" },
            { id: 'C', testo: "Estroversa" },
            { id: 'Z', testo: "Dipende dalle situazioni" }
        ]
    },
    {
        id: 2,
        domanda: "Quale valore, tra questi, metteresti al primo posto?",
        opzioni: [
            { id: 'M', testo: "Lealtà" },
            { id: 'C', testo: "Realizzazione personale" },
            { id: 'Z', testo: "Amicizia" }
        ]
    },
    {
        id: 3,
        domanda: "Quale frase ti rappresenta di più?",
        opzioni: [
            { id: 'M', testo: "Essere, non apparire" },
            { id: 'C', testo: "La vita è fatta di occasioni da cogliere" },
            { id: 'Z', testo: "Senza i miei migliori amici, niente sarebbe lo stesso" }
        ]
    },
    {
        id: 4,
        domanda: "I cambiamenti:",
        opzioni: [
            { id: 'M', testo: "Non esistono" },
            { id: 'C', testo: "Rappresentano una sfida" },
            { id: 'Z', testo: "Mi spaventano" }
        ]
    },
    {
        id: 5,
        domanda: "Che rapporto hai con i social media?",
        opzioni: [
            { id: 'M', testo: "Social media? What?" },
            { id: 'C', testo: "Non potrei farne a meno" },
            { id: 'Z', testo: "Li uso, ma con moderazione" }
        ]
    }
];

// VARIABILI GLOBALI
let swiper;
let domande = [];

// FUNZIONE: INIZIALIZZAZIONE
function init() {
    generaSchermataWelcome();
    initSwiper();
}

// FUNZIONE: GENERA SCHERMATA WELCOME
function generaSchermataWelcome() {
    const wrapper = document.getElementById('swiperWrapper');

    const slideHTML = `
        <div class="swiper-slide">
            <div class="container">
                <div class="question-container">
                    <h1>Benvenuto nel quiz</h1>
                    <form id="welcomeForm">
                        <input type="text" id="username" placeholder="Inserisci il tuo nome" required>
                        <p style="margin-top: 30px;">Hai letto il libro?</p>
                        <div class="option">
                            <input type="radio" name="letto" id="si" value="si">
                            <label for="si">Sì</label>
                        </div>
                        <div class="option">
                            <input type="radio" name="letto" id="no" value="no" checked>
                            <label for="no">No</label>
                        </div>
                        <button type="submit">Inizia il Quiz</button>
                    </form>
                </div>
            </div>
        </div>
    `;

    wrapper.innerHTML = slideHTML;

    // Event listener per il form
    document.getElementById('welcomeForm').addEventListener('submit', function (e) {
        e.preventDefault();

        const nome = document.getElementById('username').value.trim();
        const haLetto = document.querySelector('input[name="letto"]:checked').value;

        if (!nome) {
            alert('Per favore, inserisci il tuo nome');
            return;
        }

        userData.nome = nome;
        userData.haLetto = haLetto === 'si' ? 'Sì' : 'No';

        // Seleziona le domande giuste
        domande = haLetto === 'si' ? domandeLettoLibro : domandeNonLettoLibro;

        // Genera le slide delle domande
        generaDomandeSlides();

        // Vai alla prossima slide
        swiper.slideNext();
    });
}

// FUNZIONE: GENERA SLIDES DOMANDE
function generaDomandeSlides() {
    const wrapper = document.getElementById('swiperWrapper');

    domande.forEach((domanda, index) => {
        const opzioniHTML = domanda.opzioni.map(opzione => `
            <div class="option">
                <input type="radio" name="q${domanda.id}" id="q${domanda.id}-${opzione.id}" value="${opzione.id}">
                <label for="q${domanda.id}-${opzione.id}">${opzione.testo}</label>
            </div>
        `).join('');

        const slideHTML = `
            <div class="swiper-slide">
                <div class="container">
                    <div class="question-container">
                        <h2>Domanda ${domanda.id}</h2>
                        <p>${domanda.domanda}</p>
                        ${opzioniHTML}
                        <button id="btn-q${domanda.id}" disabled>Invia</button>
                    </div>
                </div>
            </div>
        `;

        wrapper.insertAdjacentHTML('beforeend', slideHTML);
    });

    // Aggiungi slide esito
    const esitoSlideHTML = `
        <div class="swiper-slide">
            <div class="container">
                <div class="question-container">
                    <div id="esito">Calcolo del risultato...</div>
                </div>
            </div>
        </div>
    `;
    wrapper.insertAdjacentHTML('beforeend', esitoSlideHTML);

    // Aggiorna Swiper
    swiper.update();

    // Aggiungi event listeners
    aggiungiEventListeners();
}

// FUNZIONE: AGGIUNGI EVENT LISTENERS
function aggiungiEventListeners() {
    const nextBtn = document.querySelector('.swiper-button-next');

    domande.forEach(domanda => {
        const radioInputs = document.querySelectorAll(`input[name="q${domanda.id}"]`);
        const submitBtn = document.getElementById(`btn-q${domanda.id}`);

        // Abilita bottone quando radio selezionato
        radioInputs.forEach(input => {
            input.addEventListener('change', () => {
                submitBtn.disabled = false;
            });
        });

        // Click bottone
        submitBtn.addEventListener('click', () => {
            const selected = document.querySelector(`input[name="q${domanda.id}"]:checked`);
            if (selected) {
                userData.risposte[`domanda${domanda.id}`] = selected.value;

                // Mostra bottone next
                nextBtn.classList.remove('d-none');

                // Se è l'ultima domanda, calcola esito
                if (domanda.id === domande.length) {
                    calcolaEsito();
                    salvaRisposte();
                }
            }
        });
    });

    // Nascondi bottone next quando si cambia slide
    nextBtn.addEventListener('click', () => {
        nextBtn.classList.add('d-none');
    });
}

// FUNZIONE: CALCOLA ESITO
function calcolaEsito() {
    const risposte = Object.values(userData.risposte);

    if (userData.haLetto === 'Sì') {
        // Logica per chi HA letto
        const conteggioRisposte = {};
        risposte.forEach(risposta => {
            conteggioRisposte[risposta] = (conteggioRisposte[risposta] || 0) + 1;
        });

        const maxOccorrenze = Math.max(...Object.values(conteggioRisposte));
        const risposteMax = Object.keys(conteggioRisposte).filter(
            risposta => conteggioRisposte[risposta] === maxOccorrenze
        );

        // Converti lettere in nomi
        const nomiPersonaggi = {
            'M': 'Monica',
            'C': 'Carmen',
            'A': 'Angelo',
            'F': 'Fluffy'
        };

        const personaggi = risposteMax.map(r => nomiPersonaggi[r]).filter(Boolean);

        let fraseEsito = "";
        if (personaggi.length === 1) {
            fraseEsito = `Sei sicuramente ${personaggi[0]}!`;
        } else if (personaggi.length === 2) {
            fraseEsito = `Sei un mix di ${personaggi[0]} e ${personaggi[1]}!`;
        } else {
            fraseEsito = `Sei un po' di tutto! Hai caratteristiche di ${personaggi.join(', ')}.`;
        }

        userData.esito = fraseEsito;

    } else {
        // Logica per chi NON ha letto
        const m = risposte.filter(el => el === 'M').length;
        const c = risposte.filter(el => el === 'C').length;
        const z = risposte.filter(el => el === 'Z').length;

        if (Math.max(m, c, z) === z || c === m) {
            userData.esito = "Sei Mezzo";
        } else if (Math.max(m, c, z) === c) {
            userData.esito = "Sei Carmen";
        } else if (Math.max(m, c, z) === m) {
            userData.esito = "Sei Monica";
        }
    }

    // Mostra esito
    document.getElementById('esito').innerHTML = userData.esito;
}

// FUNZIONE: SALVA RISPOSTE SU GOOGLE SHEETS
async function salvaRisposte() {
    // Se l'URL non è configurato, salta il salvataggio
    if (GOOGLE_SCRIPT_URL === 'INSERISCI_QUI_IL_TUO_URL_GOOGLE_SCRIPT') {
        console.log('Google Sheets non configurato. Dati non salvati.');
        return;
    }

    try {
        const datiDaInviare = {
            nome: userData.nome,
            haLetto: userData.haLetto,
            domanda1: userData.risposte.domanda1 || '',
            domanda2: userData.risposte.domanda2 || '',
            domanda3: userData.risposte.domanda3 || '',
            domanda4: userData.risposte.domanda4 || '',
            domanda5: userData.risposte.domanda5 || '',
            esito: userData.esito
        };

        const response = await fetch(GOOGLE_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datiDaInviare)
        });

        console.log('Dati inviati a Google Sheets');

    } catch (error) {
        console.error('Errore nel salvataggio su Google Sheets:', error);
    }
}

// FUNZIONE: INIZIALIZZA SWIPER
function initSwiper() {
    swiper = new Swiper(".mySwiper", {
        cssMode: true,
        allowTouchMove: false,
        pagination: {
            el: ".swiper-pagination",
            type: "progressbar",
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev",
        },
    });
}

// AVVIO APPLICAZIONE
document.addEventListener('DOMContentLoaded', init);