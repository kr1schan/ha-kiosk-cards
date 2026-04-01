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
