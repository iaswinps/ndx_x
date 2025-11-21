/* --- GLOBAL SETTINGS --- */
// Default Total Working Days if nothing is saved
const DEFAULT_TOTAL_DAYS = 50; 

// Default Student List (Roll 1-13)
const defaultStudents = [
    { roll: 1, name: "Aswin", present: 6 },
    { roll: 2, name: "Anas", present: 32 },
    { roll: 3, name: "Adithyan", present: 3 },
    { roll: 4, name: "Abhishek", present: 4 },
    { roll: 5, name: "Nihad", present: 0 },
    { roll: 6, name: "Shameem", present: 0 },
    { roll: 7, name: "Faiz", present: 0 },
    { roll: 8, name: "Sandeep", present: 0 },
    { roll: 9, name: "Sahada", present: 4 },
    { roll: 10, name: "Niya", present: 4 },
    { roll: 11, name: "Anjana", present: 3 },
    { roll: 12, name: "Meera", present: 3 },
    { roll: 13, name: "Srinisha", present: 3 }
];

/* --- NAVIGATION --- */
function goHome() { window.location.href = "index.html"; }
function openSyllabus() { window.location.href = "syllabus.html"; }
function openNotes() { window.location.href = "notes.html"; }
function openTimeTable() { window.location.href = "timetable.html"; }
function openAttendance() { window.location.href = "attendance.html"; }
function openUpdate() { window.location.href = "update.html"; }

/* --- DATA MANAGEMENT (LOCAL STORAGE) --- */
function initData() {
    // Check if data exists in browser memory
    if (!localStorage.getItem('classData')) {
        const initialData = {
            totalDays: DEFAULT_TOTAL_DAYS,
            students: defaultStudents
        };
        localStorage.setItem('classData', JSON.stringify(initialData));
    }
}

function getData() {
    initData();
    return JSON.parse(localStorage.getItem('classData'));
}

function saveData(data) {
    localStorage.setItem('classData', JSON.stringify(data));
}

/* --- ADMIN PANEL LOGIC (update.html) --- */
function renderAdminPanel() {
    const data = getData();
    const container = document.getElementById("admin-list");
    const totalDisplay = document.getElementById("totalDaysDisplay");
    
    if (!container) return;

    // Update Total Days Number
    totalDisplay.innerText = data.totalDays;

    container.innerHTML = "";

    data.students.forEach((student, index) => {
        let card = `
            <div class="student-card" style="flex-direction: column; align-items: flex-start;">
                <div class="student-header" style="width: 100%;">
                    <span class="student-name">${student.name}</span>
                    <span class="student-roll" style="background: rgba(255,255,255,0.1); color: white;">Present: ${student.present}</span>
                </div>
                
                <div style="display: flex; gap: 5px; width: 100%; justify-content: space-between;">
                    <div style="display: flex; gap: 5px;">
                        <button onclick="updateStudent(${index}, -1)" class="mini-btn red">-1</button>
                        <button onclick="updateStudent(${index}, -0.5)" class="mini-btn red">-0.5</button>
                    </div>
                    <div style="display: flex; gap: 5px;">
                        <button onclick="updateStudent(${index}, 0.5)" class="mini-btn green">+0.5</button>
                        <button onclick="updateStudent(${index}, 1)" class="mini-btn green">+1</button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

function changeTotalDays(amount) {
    const data = getData();
    data.totalDays += amount;
    if (data.totalDays < 1) data.totalDays = 1; // Prevent 0 or negative
    saveData(data);
    renderAdminPanel(); // Refresh screen
}

function updateStudent(index, amount) {
    const data = getData();
    data.students[index].present += amount;
    if (data.students[index].present < 0) data.students[index].present = 0;
    saveData(data);
    renderAdminPanel(); // Refresh screen
}

/* --- ATTENDANCE PAGE LOGIC (attendance.html) --- */
function loadAttendance() {
    const container = document.getElementById("attendance-wrapper");
    if (!container) return;

    const data = getData();
    const totalDays = data.totalDays;

    // Update Header info
    document.querySelector('h1').innerHTML = `ATTENDANCE <span style="font-size: 1rem; display:block; color: #aaa;">(Total Days: ${totalDays})</span>`;

    container.innerHTML = "";

    data.students.forEach(student => {
        // Calculate Numbers
        let leaves = totalDays - student.present;
        let percent = ((student.present / totalDays) * 100).toFixed(1); // 1 decimal place

        // Color Logic
        let attendColor = percent >= 75 ? "fill-attend" : "fill-attend low";
        
        // Leaves bar width (Max 20 for scale)
        let leavesWidth = (leaves / 20) * 100; 
        if (leavesWidth > 100) leavesWidth = 100;

        let card = `
            <div class="student-card">
                <div class="student-header">
                    <span class="student-name">${student.name}</span>
                    <span class="student-roll">Roll: ${student.roll}</span>
                </div>

                <div class="bar-group">
                    <div class="bar-label">
                        <span>Leaves Taken</span>
                        <span>${leaves} Days</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill fill-leaves" style="width: ${leavesWidth}%"></div>
                    </div>
                </div>

                <div class="bar-group">
                    <div class="bar-label">
                        <span>Attendance (${student.present}/${totalDays})</span>
                        <span>${percent}%</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill ${attendColor}" style="width: ${percent}%"></div>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += card;
    });
}

/* --- DOWNLOAD FUNCTIONS --- */
function triggerDownload(path, filename) {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
function downloadcl() { triggerDownload("syllabus/BCAS4CyberLawsSyllabus.pdf", "CyberLaws_Syllabus.pdf"); }
function downloaddbms() { triggerDownload("syllabus/BCAS4DataBaseManagementSystem.pdf", "DBMS_Syllabus.pdf"); }
function downloadse() { triggerDownload("syllabus/BCAS4SoftwareEngineeringSyllabus.pdf", "SoftwareEng_Syllabus.pdf"); }
function downloadNotesSE() { triggerDownload("notes/se_notes.pdf", "SE_Notes.pdf"); }
function downloadNotesDBMS() { triggerDownload("notes/dbms_notes.pdf", "DBMS_Notes.pdf"); }
function downloadNotesCL() { triggerDownload("notes/cl_notes.pdf", "CL_Notes.pdf"); }