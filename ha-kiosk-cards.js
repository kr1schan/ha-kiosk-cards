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

        .tram-icon img {
          width: 120px;
          height: 120px;
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
    return `<img src="data:image/png;base64,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" />`;
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
