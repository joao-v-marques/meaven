/* ========================================
   MEAVEN - PÁGINA INICIAL
   Greeting with the logged-in user (window.MeavenSession, from sidebar.js)
   and the savings demo in the hero.
======================================== */

const SAVINGS_DEMO = {
    months: 12,
    monthlyRate: 0.008,
    // Highest slider value fills the chart, so bars grow as the amount grows
    maxMonthly: 1000,
};

const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
});

const greeting = document.getElementById("home-greeting");
const monthlyInput = document.getElementById("monthly-saving");
const monthlyValue = document.getElementById("monthly-saving-value");
const savedTotal = document.getElementById("saved-total");
const investedTotal = document.getElementById("invested-total");
const bars = document.querySelectorAll(".savings-bar");

greetCurrentUser();

monthlyInput.addEventListener("input", updateSavingsDemo);

// First paint starts with short bars; the next frame grows them once (the page's only entrance motion)
requestAnimationFrame(() => requestAnimationFrame(updateSavingsDemo));

// ========================================
// SAUDAÇÃO
// ========================================

async function greetCurrentUser() {
    const session = window.MeavenSession;
    const user = session ? await session.currentUser : null;

    if (!user || !user.name) {
        return;
    }

    const firstName = user.name.trim().split(/\s+/)[0];
    greeting.textContent = `Olá, ${firstName}!`;
}

// ========================================
// MINI SIMULAÇÃO
// ========================================

function updateSavingsDemo() {
    const monthly = Number(monthlyInput.value);
    const chartMax = balanceAfter(SAVINGS_DEMO.maxMonthly, SAVINGS_DEMO.months);

    monthlyValue.textContent = currency.format(monthly);
    savedTotal.textContent = currency.format(monthly * SAVINGS_DEMO.months);
    investedTotal.textContent = currency.format(balanceAfter(monthly, SAVINGS_DEMO.months));

    bars.forEach((bar, index) => {
        const fill = balanceAfter(monthly, index + 1) / chartMax;
        bar.style.setProperty("--fill", fill.toFixed(4));
    });
}

// Balance after depositing `monthly` at the end of each month for `months` months
function balanceAfter(monthly, months) {
    const rate = SAVINGS_DEMO.monthlyRate;
    return monthly * ((1 + rate) ** months - 1) / rate;
}
