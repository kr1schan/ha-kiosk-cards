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
