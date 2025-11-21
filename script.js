function goHome() { window.location.href = "index.html"; }
function openSyllabus() { window.location.href = "syllabus.html"; }
function openNotes() { window.location.href = "notes.html"; }
function openTimeTable() { window.location.href = "timetable.html"; }
function openAttendance() { window.location.href = "attendance.html"; }

let myTotal = 0;
let myPresent = 0;

function initPersonalData() {
    const savedTotal = localStorage.getItem('myTotalDays');
    const savedPresent = localStorage.getItem('myPresentDays');

    if (savedTotal) myTotal = parseFloat(savedTotal);
    if (savedPresent) myPresent = parseFloat(savedPresent);

    updateUI();
}

function updateTotal(amount) {
    myTotal += amount;
    if (myTotal < 0) myTotal = 0;
    saveAndRender();
}

function updatePresent(amount) {
    myPresent += amount;
    if (myPresent < 0) myPresent = 0;
    if (myPresent > myTotal) myPresent = myTotal;
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('myTotalDays', myTotal);
    localStorage.setItem('myPresentDays', myPresent);
    updateUI();
}

function updateUI() {
    document.getElementById('displayTotal').innerText = myTotal;
    document.getElementById('displayPresent').innerText = myPresent;

    let leaves = myTotal - myPresent;
    let percent = myTotal > 0 ? ((myPresent / myTotal) * 100).toFixed(1) : 0;

    document.getElementById('leavesText').innerText = leaves + " Days";
    document.getElementById('percentText').innerText = percent + "%";

    let leavesWidth = (leaves / 20) * 100;
    if (leavesWidth > 100) leavesWidth = 100;

    document.getElementById('leavesBar').style.width = leavesWidth + "%";
    document.getElementById('percentBar').style.width = percent + "%";

    const percentBar = document.getElementById('percentBar');
    const statusMsg = document.getElementById('statusMessage');

    if (myTotal === 0) {
        statusMsg.innerText = "Start adding days.";
        statusMsg.style.color = "#aaa";
    } else if (percent >= 75) {
        percentBar.className = "progress-fill fill-attend";
        statusMsg.innerText = "Safe Zone! 🔥 ";
        statusMsg.style.color = "#38ef7d";
    } else {
        percentBar.className = "progress-fill fill-attend low";
        statusMsg.innerText = "Below 75% ⚠️ Korav aanallo";
        statusMsg.style.color = "#f59e0b";
    }
}

let currentFilePath = "";
let currentFileName = "";

function openOptions(path, name) {
    currentFilePath = path;
    currentFileName = name;
    const modal = document.getElementById('optionModal');
    if(modal) {
        modal.style.display = 'flex';
        if(document.getElementById('selectedSubjectText')) {
            document.getElementById('selectedSubjectText').innerText = name.replace('.pdf', '').replace(/_/g, ' ');
        }
    }
}

function closeOptions() {
    const modal = document.getElementById('optionModal');
    if(modal) modal.style.display = 'none';
}

function viewCurrentFile() {
    if(currentFilePath) {
        window.open(currentFilePath, '_blank');
        closeOptions();
    }
}

function downloadCurrentFile() {
    if(currentFilePath) {
        triggerDownload(currentFilePath, currentFileName);
        closeOptions();
    }
}

function triggerDownload(path, filename) {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function checkTimeTable() {
    const now = new Date();
    const day = now.getDay(); 
    const currentMinutes = (now.getHours() * 60) + now.getMinutes();
    
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    
    const clockEl = document.getElementById('digitalClock');
    const dayTextEl = document.getElementById('currentDayText');
    
    if(clockEl) clockEl.innerText = timeString;
    if(dayTextEl) dayTextEl.innerText = dayNames[day];

    document.querySelectorAll('.active-pulse').forEach(el => el.classList.remove('active-pulse'));
    document.querySelectorAll('.active-day-row').forEach(el => el.classList.remove('active-day-row'));

    if (day === 0 || day === 6) {
        updateStatus("Weekend", "free");
        return;
    }

    const dayRow = document.getElementById(`row-${day}`);
    if (dayRow) dayRow.classList.add('active-day-row');

    let period = 0;
    let statusText = "Free Time";
    let statusType = "free"; 

    if (day >= 1 && day <= 4) {
        if (currentMinutes >= 570 && currentMinutes < 630) period = 1;       
        else if (currentMinutes >= 630 && currentMinutes < 685) period = 2;  
        else if (currentMinutes >= 685 && currentMinutes < 695) { statusText = "Interval"; statusType = "break"; }
        else if (currentMinutes >= 695 && currentMinutes < 750) period = 3;  
        else if (currentMinutes >= 750 && currentMinutes < 810) { statusText = "Lunch Break"; statusType = "break"; } 
        else if (currentMinutes >= 810 && currentMinutes < 860) period = 4;  
        else if (currentMinutes >= 860 && currentMinutes < 910) period = 5;  
        else if (currentMinutes >= 910) { statusText = "Classes Over"; statusType = "free"; }
    }
    else if (day === 5) {
        if (currentMinutes >= 570 && currentMinutes < 630) period = 1;       
        else if (currentMinutes >= 630 && currentMinutes < 685) period = 2;  
        else if (currentMinutes >= 685 && currentMinutes < 695) { statusText = "Interval"; statusType = "break"; }
        else if (currentMinutes >= 695 && currentMinutes < 750) period = 3;  
        else if (currentMinutes >= 750 && currentMinutes < 840) { statusText = "Friday Lunch"; statusType = "break"; } 
        else if (currentMinutes >= 840 && currentMinutes < 875) period = 4;  
        else if (currentMinutes >= 875 && currentMinutes < 910) period = 5;  
        else if (currentMinutes >= 910) { statusText = "Classes Over"; statusType = "free"; }
    }

    if (period > 0) {
        const cellId = `d${day}-h${period}`;
        const cell = document.getElementById(cellId);
        if (cell) {
            cell.classList.add('active-pulse');
            statusText = cell.innerText + " (Ongoing)";
            statusType = "active";
        }
    }

    updateStatus(statusText, statusType);
}

function updateStatus(text, type) {
    const statusEl = document.getElementById('currentStatus');
    if (!statusEl) return;
    
    statusEl.innerText = text;
    
    statusEl.classList.remove('status-active', 'status-break', 'status-free');
    
    if (type === 'active') statusEl.classList.add('status-active');
    if (type === 'break') statusEl.classList.add('status-break');
    if (type === 'free') statusEl.classList.add('status-free');
}