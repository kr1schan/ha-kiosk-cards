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
