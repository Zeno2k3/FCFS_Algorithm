const tasks = [];
const MAX_PROCESSES = 100;
class Process {
    constructor(pid, arrivalTime, burstTime) {
        this.pid = pid;
        this.arrivalTime = arrivalTime;
        this.burstTime = burstTime;
        this.remainingTime = burstTime;
        this.waitingTime = 0;
        this.turnaroundTime = 0;
    }
}
// Thêm 1 Tiến Trình
function addTask() {
    const taskId = document.getElementById("taskID").value;
    const arrivalTime = parseInt(document.getElementById("arrivalTime").value);
    const burstTime = parseInt(document.getElementById("burstTime").value);

    // Kiểm tra nếu có trùng taskId
    if (tasks.some(task => task.pid === taskId)) {
        alert('Tiến trình đã tồn tại. Vui lòng chọn ID khác.');
        return;
    }

    // Kiểm tra số âm
    if (taskId && !isNaN(arrivalTime) && arrivalTime >= 0 && !isNaN(burstTime) && burstTime >= 0) {
        const newTask = new Process(taskId, arrivalTime, burstTime);
        tasks.push(newTask);
        updateTaskTable();
        clearInputs();
    } else {
        alert('Vui lòng nhập đầy đủ và chính xác thông tin tiến trình.');
    }
}
// Xóa 1 Tiến Trình
function popTask() {
    if (tasks.length === 0) {
        alert("Chưa Có Tiến Trình! Vui Lòng Nhập Tiến Trình...");
        return;
    }
    const textName = prompt('Nhập ID Tiến Trình Bạn Muốn Xóa:');
    const taskIndex = tasks.findIndex(task => task.pid === textName);
    
    if (taskIndex === -1) {
        alert('Tiến trình không tồn tại. Vui lòng chọn ID khác.');
    } else {
        tasks.splice(taskIndex, 1);
        updateTaskTable();
    }
}

// Cập nhật Lại danh sách 
function updateTaskTable() {
    const taskTable = document.getElementById('taskTable');
    taskTable.innerHTML = `
        <tr>
            <th>ID Tiến Trình</th>
            <th>Thời Gian Đến</th>
            <th>Thời Gian Thực Thi</th>
        </tr>
    `;
    tasks.forEach(task => {
        const row = taskTable.insertRow();
        const pidCell = row.insertCell();
        const arrivalTimeCell = row.insertCell();
        const burstTimeCell = row.insertCell();
        
        pidCell.textContent = task.pid;
        arrivalTimeCell.textContent = task.arrivalTime;
        burstTimeCell.textContent = task.burstTime;
    });
}

// Xóa Tiến Trình trên class Container__Input
function clearInputs() {
    document.getElementById('taskID').value = '';
    document.getElementById('arrivalTime').value = '';
    document.getElementById('burstTime').value = '';
}

// Sắp xếp Tiến Trình
function SortTaskSRTF(tasks) {
    tasks.sort((a, b) => (a.arrivalTime - b.arrivalTime)); // Sort by arrival time
}

function SortSRTF(tasks) {
    tasks.sort((a, b) => (a.arrivalTime + a.turnaroundTime) > (b.turnaroundTime + b.arrivalTime)); // Sort by arrival time
}
// Chức Năng quay Trở về Home
function backHome() {
    // Replace 'index.html' with the path to your home page
    window.location.href = 'index.html';
}

// Cập Nhật Tiến Trình
function UpdateTask() {
    if (tasks.length === 0) {
        alert("Chưa Có Tiến Trình! Vui Lòng Nhập Tiến Trình...");
        return;
    }
    
    const textName = prompt('Nhập ID Tiến Trình Bạn Muốn Cập Nhật:');
    const taskIndex = tasks.findIndex(task => task.pid === textName);
    
    if (taskIndex === -1) {
        alert('Tiến trình không tồn tại. Vui lòng chọn ID khác.');
    } else {
        const arrivalTime = parseInt(prompt('Nhập Thời Gian Đến Tiến Trình Bạn Muốn Cập Nhật:'));
        const burstTime = parseInt(prompt('Nhập Thời Gian Thực Thi Tiến Trình Bạn Muốn Cập Nhật:'));
        
        if (!isNaN(arrivalTime) && arrivalTime >= 0 && !isNaN(burstTime) && burstTime >= 0) {
            tasks[taskIndex].arrivalTime = arrivalTime;
            tasks[taskIndex].burstTime = burstTime;
            tasks[taskIndex].remainingTime = burstTime; // Reset remaining time if burst time changes
            updateTaskTable();
        } else {
            alert('Dữ liệu không hợp lệ. Vui lòng nhập lại.');
        }
    }
}

