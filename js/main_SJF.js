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

// Chức Năng quay Trở về Home
function backHome() {
    // Replace 'index.html' with the path to your home page
    window.location.href = 'index.html';
}

// Xắp xếp theo thời gian đến 
function SortTaskSJF(tasks) {
    tasks.sort((a, b) => a[2] - b[2]); // Sort by burst time
}

// Thuật Toán SJF
function SJF(tasks) {
    const n = tasks.length;
    const tmp = [...tasks]; // Tạo mảng phụ tmp để không thay đổi mảng chính
    const sortedTasks = [];
    let currentTime = 0;

    // B1: Tìm task có thời gian đến nhỏ nhất
    let minArrivalTimeTaskIndex = tmp.findIndex(task => task[1] === Math.min(...tmp.map(t => t[1])));
    let minArrivalTimeTask = tmp[minArrivalTimeTaskIndex];

    // Đẩy task có thời gian đến nhỏ nhất vào sortedTasks và loại bỏ nó khỏi tmp
    sortedTasks.push(minArrivalTimeTask);
    tmp.splice(minArrivalTimeTaskIndex, 1);
    currentTime = Math.max(currentTime, minArrivalTimeTask[1]) + minArrivalTimeTask[2];

    // B2: Sắp xếp tmp theo thời gian thực thi (burst time)
    tmp.sort((a, b) => a[2] - b[2]);

    while (sortedTasks.length < n) {
        // Lấy các task có thời gian đến <= currentTime
        let availableTasks = tmp.filter(task => task[1] <= currentTime);

        if (availableTasks.length > 0) {
            let nextTask = availableTasks.shift(); // Lấy task đầu tiên
            tmp.splice(tmp.indexOf(nextTask), 1);
            sortedTasks.push(nextTask);
            currentTime += nextTask[2];
        } else {
            let nextTask = tmp.shift(); // Lấy task đầu tiên nếu không có task nào đến trước currentTime
            sortedTasks.push(nextTask);
            currentTime = Math.max(currentTime, nextTask[1]) + nextTask[2];
        }
    }

    // Tính toán các thông số
    const start_time = [];
    const end_time = [];
    const wait_time = [];
    const response_time = [];
    const turnaround_time = [];

    currentTime = 0;
    for (let i = 0; i < n; i++) {
        start_time[i] = Math.max(currentTime, sortedTasks[i][1]);
        end_time[i] = start_time[i] + sortedTasks[i][2];
        wait_time[i] = start_time[i] - sortedTasks[i][1];
        response_time[i] = start_time[i] - sortedTasks[i][1];
        turnaround_time[i] = end_time[i] - sortedTasks[i][1];
        currentTime = end_time[i];
    }

    return [start_time, end_time, wait_time, response_time, turnaround_time, sortedTasks];
}

// Chức năng Bắt Đầu SJF
function calculateSJF() {
    if (tasks.length === 0) {
        alert("Chưa Có Tiến Trình! Vui Lòng Nhập Thêm Tiến Trình...");
        return;
    }
    const [st, et, wt, rt, tt, sortedTasks] = SJF(tasks);
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = `
        <tr>
            <th>ID Tiến Trình</th>
            <th>Thời Gian Bắt Đầu</th>
            <th>Thời Gian Kết Thúc</th>
        </tr>
    `;

    sortedTasks.forEach((task, index) => {
        const row = resultTable.insertRow();
        row.insertCell().textContent = task[0];
        row.insertCell().textContent = st[index];
        row.insertCell().textContent = et[index];
    });

    drawGanttChart(sortedTasks, st, et);
    displayResults(wt, rt, tt);
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
        timeChar.innerHTML += `<span>w${tasks[index][0]} = ${wt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Chờ TB = ${waitTimeAvg.toFixed(2)}</span><br><br>`;

    // Display response times
    timeChar.innerHTML += `<span>Thời Gian Đáp Ứng:</span><br>`;
    responseTimes.forEach((rt, index) => {
        timeChar.innerHTML += `<span>R${tasks[index][0]} = ${rt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Đáp Ứng TB = ${responseTimeAvg.toFixed(2)}</span><br><br>`;

    // Display turnaround times
    timeChar.innerHTML += `<span>Thời Xoay Vòng:</span><br>`;
    turnaroundTimes.forEach((tt, index) => {
        timeChar.innerHTML += `<span>t${tasks[index][0]} = ${tt}</span><br>`;
    });
    timeChar.innerHTML += `<span>--> Thời Gian Xoay Vòng TB = ${turnaroundTimeAvg.toFixed(2)}</span><br>`;
}


// Vẽ Gantt 
function drawGanttChart(sortedTasks, startTimes, endTimes) {
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

    // Create rows for each task
    sortedTasks.forEach((task, index) => {
        const row = document.createElement('tr');

        // Create the Task ID cell
        const taskIdCell = document.createElement('td');
        taskIdCell.textContent = task[0];
        row.appendChild(taskIdCell);

        // Create cells for the timeline
        for (let i = 0; i <= maxEndTime; i++) {
            const cell = document.createElement('td');
            if (i >= task[1] && i < startTimes[index]) {
                cell.classList.add('gantt-task-pending'); // Pending task
            } else if (i >= startTimes[index] && i < endTimes[index]) {
                cell.classList.add('gantt-task'); // Active task
            }
            row.appendChild(cell);
        }

        table.appendChild(row);
    });

    ganttChart.appendChild(table);
}
