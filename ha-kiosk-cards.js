// ═══════════════════════════════════════════
// clock-date-card
// ═══════════════════════════════════════════

class ClockDateCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._timer = null;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 0;
          background: var(--card-background-color, var(--primary-background-color, #111));
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
        }

        .weekday {
          font-size: 36px;
          font-weight: 400;
          letter-spacing: 6px;
          text-transform: uppercase;
          color: var(--disabled-text-color, #555);
          margin-bottom: 12px;
        }

        .time {
          display: flex;
          flex-direction: row;
          align-items: center;
          font-size: 120px;
          font-weight: 100;
          line-height: 1;
          font-variant-numeric: tabular-nums;
          color: var(--primary-text-color, #e1e1e1);
          letter-spacing: -4px;
        }

        .colon {
          font-size: 120px;
          margin: 0 4px;
          color: var(--divider-color, #444);
          line-height: 1;
          margin-bottom: 0.15em;
        }

        .date {
          font-size: 36px;
          font-weight: 300;
          letter-spacing: 3px;
          color: var(--secondary-text-color, #888);
          text-transform: uppercase;
          margin-top: 12px;
        }
      </style>

      <ha-card>
        <div class="weekday"></div>
        <div class="time">
          <span class="hours">00</span>
          <span class="colon">:</span>
          <span class="minutes">00</span>
        </div>
        <div class="date"></div>
      </ha-card>
    `;

    this._tick();
    const offset = 1000 - (new Date().getMilliseconds());
    setTimeout(() => {
      this._tick();
      this._timer = setInterval(() => this._tick(), 1000);
    }, offset);
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }

  _tick() {
    const WEEKDAYS = ["Sonntag","Montag","Dienstag","Mittwoch","Donnerstag","Freitag","Samstag"];
    const MONTHS   = ["Januar","Februar","März","April","Mai","Juni","Juli","August","September","Oktober","November","Dezember"];
    const pad = n => String(n).padStart(2, "0");
    const now = new Date();

    this.shadowRoot.querySelector(".hours").textContent   = pad(now.getHours());
    this.shadowRoot.querySelector(".minutes").textContent = pad(now.getMinutes());
    this.shadowRoot.querySelector(".date").textContent    =
      `${now.getDate()}. ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
    this.shadowRoot.querySelector(".weekday").textContent = WEEKDAYS[now.getDay()];
  }

  setConfig(_config) {}

  static getStubConfig() {
    return {};
  }
}

customElements.define("clock-date-card", ClockDateCard);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "clock-date-card",
  name: "Clock & Date Card",
  description: "Uhrzeit und Datum",
});


// ═══════════════════════════════════════════
// school-day-card
// ═══════════════════════════════════════════

// ── NRW Schulferien 2025–2028 ──
const SCHOOL_HOLIDAYS = [
  { name: "Osterferien",       start: "2025-04-14", end: "2025-04-26" },
  { name: "Pfingstferien",     start: "2025-06-10", end: "2025-06-10" },
  { name: "Sommerferien",      start: "2025-07-14", end: "2025-08-26" },
  { name: "Herbstferien",      start: "2025-10-13", end: "2025-10-25" },
  { name: "Weihnachtsferien",  start: "2025-12-22", end: "2026-01-06" },

  { name: "Osterferien",       start: "2026-03-30", end: "2026-04-11" },
  { name: "Pfingstferien",     start: "2026-05-26", end: "2026-05-26" },
  { name: "Sommerferien",      start: "2026-07-20", end: "2026-09-01" },
  { name: "Herbstferien",      start: "2026-10-17", end: "2026-10-31" },
  { name: "Weihnachtsferien",  start: "2026-12-23", end: "2027-01-06" },

  { name: "Osterferien",       start: "2027-03-22", end: "2027-04-03" },
  { name: "Pfingstferien",     start: "2027-05-18", end: "2027-05-18" },
  { name: "Sommerferien",      start: "2027-07-19", end: "2027-08-31" },
  { name: "Herbstferien",      start: "2027-10-23", end: "2027-11-06" },
  { name: "Weihnachtsferien",  start: "2027-12-24", end: "2028-01-08" },

  { name: "Osterferien",       start: "2028-04-10", end: "2028-04-22" },
  { name: "Sommerferien",      start: "2028-07-10", end: "2028-08-22" },
  { name: "Herbstferien",      start: "2028-10-23", end: "2028-11-04" },
  { name: "Weihnachtsferien",  start: "2028-12-21", end: "2029-01-05" },
];

// ── Gesetzliche Feiertage NRW 2025–2028 ──
const PUBLIC_HOLIDAYS = [
  { name: "Neujahr",                  date: "2025-01-01" },
  { name: "Karfreitag",               date: "2025-04-18" },
  { name: "Ostermontag",              date: "2025-04-21" },
  { name: "Tag der Arbeit",           date: "2025-05-01" },
  { name: "Christi Himmelfahrt",      date: "2025-05-29" },
  { name: "Pfingstmontag",            date: "2025-06-09" },
  { name: "Fronleichnam",             date: "2025-06-19" },
  { name: "Tag der Deutschen Einheit",date: "2025-10-03" },
  { name: "Allerheiligen",            date: "2025-11-01" },
  { name: "1. Weihnachtstag",         date: "2025-12-25" },
  { name: "2. Weihnachtstag",         date: "2025-12-26" },

  { name: "Neujahr",                  date: "2026-01-01" },
  { name: "Karfreitag",               date: "2026-04-03" },
  { name: "Ostermontag",              date: "2026-04-06" },
  { name: "Tag der Arbeit",           date: "2026-05-01" },
  { name: "Christi Himmelfahrt",      date: "2026-05-14" },
  { name: "Pfingstmontag",            date: "2026-05-25" },
  { name: "Fronleichnam",             date: "2026-06-04" },
  { name: "Tag der Deutschen Einheit",date: "2026-10-03" },
  { name: "Allerheiligen",            date: "2026-11-01" },
  { name: "1. Weihnachtstag",         date: "2026-12-25" },
  { name: "2. Weihnachtstag",         date: "2026-12-26" },

  { name: "Neujahr",                  date: "2027-01-01" },
  { name: "Karfreitag",               date: "2027-03-26" },
  { name: "Ostermontag",              date: "2027-03-29" },
  { name: "Tag der Arbeit",           date: "2027-05-01" },
  { name: "Christi Himmelfahrt",      date: "2027-05-06" },
  { name: "Pfingstmontag",            date: "2027-05-17" },
  { name: "Fronleichnam",             date: "2027-05-27" },
  { name: "Tag der Deutschen Einheit",date: "2027-10-03" },
  { name: "Allerheiligen",            date: "2027-11-01" },
  { name: "1. Weihnachtstag",         date: "2027-12-25" },
  { name: "2. Weihnachtstag",         date: "2027-12-26" },

  { name: "Neujahr",                  date: "2028-01-01" },
  { name: "Karfreitag",               date: "2028-04-14" },
  { name: "Ostermontag",              date: "2028-04-17" },
  { name: "Tag der Arbeit",           date: "2028-05-01" },
  { name: "Christi Himmelfahrt",      date: "2028-05-25" },
  { name: "Pfingstmontag",            date: "2028-06-05" },
  { name: "Fronleichnam",             date: "2028-06-15" },
  { name: "Tag der Deutschen Einheit",date: "2028-10-03" },
  { name: "Allerheiligen",            date: "2028-11-01" },
  { name: "1. Weihnachtstag",         date: "2028-12-25" },
  { name: "2. Weihnachtstag",         date: "2028-12-26" },
];

class SchoolDayCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._timer = null;
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 8px 0;
          background: var(--card-background-color, var(--primary-background-color, #111));
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
          position: relative;
        }

        .bg {
          position: absolute;
          top: 0;
          right: 10px;
          bottom: 0;
          display: flex;
          align-items: center;
          opacity: 0.25;
          pointer-events: none;
        }

        .bg svg {
          height: 200px;
          width: 200px;
        }

        .countdown {
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--disabled-text-color, #555);
          position: relative;
          z-index: 1;
        }

        .status {
          font-size: 36px;
          font-weight: 200;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--primary-text-color, #e1e1e1);
          margin-top: 4px;
          position: relative;
          z-index: 1;
        }
      </style>

      <ha-card>
        <div class="bg"></div>
        <div class="countdown"></div>
        <div class="status"></div>
      </ha-card>
    `;

    this._update();
    this._timer = setInterval(() => this._update(), 60000);
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }

  _update() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const info = this._getStatus(today);

    this.shadowRoot.querySelector(".countdown").textContent = info.countdown;
    this.shadowRoot.querySelector(".status").textContent = info.status;
    this.shadowRoot.querySelector(".bg").innerHTML = this._getSvg(info.type);
  }

  _getSvg(type) {
    const svgs = {
      schultag: `<svg viewBox="0 0 200 200" fill="none" stroke="#4A8AE6" stroke-width="6" stroke-linecap="round">
        <rect x="45" y="30" width="70" height="95" rx="3"/>
        <line x1="58" y1="52" x2="102" y2="52"/>
        <line x1="58" y1="66" x2="102" y2="66"/>
        <line x1="58" y1="80" x2="88" y2="80"/>
        <line x1="130" y1="170" x2="145" y2="50"/>
        <line x1="145" y1="50" x2="152" y2="53"/>
      </svg>`,
      wochenende: `<svg viewBox="0 0 200 200" fill="none" stroke="#FF8C00" stroke-width="6" stroke-linecap="round">
        <circle cx="100" cy="90" r="32"/>
        <line x1="100" y1="48" x2="100" y2="36"/>
        <line x1="100" y1="132" x2="100" y2="144"/>
        <line x1="58" y1="90" x2="46" y2="90"/>
        <line x1="142" y1="90" x2="154" y2="90"/>
        <line x1="77" y1="67" x2="69" y2="59"/>
        <line x1="123" y1="113" x2="131" y2="121"/>
        <line x1="123" y1="67" x2="131" y2="59"/>
        <line x1="77" y1="113" x2="69" y2="121"/>
      </svg>`,
      ferien: `<svg viewBox="0 0 200 200" fill="none" stroke="#2ECC71" stroke-width="6" stroke-linecap="round">
        <path d="M30 150 Q65 130 100 150 Q135 170 170 150"/>
        <path d="M30 165 Q65 145 100 165 Q135 185 170 165"/>
        <line x1="120" y1="145" x2="120" y2="50"/>
        <path d="M120 50 Q140 55 150 70 Q138 62 120 65"/>
        <path d="M120 65 Q142 68 148 85 Q135 78 120 80"/>
        <path d="M120 50 Q100 55 90 70 Q102 62 120 65"/>
        <path d="M120 65 Q98 68 92 85 Q105 78 120 80"/>
      </svg>`,
      feiertag: `<svg viewBox="0 0 200 200" fill="none" stroke="#FFD700" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="100,30 112,72 156,72 120,98 132,140 100,114 68,140 80,98 44,72 88,72"/>
      </svg>`,
    };
    return svgs[type] || "";
  }

  _getStatus(today) {
    const holiday = this._getHoliday(today);
    if (holiday) {
      const nextSchool = this._nextSchoolDay(today);
      const days = this._daysBetween(today, nextSchool) - 1;
      return {
        type: "ferien",
        status: holiday,
        detail: "",
        countdown: days <= 1 ? "Noch ein Tag" : `Noch ${days} Tage`,
      };
    }

    const publicHoliday = this._getPublicHoliday(today);
    if (publicHoliday) {
      const nextSchool = this._nextSchoolDay(today);
      const days = this._daysBetween(today, nextSchool) - 1;
      return {
        type: "feiertag",
        status: publicHoliday,
        detail: "",
        countdown: days <= 1 ? "Noch ein Tag" : `Noch ${days} Tage`,
      };
    }

    const dow = today.getDay();
    if (dow === 0 || dow === 6) {
      // Prüfe ob Wochenende an Ferien grenzt
      const nextMon = new Date(today);
      nextMon.setDate(nextMon.getDate() + ((8 - dow) % 7 || 7));
      const prevFri = new Date(today);
      prevFri.setDate(prevFri.getDate() - ((dow + 2) % 7 || 7));

      const adjacentHoliday = this._getHoliday(nextMon) || this._getHoliday(prevFri);
      if (adjacentHoliday) {
        const nextSchool = this._nextSchoolDay(today);
        const days = this._daysBetween(today, nextSchool) - 1;
        return {
          type: "ferien",
          status: adjacentHoliday,
          detail: "",
          countdown: days <= 1 ? "Noch ein Tag" : `Noch ${days} Tage`,
        };
      }

      const nextSchool = this._nextSchoolDay(today);
      const days = this._daysBetween(today, nextSchool) - 1;
      return {
        type: "wochenende",
        status: "Wochenende",
        detail: "",
        countdown: days <= 1 ? "Noch ein Tag" : `Noch ${days} Tage`,
      };
    }

    const nextFree = this._nextFreeDay(today);
    const days = this._daysBetween(today, nextFree.date);
    let countdown;
    if (days === 1) {
      countdown = `Morgen ${nextFree.label}`;
    } else {
      countdown = `Noch ${days} Tage bis ${nextFree.label}`;
    }

    return {
      type: "schultag",
      status: "Schultag",
      detail: "",
      countdown,
    };
  }

  _daysBetween(a, b) {
    return Math.round((b - a) / 86400000);
  }

  _dateFromStr(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  _isWeekend(d) {
    const dow = d.getDay();
    return dow === 0 || dow === 6;
  }

  _getHoliday(date) {
    for (const h of SCHOOL_HOLIDAYS) {
      const start = this._dateFromStr(h.start);
      const end = this._dateFromStr(h.end);
      if (date >= start && date <= end) return h.name;
    }
    return null;
  }

  _getPublicHoliday(date) {
    const key = this._toKey(date);
    for (const h of PUBLIC_HOLIDAYS) {
      if (h.date === key) return h.name;
    }
    return null;
  }

  _toKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  _isSchoolDay(date) {
    if (this._isWeekend(date)) return false;
    if (this._getHoliday(date)) return false;
    if (this._getPublicHoliday(date)) return false;
    return true;
  }

  _nextSchoolDay(from) {
    const d = new Date(from);
    for (let i = 0; i < 200; i++) {
      d.setDate(d.getDate() + 1);
      if (this._isSchoolDay(d)) return new Date(d);
    }
    return new Date(from);
  }

  _nextFreeDay(from) {
    const d = new Date(from);
    for (let i = 0; i < 200; i++) {
      d.setDate(d.getDate() + 1);

      const holiday = this._getHoliday(d);
      if (holiday) return { date: new Date(d), label: holiday };

      const pub = this._getPublicHoliday(d);
      if (pub) return { date: new Date(d), label: pub };

      if (this._isWeekend(d)) return { date: new Date(d), label: "Wochenende" };
    }
    return { date: new Date(from), label: "" };
  }

  setConfig(_config) {}

  static getStubConfig() {
    return {};
  }
}

customElements.define("school-day-card", SchoolDayCard);

window.customCards.push({
  type: "school-day-card",
  name: "School Day Card",
  description: "Zeigt Schultag/Ferien/Feiertag/Wochenende für NRW",
});


// ═══════════════════════════════════════════
// weather-card
// ═══════════════════════════════════════════

const WEATHER_TRANSLATIONS = {
  "clear-night": "Klare Nacht",
  "cloudy": "Bewölkt",
  "fog": "Nebel",
  "hail": "Hagel",
  "lightning": "Gewitter",
  "lightning-rainy": "Gewitter mit Regen",
  "partlycloudy": "Teilweise bewölkt",
  "pouring": "Starkregen",
  "rainy": "Regen",
  "snowy": "Schnee",
  "snowy-rainy": "Schneeregen",
  "sunny": "Sonnig",
  "windy": "Windig",
  "windy-variant": "Windig",
  "exceptional": "Außergewöhnlich",
};

const WEATHER_SVGS = {
  "sunny": `<svg viewBox="0 0 200 200" fill="none" stroke="#FF8C00" stroke-width="6" stroke-linecap="round">
    <circle cx="100" cy="100" r="32"/>
    <line x1="100" y1="48" x2="100" y2="30"/>
    <line x1="100" y1="152" x2="100" y2="170"/>
    <line x1="48" y1="100" x2="30" y2="100"/>
    <line x1="152" y1="100" x2="170" y2="100"/>
    <line x1="63" y1="63" x2="44" y2="44"/>
    <line x1="137" y1="137" x2="156" y2="156"/>
    <line x1="137" y1="63" x2="156" y2="44"/>
    <line x1="63" y1="137" x2="44" y2="156"/>
  </svg>`,
  "clear-night": `<svg viewBox="0 0 200 200" fill="none" stroke="#B0C4DE" stroke-width="6" stroke-linecap="round">
    <path d="M120 50 A50 50 0 1 0 150 120 A38 38 0 1 1 120 50"/>
  </svg>`,
  "cloudy": `<svg viewBox="0 0 200 200" fill="none" stroke="#A0A0A0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M55 130 A35 35 0 0 1 65 62 A40 40 0 0 1 140 60 A30 30 0 0 1 155 130 Z"/>
  </svg>`,
  "partlycloudy": `<svg viewBox="0 0 200 200" fill="none" stroke-width="6" stroke-linecap="round">
    <circle cx="80" cy="70" r="25" stroke="#FF8C00"/>
    <line x1="80" y1="35" x2="80" y2="18" stroke="#FF8C00"/>
    <line x1="80" y1="105" x2="80" y2="122" stroke="#FF8C00"/>
    <line x1="45" y1="70" x2="28" y2="70" stroke="#FF8C00"/>
    <line x1="115" y1="70" x2="132" y2="70" stroke="#FF8C00"/>
    <line x1="62" y1="52" x2="50" y2="40" stroke="#FF8C00"/>
    <line x1="98" y1="88" x2="110" y2="100" stroke="#FF8C00"/>
    <line x1="98" y1="52" x2="110" y2="40" stroke="#FF8C00"/>
    <line x1="62" y1="88" x2="50" y2="100" stroke="#FF8C00"/>
    <path d="M60 150 A30 30 0 0 1 68 90 A35 35 0 0 1 145 88 A25 25 0 0 1 155 150 Z" stroke="#A0A0A0"/>
  </svg>`,
  "rainy": `<svg viewBox="0 0 200 200" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 110 A30 30 0 0 1 60 52 A35 35 0 0 1 140 50 A25 25 0 0 1 155 110 Z" stroke="#A0A0A0"/>
    <line x1="75" y1="130" x2="65" y2="155" stroke="#4A8AE6"/>
    <line x1="105" y1="130" x2="95" y2="155" stroke="#4A8AE6"/>
    <line x1="135" y1="130" x2="125" y2="155" stroke="#4A8AE6"/>
  </svg>`,
  "pouring": `<svg viewBox="0 0 200 200" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 100 A30 30 0 0 1 60 42 A35 35 0 0 1 140 40 A25 25 0 0 1 155 100 Z" stroke="#A0A0A0"/>
    <line x1="65" y1="120" x2="55" y2="150" stroke="#4A8AE6"/>
    <line x1="90" y1="120" x2="80" y2="150" stroke="#4A8AE6"/>
    <line x1="115" y1="120" x2="105" y2="150" stroke="#4A8AE6"/>
    <line x1="140" y1="120" x2="130" y2="150" stroke="#4A8AE6"/>
    <line x1="75" y1="155" x2="65" y2="175" stroke="#4A8AE6"/>
    <line x1="105" y1="155" x2="95" y2="175" stroke="#4A8AE6"/>
  </svg>`,
  "snowy": `<svg viewBox="0 0 200 200" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 110 A30 30 0 0 1 60 52 A35 35 0 0 1 140 50 A25 25 0 0 1 155 110 Z" stroke="#A0A0A0"/>
    <circle cx="75" cy="140" r="4" stroke="#B0C4DE"/>
    <circle cx="105" cy="145" r="4" stroke="#B0C4DE"/>
    <circle cx="135" cy="138" r="4" stroke="#B0C4DE"/>
    <circle cx="90" cy="162" r="4" stroke="#B0C4DE"/>
    <circle cx="120" cy="165" r="4" stroke="#B0C4DE"/>
  </svg>`,
  "lightning": `<svg viewBox="0 0 200 200" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 100 A30 30 0 0 1 60 42 A35 35 0 0 1 140 40 A25 25 0 0 1 155 100 Z" stroke="#A0A0A0"/>
    <polyline points="105,110 95,140 115,140 100,175" stroke="#FFD700"/>
  </svg>`,
  "lightning-rainy": `<svg viewBox="0 0 200 200" fill="none" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <path d="M50 100 A30 30 0 0 1 60 42 A35 35 0 0 1 140 40 A25 25 0 0 1 155 100 Z" stroke="#A0A0A0"/>
    <polyline points="105,110 95,140 115,140 100,175" stroke="#FFD700"/>
    <line x1="65" y1="120" x2="55" y2="145" stroke="#4A8AE6"/>
    <line x1="145" y1="120" x2="135" y2="145" stroke="#4A8AE6"/>
  </svg>`,
  "fog": `<svg viewBox="0 0 200 200" fill="none" stroke="#A0A0A0" stroke-width="6" stroke-linecap="round">
    <line x1="40" y1="80" x2="160" y2="80"/>
    <line x1="50" y1="100" x2="150" y2="100"/>
    <line x1="40" y1="120" x2="160" y2="120"/>
    <line x1="60" y1="140" x2="140" y2="140"/>
  </svg>`,
  "windy": `<svg viewBox="0 0 200 200" fill="none" stroke="#A0A0A0" stroke-width="6" stroke-linecap="round">
    <path d="M40 80 Q100 80 120 60 A15 15 0 0 1 130 88 L40 88"/>
    <path d="M40 110 Q120 110 150 90 A15 15 0 0 1 155 118 L40 118"/>
    <path d="M60 140 Q110 140 125 125 A12 12 0 0 1 130 148 L60 148"/>
  </svg>`,
};

class WeatherCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
  }

  setConfig(config) {
    this._config = config;
    if (!config.entity) {
      throw new Error("Please define a weather entity");
    }
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          justify-content: center;
          padding: 8px 20px 8px 0;
          background: var(--card-background-color, var(--primary-background-color, #111));
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
          position: relative;
        }

        .bg {
          position: absolute;
          top: 0;
          left: 10px;
          bottom: 0;
          display: flex;
          align-items: center;
          opacity: 0.25;
          pointer-events: none;
        }

        .bg svg {
          height: 200px;
          width: 200px;
        }

        .temp {
          font-size: 80px;
          font-weight: 100;
          color: var(--primary-text-color, #e1e1e1);
          position: relative;
          z-index: 1;
          line-height: 1;
        }

        .condition {
          font-size: 28px;
          font-weight: 300;
          color: var(--secondary-text-color, #888);
          margin-top: 4px;
          position: relative;
          z-index: 1;
        }

        .forecast {
          font-size: 22px;
          font-weight: 400;
          letter-spacing: 2px;
          color: var(--disabled-text-color, #555);
          margin-top: 12px;
          text-transform: uppercase;
          position: relative;
          z-index: 1;
        }

        .rain-alert {
          font-size: 20px;
          font-weight: 400;
          color: var(--secondary-text-color, #888);
          margin-top: 8px;
          position: relative;
          z-index: 1;
        }
      </style>

      <ha-card>
        <div class="bg"></div>
        <div class="temp">--°</div>
        <div class="condition"></div>
        <div class="forecast"></div>
        <div class="rain-alert"></div>
      </ha-card>
    `;

    if (this._hass) this._update();
  }

  _update() {
    if (!this.shadowRoot?.querySelector(".temp") || !this._hass || !this._config.entity) return;

    const entity = this._hass.states[this._config.entity];
    if (!entity) return;

    const state = entity.state;
    const attrs = entity.attributes;
    const temp = Math.round(attrs.temperature || 0);
    const condition = WEATHER_TRANSLATIONS[state] || state;

    this.shadowRoot.querySelector(".temp").textContent = `${temp}°`;
    this.shadowRoot.querySelector(".condition").textContent = condition;

    const svgKey = state === "windy-variant" ? "windy" : (state === "snowy-rainy" ? "snowy" : state);
    this.shadowRoot.querySelector(".bg").innerHTML = WEATHER_SVGS[svgKey] || WEATHER_SVGS["cloudy"];

    // Tagesvorhersage
    if (attrs.forecast && attrs.forecast.length > 0) {
      const today = attrs.forecast[0];
      const low = Math.round(today.templow || today.temperature || 0);
      const high = Math.round(today.temperature || 0);
      this.shadowRoot.querySelector(".forecast").textContent = `${low}° / ${high}°`;
    } else if (!this._forecastLoaded) {
      this._loadForecast();
    }
  }

  async _loadForecast() {
    this._forecastLoaded = true;
    try {
      const msg = {
        type: "weather/subscribe_forecast",
        forecast_type: "daily",
        entity_id: this._config.entity,
      };
      this._hass.connection.subscribeMessage(
        (result) => {
          if (result?.forecast && result.forecast.length > 0) {
            const today = result.forecast[0];
            const low = Math.round(today.templow ?? today.temperature ?? 0);
            const high = Math.round(today.temperature ?? 0);
            const el = this.shadowRoot?.querySelector(".forecast");
            if (el) el.textContent = `${low}° / ${high}°`;
          }
        },
        msg,
      );
    } catch (e) {
      // forecast not available
    }

    // Stündliche Vorhersage für Regen-Warnung
    try {
      this._hass.connection.subscribeMessage(
        (result) => {
          const el = this.shadowRoot?.querySelector(".rain-alert");
          if (!el || !result?.forecast) return;

          const now = new Date();
          const endOfDay = new Date(now);
          endOfDay.setHours(23, 59, 59, 999);

          const RAIN_CONDITIONS = ["rainy", "pouring", "lightning-rainy", "lightning", "hail", "snowy", "snowy-rainy"];

          const rainHour = result.forecast.find((h) => {
            const t = new Date(h.datetime);
            return t >= now && t <= endOfDay && RAIN_CONDITIONS.includes(h.condition);
          });

          if (rainHour) {
            const t = new Date(rainHour.datetime);
            const hour = t.getHours();
            const cond = WEATHER_TRANSLATIONS[rainHour.condition] || rainHour.condition;
            el.textContent = `${cond} ab ${hour} Uhr`;
          } else {
            el.textContent = "";
          }
        },
        {
          type: "weather/subscribe_forecast",
          forecast_type: "hourly",
          entity_id: this._config.entity,
        },
      );
    } catch (e) {
      // hourly forecast not available
    }
  }

  static getStubConfig() {
    return { entity: "weather.forecast_home" };
  }
}

