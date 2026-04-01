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