// Function to find the process with the shortest remaining time
function findShortestRemainingTimeProcess(processes, n, currentTime) {
    let shortestIndex = -1;
    let shortestTime = Infinity;

    for (let i = 0; i < n; i++) {
        if (processes[i].arrivalTime <= currentTime && processes[i].remainingTime < shortestTime && processes[i].remainingTime > 0) {
            shortestTime = processes[i].remainingTime;
            shortestIndex = i;
        }
    }

    return shortestIndex;
}

// Function to implement Shortest Remaining Time First (SRTF) scheduling
function SRTF(n, processes) {
    const idleTimes = Array.from({ length: MAX_PROCESSES }, () => []);
    let currentTime = 0;
    let shortestIndex = -1;
    let anyProcessCompleted = false;

    while (true) {
        shortestIndex = findShortestRemainingTimeProcess(processes, n, currentTime);

        if (shortestIndex === -1) {
            currentTime++;
            continue;
        }

        processes[shortestIndex].remainingTime--;

        if (processes[shortestIndex].remainingTime === 0) {
            processes[shortestIndex].turnaroundTime = currentTime + 1 - processes[shortestIndex].arrivalTime;
            processes[shortestIndex].waitingTime = processes[shortestIndex].turnaroundTime - processes[shortestIndex].burstTime;
            anyProcessCompleted = true;
        }

        for (let i = 0; i < n; i++) {
            if (i !== shortestIndex && processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0) {
                if (idleTimes[i].length === 0 || idleTimes[i][idleTimes[i].length - 1][1] !== currentTime) {
                    idleTimes[i].push([currentTime, currentTime + 1]);
                } else {
                    idleTimes[i][idleTimes[i].length - 1][1]++;
                }
            }
        }

        currentTime++;

        if (anyProcessCompleted) {
            let allCompleted = true;
            for (let i = 0; i < n; i++) {
                if (processes[i].remainingTime > 0) {
                    allCompleted = false;
                    break;
                }
            }
            if (allCompleted) break;
        }
    }
    return [processes, idleTimes];
}



