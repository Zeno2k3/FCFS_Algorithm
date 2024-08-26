const tasks = [];

//Thêm 1 Tiến Trình
function addTask() {
    const taskId = document.getElementById("taskID").value;
    const arrivalTime = parseInt(document.getElementById("arrivalTime").value);
    const burstTime = parseInt(document.getElementById("burstTime").value);

    // Kiểm tra nếu có trùng taskId
    if (tasks.some(task => task[0] === taskId)) {
        alert('Tiến trình đã tồn tại. Vui lòng chọn ID khác.');
        return;
    }

    // Kiểm tra số âm
    if (taskId && !isNaN(arrivalTime) && arrivalTime >= 0 && !isNaN(burstTime) && burstTime >= 0) {
        tasks.push([taskId, arrivalTime, burstTime]);
        updateTaskTable();
        clearInputs();
    } else {
        alert('Vui lòng nhập đầy đủ và chính xác thông tin tiến trình.');
    }
}

// Xóa 1 Tiến Trình.
function popTask() {
    if(tasks.length === 0){
        alert("Chưa Có Tiến Trình ! Vui Lòng Nhập Tiến Trình...");
        return;
    }
    const textName = prompt('Nhập ID Tiến Trình Bạn Muốn Xóa :');
    const taskIndex = tasks.findIndex(task => task[0] === textName);
    
    if (taskIndex === -1) {
        alert('Tiến trình không tồn tại. Vui lòng chọn ID khác.');
    } else {
        tasks.splice(taskIndex, 1);
        updateTaskTable();
    }
}

// Cập Nhật Tiến Trình
function UpdateTask() {
    if(tasks.length === 0){
        alert("Chưa Có Tiến Trình ! Vui Lòng Nhập Tiến Trình...");
        return;
    }
    const textName = prompt('Nhập ID Tiến Trình Bạn Muốn Cập Nhật :');
    const taskIndex = tasks.findIndex(task => task[0] === textName);
    
    if (taskIndex === -1) {
        alert('Tiến trình không tồn tại. Vui lòng chọn ID khác.');
    } else {
        const arrivalTime = prompt('Nhập Thời Gian Đến Tiến Trình Bạn Muốn Cập Nhật :');
        const burstTime = prompt('Nhập Thời Gian Thực Thi Tiến Trình Bạn Muốn Cập Nhật :');
        if(!isNaN(arrivalTime) && arrivalTime >= 0 && !isNaN(burstTime) && burstTime >= 0){
            tasks[taskIndex][1] = Number(arrivalTime);
            tasks[taskIndex][2] = Number(burstTime);
            updateTaskTable();
        }
        else {
            alert('Dữ Liệu Không Hợp Lệ. Vui lòng chọn Nhập Lại.');
        }
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
        task.forEach(data => {
            const cell = row.insertCell();
            cell.textContent = data;
        });
    });
}

// Xóa Tiến Trình trên class Container__Input
function clearInputs() {
    document.getElementById('taskID').value = '';
    document.getElementById('arrivalTime').value = '';
    document.getElementById('burstTime').value = '';
}

// Sắp xếp Tiến Trình
function SortTaskAT(tasks) {
    tasks.sort((a, b) => a[1] - b[1]);
}

// Chức Năng quay Trở về Home
function backHome() {
    // Replace 'index.html' with the path to your home page
    window.location.href = 'index.html';
}


// Thuật Toán FCFS
function FCFS(tasks) {
    SortTaskAT(tasks);
    const n = tasks.length;
    const start_time = new Array(n).fill(0);
    const end_time = new Array(n).fill(0);
    const wait_time = new Array(n).fill(0);
    const response_time = new Array(n).fill(0);
    const turnaround_time = new Array(n).fill(0);

    start_time[0] = tasks[0][1]; // First task starts at its arrival time

    for (let i = 1; i < n; i++) {
        if (tasks[i][1] > start_time[i - 1] + tasks[i - 1][2]) {
            start_time[i] = tasks[i][1];
        } else {
            start_time[i] = start_time[i - 1] + tasks[i - 1][2];
        }
    }
    
    for (let i = 0; i < n; i++) {
        end_time[i] = start_time[i] + tasks[i][2];
        wait_time[i] = start_time[i] - tasks[i][1];
        response_time[i] = start_time[i] - tasks[i][1];
        turnaround_time[i] = end_time[i] - tasks[i][1];
    }
    
    return [start_time, end_time, wait_time, response_time, turnaround_time];
}

