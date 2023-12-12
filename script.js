const countdownForm = document.getElementById('countdownForm');
const inputContainer = document.getElementById('input-container');
const dateEl = document.getElementById('date-picker');

const countdownEl = document.getElementById('countdown');
const countdownElTitle = document.getElementById('countdown-title');
const countdownBtn = document.getElementById('countdown-button');
const timeElements = document.querySelectorAll('span'); 

const completeEl = document.getElementById('complete');
const completeElInfo = document.getElementById('complete-info');
const completeBtn = document.getElementById('complete-button');

let countdownTitle = '';
let countdownDate = '';
let countdownValue = new Date();
let countdownActive;
let savedCountDown; 

const second = 1000; // 1s = 1000 milliseconds 
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

// Set date input min with today's date / yyyy-mm-dd format
const today = new Date().toISOString().split('T')[0];
dateEl.setAttribute('min', today);

// Populate countdown / complete UI
function updateDOM() {
  countdownActive = setInterval(() => {
    const now = new Date().getTime(); // current moment in milliseconds
    const distance = countdownValue - now; 
    const days = Math.floor(distance / day);
    const hours = Math.floor((distance % day) / hour);
    const minutes = Math.floor((distance % hour) / minute);
    const seconds = Math.floor((distance % minute) / second);
   
    // Hide Input 
    inputContainer.hidden = true;

    // if countdown has ended, show complete 
    if(distance < 0){
      countdownEl.hidden = true;
      clearInterval(countdownActive);
      completeElInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
      completeEl.hidden = false;
    }else {
      // populating & show countdown in progress
      countdownElTitle.textContent = `${countdownTitle}`;
      timeElements[0].textContent = `${days}`;
      timeElements[1].textContent = `${hours}`;
      timeElements[2].textContent = `${minutes}`;
      timeElements[3].textContent = `${seconds}`;
      completeEl.hidden = true;
      countdownEl.hidden = false;
    }
  }, second);
}

// Take values from form input
function updateCountdown(event) {
  event.preventDefault();
  countdownTitle = event.srcElement[0].value;
  countdownDate = event.srcElement[1].value;
  savedCountDown = {
    title: countdownTitle,
    date: countdownDate,
  };

  localStorage.setItem('countdownDate', savedCountDown)
  localStorage.setItem('countdown', JSON.stringify(savedCountDown));
  
  // Check for valid date, update DOM accordingly
  if(countdownDate === ''){
    alert('Please, select a date for a countdown');
  }else{
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}

// Reset all values 
function reset() {
  // Hide countdown and show input 
  countdownEl.hidden = true;
  completeEl.hidden = true;
  inputContainer.hidden = false;
  // stop countdown 
  clearInterval(countdownActive);
  // reset values 
  countdownTitle = '';
  countdownDate = '';
  localStorage.removeItem('countdown');
}

function restorePreviousCountdown() {
  // Get countdown from localStorage if available
  if(localStorage.getItem('countdown')){
    inputContainer.hidden = true;
    savedcountDown = JSON.parse(localStorage.getItem('countdown'));
    countdownTitle = savedcountDown.title;
    countdownDate = savedcountDown.date;
    countdownValue = new Date(countdownDate).getTime();
    updateDOM();
  }
}
// Event listeners
countdownForm.addEventListener('submit', updateCountdown);
countdownBtn.addEventListener('click', reset);
completeBtn.addEventListener('click', reset);

// on Load, check localStorage
restorePreviousCountdown();