function displayResults(processedTasks, idleTimes) {
    const timeChar = document.getElementById('time-char');
    timeChar.innerHTML = ''; // Clear previous content

    let totalWaitTime = 0;
    let totalTurnaroundTime = 0;
    let totalResponseTime = 0;

    const waitTimesArr = [];
    const responseTimes = [];
    const turnaroundTimes = [];

    const minArrivalTime = Math.min(...processedTasks.map(task => task.arrivalTime));

    processedTasks.forEach((task, index) => {
        const arrivalTime = task.arrivalTime;
        const burstTime = task.burstTime;
        const turnaroundTime = task.turnaroundTime;
        const waitTime = task.waitingTime;
        let responseTime;

        if (arrivalTime === minArrivalTime) {
            responseTime = 0;
        } else {
            if (idleTimes[index].length > 0) {
                const firstIdleStartTime = idleTimes[index][0][0];
                const firstIdleEndTime = idleTimes[index][0][1];
                responseTime = firstIdleEndTime - firstIdleStartTime;
            } else {
                responseTime = 0;
            }
        }

        waitTimesArr.push(waitTime);
        responseTimes.push(responseTime);
        turnaroundTimes.push(turnaroundTime);

        totalWaitTime += waitTime;
        totalTurnaroundTime += turnaroundTime;
        totalResponseTime += responseTime;
    });

    const waitTimeAvg = totalWaitTime / processedTasks.length;
    const responseTimeAvg = totalResponseTime / processedTasks.length;
    const turnaroundTimeAvg = totalTurnaroundTime / processedTasks.length;

    // Display waiting times
    timeChar.innerHTML += `<span>Thời Gian Chờ:</span><br>`;
    waitTimesArr.forEach((wt, index) => {
        timeChar.innerHTML += `<span>w${processedTasks[index].pid} = ${wt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Chờ TB = ${waitTimeAvg.toFixed(2)}</span><br><br>`;

    // Display response times
    timeChar.innerHTML += `<span>Thời Gian Đáp Ứng:</span><br>`;
    responseTimes.forEach((rt, index) => {
        timeChar.innerHTML += `<span>R${processedTasks[index].pid} = ${rt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Đáp Ứng TB = ${responseTimeAvg.toFixed(2)}</span><br><br>`;

    // Display turnaround times
    timeChar.innerHTML += `<span>Thời Xoay Vòng:</span><br>`;
    turnaroundTimes.forEach((tt, index) => {
        timeChar.innerHTML += `<span>t${processedTasks[index].pid} = ${tt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Xoay Vòng TB = ${turnaroundTimeAvg.toFixed(2)}</span><br>`;
}

function calculateSRTF() {
    if (tasks.length === 0) {
        alert("Chưa Có Tiến Trình! Vui Lòng Nhập Thêm Tiến Trình...");
        return;
    }

    const [processedTasks, idleTimes] = SRTF(tasks.length, tasks);
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = `
        <tr>
            <th>ID Tiến Trình</th>
            <th>Thời Gian Bắt Đầu</th>
            <th>Thời Gian Kết Thúc</th>
        </tr>
    `;
    let maxEndTime = 0;
    processedTasks.forEach((task, index) => {
        const row = resultTable.insertRow();
        row.insertCell().textContent = task.pid;
        row.insertCell().textContent = task.arrivalTime; // Display arrival time
        row.insertCell().textContent = task.turnaroundTime + task.arrivalTime; // Display completion time
        maxEndTime = Math.max(task.turnaroundTime + task.arrivalTime,maxEndTime);
    });

    displayResults(processedTasks, idleTimes);
    drawChart(processedTasks, idleTimes, maxEndTime);
}

function drawChart(processedTasks, idleTimes, maxEndTime) {
    const ganttChart = document.getElementById('gantt-chart');
    ganttChart.innerHTML = ''; // Clear previous content

    // Create a table for the Gantt chart
    const table = document.createElement('table');
    table.classList.add('gantt-table');

    // Create the top row with time headers
    const headerRow = document.createElement('tr');
    const emptyCell = document.createElement('th');
    headerRow.appendChild(emptyCell); // Empty cell for the Task ID column

    // Calculate the max end time (turnaroundTime + arrivalTime)
    for (let i = 0; i <= maxEndTime ; i++) {
        const timeCell = document.createElement('th');
        timeCell.textContent = i;
        headerRow.appendChild(timeCell);
    }
    table.appendChild(headerRow);

    // Create rows for each task
    processedTasks.forEach((task, taskIndex) => {
        const row = document.createElement('tr');
        const taskCell = document.createElement('td');
        taskCell.textContent = task.pid;
        row.appendChild(taskCell);

        // Initialize a map to track which time slots are idle
        const idleMap = new Array(maxEndTime + 1).fill(false);

        // Mark idle time slots
        if (idleTimes[taskIndex]) {
            idleTimes[taskIndex].forEach(([idleStart, idleEnd]) => {
                for (let i = idleStart; i < idleEnd; i++) {
                    idleMap[i] = true;
                }
            });
        }

        // Draw the idle times first
        for (let i = 0; i <= maxEndTime; i++) {
            const timeCell = document.createElement('td');
            timeCell.classList.add('gantt-cell');

            if (idleMap[i]) {
                timeCell.classList.add('gantt-task-pending');
            }

            row.appendChild(timeCell);
        }

        // Draw the active times
        for (let i = task.arrivalTime; i < task.turnaroundTime + task.arrivalTime; i++) {
            const timeCell = row.children[i + 1]; // Start from the second cell (index 1) after Task ID cell
            if (!idleMap[i]) {
                timeCell.classList.remove('gantt-task-pending'); // Remove idle class if it exists
                timeCell.classList.add('gantt-task');
            }
        }

        table.appendChild(row);
    });

    ganttChart.appendChild(table);
}