customElements.define("weather-card", WeatherCard);

window.customCards.push({
  type: "weather-card",
  name: "Weather Card",
  description: "Aktuelles Wetter und Tagesvorhersage",
});


// ═══════════════════════════════════════════
// pollen-card
// ═══════════════════════════════════════════

const POLLEN_LEVELS = {
  "0": "Keine",
  "0.5": "Keine bis gering",
  "1": "Gering",
  "1.5": "Gering bis mittel",
  "2": "Mittel",
  "2.5": "Mittel bis hoch",
  "3": "Hoch",
};

const POLLEN_COLORS = {
  "0": "#2ECC71",
  "0.5": "#6B9BD2",
  "1": "#4FC1A6",
  "1.5": "#B8CC3C",
  "2": "#F2A63B",
  "2.5": "#E8723A",
  "3": "#E04040",
};

class PollenCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
  }

  setConfig(config) {
    this._config = config;
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 32px;
          padding: 16px 20px;
          background: var(--card-background-color, var(--primary-background-color, #111));
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
        }

        .item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .icon svg {
          width: 80px;
          height: 80px;
        }

        .label {
          font-size: 20px;
          font-weight: 400;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--disabled-text-color, #555);
        }

        .level {
          font-size: 22px;
          font-weight: 300;
        }
      </style>

      <ha-card>
        <div class="item">
          <div class="icon" id="trees-icon"></div>
          <span class="label">Bäume</span>
          <span class="level" id="trees-level">--</span>
        </div>
        <div class="item">
          <div class="icon" id="grass-icon"></div>
          <span class="label">Gräser</span>
          <span class="level" id="grass-level">--</span>
        </div>
      </ha-card>
    `;

    if (this._hass) this._update();
  }

  _update() {
    if (!this.shadowRoot?.querySelector("#trees-level") || !this._hass) return;

    const cfg = this._config;
    const trees = cfg.trees || [
      "sensor.pollenflug_birke_41",
      "sensor.pollenflug_erle_41",
      "sensor.pollenflug_esche_41",
      "sensor.pollenflug_hasel_41",
    ];
    const grass = cfg.grass || "sensor.pollenflug_graeser_41";

    // Höchster Wert der Bäume
    let maxTree = 0;
    for (const id of trees) {
      const e = this._hass.states[id];
      if (e) {
        const v = parseFloat(e.state);
        if (!isNaN(v) && v > maxTree) maxTree = v;
      }
    }

    const grassEntity = this._hass.states[grass];
    const grassVal = grassEntity ? parseFloat(grassEntity.state) : 0;

    this._renderLevel("trees", maxTree);
    this._renderLevel("grass", isNaN(grassVal) ? 0 : grassVal);
  }

  _renderLevel(id, value) {
    const key = String(value);
    const label = POLLEN_LEVELS[key] || POLLEN_LEVELS[String(Math.round(value))] || "Unbekannt";
    const color = POLLEN_COLORS[key] || POLLEN_COLORS[String(Math.round(value))] || "#555";

    const levelEl = this.shadowRoot.querySelector(`#${id}-level`);
    const iconEl = this.shadowRoot.querySelector(`#${id}-icon`);

    if (levelEl) {
      levelEl.textContent = label;
      levelEl.style.color = color;
    }
    if (iconEl) {
      iconEl.innerHTML = id === "trees" ? this._treeSvg(color) : this._grassSvg(color);
    }
  }

  _treeSvg(color) {
    return `<svg viewBox="0 0 100 100" fill="${color}" stroke="none">
      <ellipse cx="50" cy="35" rx="30" ry="28" opacity="0.8"/>
      <ellipse cx="35" cy="45" rx="20" ry="18" opacity="0.6"/>
      <ellipse cx="65" cy="45" rx="20" ry="18" opacity="0.6"/>
      <rect x="46" y="60" width="8" height="30" rx="2" opacity="0.5"/>
    </svg>`;
  }

  _grassSvg(color) {
    return `<svg viewBox="0 0 100 100" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round">
      <path d="M20 95 Q22 60 35 40" opacity="0.7"/>
      <path d="M35 95 Q34 55 28 30" opacity="0.8"/>
      <path d="M50 95 Q50 50 50 20" opacity="0.9"/>
      <path d="M65 95 Q66 55 72 30" opacity="0.8"/>
      <path d="M80 95 Q78 60 65 40" opacity="0.7"/>
      <circle cx="28" cy="28" r="4" fill="${color}" opacity="0.6"/>
      <circle cx="50" cy="18" r="4" fill="${color}" opacity="0.6"/>
      <circle cx="72" cy="28" r="4" fill="${color}" opacity="0.6"/>
    </svg>`;
  }

  static getStubConfig() {
    return {
      trees: [
        "sensor.pollenflug_birke_41",
        "sensor.pollenflug_erle_41",
        "sensor.pollenflug_esche_41",
        "sensor.pollenflug_hasel_41",
      ],
      grass: "sensor.pollenflug_graeser_41",
    };
  }
}