// Hiển Thị Kết Quả Tính Toán
function displayResults(waitTimes, responseTimes, turnaroundTimes) {
    const timeChar = document.getElementById('time-char');
    timeChar.innerHTML = ''; // Clear previous content

    const waitTimeAvg = waitTimes.reduce((acc, cur) => acc + cur, 0) / waitTimes.length;
    const responseTimeAvg = responseTimes.reduce((acc, cur) => acc + cur, 0) / responseTimes.length;
    const turnaroundTimeAvg = turnaroundTimes.reduce((acc, cur) => acc + cur, 0) / turnaroundTimes.length;

    // Display waiting times
    timeChar.innerHTML += `<span>Thời Gian Chờ:</span><br>`;
    waitTimes.forEach((wt, index) => {
        timeChar.innerHTML += `<span>wP${tasks[index][0]} = ${wt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Chờ TB = ${waitTimeAvg.toFixed(2)}</span><br><br>`;

    // Display response times
    timeChar.innerHTML += `<span>Thời Gian Đáp Ứng:</span><br>`;
    responseTimes.forEach((rt, index) => {
        timeChar.innerHTML += `<span>Rp${tasks[index][0]} = ${rt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Đáp Ứng TB = ${responseTimeAvg.toFixed(2)}</span><br><br>`;

    // Display turnaround times
    timeChar.innerHTML += `<span>Thời Xoay Vòng:</span><br>`;
    turnaroundTimes.forEach((tt, index) => {
        timeChar.innerHTML += `<span>tP${tasks[index][0]} = ${tt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Xoay Vòng TB = ${turnaroundTimeAvg.toFixed(2)}</span><br>`;
}

// Chức năng Bắt Đầu
function calculateFCFS() {
    if(tasks.length === 0){
        alert("Chưa Có Tiến Trình ! Vui Lòng Nhập Thêm Tiến Trình...")
        return;
    }
    const [st, et, wt, rt, tt] = FCFS(tasks);
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = `
        <tr>
            <th>ID Tiến Trình</th>
            <th>Thời Gian Bắt Đầu</th>
            <th>Thời Gian Kết Thúc</th>
        </tr>
    `;

    tasks.forEach((task, index) => {
        const row = resultTable.insertRow();
        row.insertCell().textContent = task[0];
        row.insertCell().textContent = st[index];
        row.insertCell().textContent = et[index];
    });

    drawGanttChart(tasks, st, et);
    displayResults(wt, rt, tt);
}

// Chức năng Vẽ
function drawGanttChart(tasks, startTimes, endTimes) {
    const ganttChart = document.getElementById('gantt-chart');
    ganttChart.innerHTML = ''; // Clear previous content

    // Create a table for the Gantt chart
    const table = document.createElement('table');
    table.classList.add('gantt-table');

    // Create the top row with time headers
    const headerRow = document.createElement('tr');
    const emptyCell = document.createElement('th');
    headerRow.appendChild(emptyCell); // Empty cell for the Task ID column

    // Find the max end time to define the timeline
    const maxEndTime = Math.max(...endTimes);
    for (let i = 0; i <= maxEndTime; i++) {
        const timeCell = document.createElement('th');
        timeCell.textContent = i;
        headerRow.appendChild(timeCell);
    }
    table.appendChild(headerRow);

    // Sort tasks by their IDs
    const sortedTasks = tasks.map((task, index) => [task, startTimes[index], endTimes[index]])
                             .sort((a, b) => a[0][0].localeCompare(b[0][0]));

    // Create rows for each task
    sortedTasks.forEach(([task, startTime, endTime]) => {
        const row = document.createElement('tr');

        // Create the Task ID cell
        const taskIdCell = document.createElement('td');
        taskIdCell.textContent = task[0];
        row.appendChild(taskIdCell);

        // Create cells for the timeline
        for (let i = 0; i <= maxEndTime; i++) {
            const cell = document.createElement('td');
            if (i >= task[1] && i < startTime) {
                cell.classList.add('gantt-task-pending'); // Pending task
            } else if (i >= startTime && i < endTime) {
                cell.classList.add('gantt-task'); // Active task
            }
            row.appendChild(cell);
        }

        table.appendChild(row);
    });

    ganttChart.appendChild(table);
}