customElements.define("pollen-card", PollenCard);

window.customCards.push({
  type: "pollen-card",
  name: "Pollen Card",
  description: "Pollenbelastung Bäume und Gräser",
});


// ═══════════════════════════════════════════
// tram-card
// ═══════════════════════════════════════════

class TramCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = {};
    this._timer = null;
  }

  setConfig(config) {
    if (!config.entity) throw new Error("Please define a sensor entity");
    this._config = {
      entity: config.entity,
      lines: config.lines || ["707", "705"],
      platform: config.platform || "1",
      max: config.max || 2,
      stop: config.stop || "Johannstraße",
    };
  }

  set hass(hass) {
    this._hass = hass;
    this._update();
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        ha-card {
          display: flex;
          flex-direction: row;
          align-items: center;
          padding: 16px 20px;
          gap: 20px;
          background: var(--card-background-color, var(--primary-background-color, #111));
          font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
          overflow: hidden;
          user-select: none;
          -webkit-user-select: none;
        }

        .tram-icon svg {
          width: 80px;
          height: 80px;
          opacity: 0.5;
        }

        .departures {
          display: flex;
          flex-direction: column;
          flex: 1;
          gap: 8px;
        }

        .departure {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          gap: 12px;
        }

        .line {
          font-size: 24px;
          font-weight: 400;
          color: var(--secondary-text-color, #888);
          min-width: 50px;
        }

        .dest {
          font-size: 20px;
          font-weight: 300;
          color: var(--disabled-text-color, #555);
          flex: 1;
        }

        .minutes {
          font-size: 36px;
          font-weight: 200;
          white-space: nowrap;
        }

        .minutes.on-time {
          color: #2ECC71;
        }

        .minutes.delayed {
          color: #E04040;
        }

        .minutes .unit {
          font-size: 20px;
          font-weight: 300;
          opacity: 0.7;
        }

        .empty {
          font-size: 22px;
          font-weight: 300;
          color: var(--disabled-text-color, #555);
        }

      </style>

      <ha-card>
        <div class="tram-icon">${this._tramSvg()}</div>
        <div class="departures" id="deps"></div>
      </ha-card>
    `;

    if (this._hass) this._update();
    this._timer = setInterval(() => this._update(), 30000);
  }

  disconnectedCallback() {
    if (this._timer) clearInterval(this._timer);
  }

  _update() {
    if (!this.shadowRoot?.querySelector("#deps") || !this._hass || !this._config.entity) return;

    const entity = this._hass.states[this._config.entity];
    if (!entity || !entity.attributes.next_departures) return;

    const now = Date.now();
    const maxMins = this._config.maxMinutes || 30;
    const perLine = this._config.max || 2;

    // Immer selbst berechnen, countdown ist nur ein Snapshot vom letzten Update
    const parseDep = (d) => {
      const line = d.line || (d.train ? d.train.replace(/^Tra\s*/, "") : "");
      const depTime = (d.rt_datetime || d.departure_timestamp || d.datetime) * 1000 || new Date(d.time).getTime();
      const mins = Math.max(0, Math.round((depTime - now) / 60000));
      const delay = parseInt(d.delay) || 0;
      return { line, mins, delay };
    };

    const filtered = entity.attributes.next_departures.filter((d) => {
      const line = d.line || (d.train ? d.train.replace(/^Tra\s*/, "") : "");
      const lineMatch = this._config.lines.some((l) => line.includes(l));
      const platMatch = !this._config.platform || d.platform === this._config.platform;
      const notCancelled = !d.is_cancelled && d.is_cancelled !== 1;
      return lineMatch && platMatch && notCancelled;
    });

    const allDeps = filtered.map(parseDep).filter((d) => d.mins > 0 && d.mins <= maxMins);
    const allDepsNoLimit = filtered.map(parseDep).filter((d) => d.mins > 0);

    const deps = [];
    for (const l of this._config.lines) {
      let lineDeps = allDeps.filter((d) => d.line.includes(l)).slice(0, perLine);
      if (lineDeps.length === 0) {
        lineDeps = allDepsNoLimit.filter((d) => d.line.includes(l)).slice(0, perLine);
      }
      deps.push(...lineDeps);
    }
    deps.sort((a, b) => a.mins - b.mins);

    const container = this.shadowRoot.querySelector("#deps");
    if (deps.length === 0) {
      container.innerHTML = `<div class="empty">Keine Abfahrten</div>`;
      return;
    }

    container.innerHTML = deps
      .map((d) => {
        const cls = d.delay > 0 ? "delayed" : "on-time";
        return `
          <div class="departure">
            <span class="line">${d.line}</span>
            <span class="minutes ${cls}">${d.mins} <span class="unit">min</span></span>
          </div>
        `;
      })
      .join("");
  }

  _tramSvg() {
    return `<svg viewBox="0 0 100 100" fill="none" stroke="var(--secondary-text-color, #888)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
      <rect x="25" y="20" width="50" height="60" rx="8"/>
      <rect x="32" y="28" width="36" height="22" rx="3"/>
      <circle cx="37" cy="68" r="5"/>
      <circle cx="63" cy="68" r="5"/>
      <line x1="50" y1="20" x2="50" y2="8"/>
      <line x1="35" y1="8" x2="65" y2="8"/>
      <line x1="30" y1="80" x2="22" y2="92"/>
      <line x1="70" y1="80" x2="78" y2="92"/>
    </svg>`;
  }

  static getStubConfig() {
    return {
      entity: "sensor.118208_departures",
      lines: ["707", "705"],
      platform: "1",
      max: 2,
    };
  }
}

customElements.define("tram-card", TramCard);

window.customCards.push({
  type: "tram-card",
  name: "Tram Card",
  description: "Nächste Straßenbahn-Abfahrten",
});
