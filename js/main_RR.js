const tasks = [];

// Thêm 1 Tiến Trình
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

// Xóa 1 Tiến Trình
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
function updateTask() {
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
            tasks[taskIndex][1] = arrivalTime;
            tasks[taskIndex][2] = burstTime;
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

// Chức Năng Thuật Toán RR
function calculateRR() {
    if (tasks.length === 0) {
        alert("Chưa Có Tiến Trình! Vui Lòng Nhập Thêm Tiến Trình...");
        return;
    }
    const q = Number(prompt("Nhập q: "));
    if(!(q >= 0 && !isNaN(q))){
        alert("Q không hợp lệ...");
        return;
    }

    const [st, et, wt, rt, tt, sortedTasks] = RR(tasks, q);
    const resultTable = document.getElementById('resultTable');
    resultTable.innerHTML = `
        <tr>
            <th>ID Tiến Trình</th>
            <th>Thời Gian Bắt Đầu</th>
            <th>Thời Gian Kết Thúc</th>
        </tr>`;

    sortedTasks.forEach((task, index) => {
        const row = resultTable.insertRow();
        row.insertCell().textContent = task[0];
        row.insertCell().textContent = task[1];
        row.insertCell().textContent = task[2];
    });

    drawGanttChart(sortedTasks, st, et);
    displayResults(wt, rt, tt);
}

// Thuật Toán RR
function RR(tasks, q) {
    const n = tasks.length;
    const tmp = tasks.map(task => [...task]); // Copy of tasks to avoid modifying the original
    const sortedTasks = [];
    let currentTime = 0;
    let wait_time = new Array(n).fill(0);
    let remain_time = new Array(n);
    let turnaround_time = new Array(n).fill(0);
    let response_time = new Array(n).fill(-1);
    let st = [], et = [];

    // Initialize remaining times
    for (let i = 0; i < n; i++) {
        remain_time[i] = tmp[i][2];
    }

    while (true) {
        let done = true;
        for (let i = 0; i < n; i++) {
            if (remain_time[i] > 0) {
                done = false; // There is a pending process
                if (response_time[i] === -1) {
                    response_time[i] = currentTime - tmp[i][1];
                }
                if (remain_time[i] > q) {
                    st.push(currentTime);
                    currentTime += q;
                    et.push(currentTime);
                    remain_time[i] -= q;
                    sortedTasks.push([tmp[i][0], st[st.length - 1], et[et.length - 1]]);
                } else {
                    st.push(currentTime);
                    currentTime += remain_time[i];
                    wait_time[i] = currentTime - tmp[i][1] - tmp[i][2];
                    turnaround_time[i] = currentTime - tmp[i][1];
                    remain_time[i] = 0;
                    et.push(currentTime);
                    sortedTasks.push([tmp[i][0], st[st.length - 1], et[et.length - 1]]);
                }
            }
        }
        if (done) break;
    }

    const avg_wt = wait_time.reduce((a, b) => a + b, 0) / n;
    const avg_rt = response_time.reduce((a, b) => a + b, 0) / n;
    const avg_tt = turnaround_time.reduce((a, b) => a + b, 0) / n;
    return [st, et, avg_wt, avg_rt, avg_tt, sortedTasks];
}

// Vẽ Biểu đồ Gantt
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
// Hiển thị kết quả thời gian
function displayResults(wt, rt, tt) {
    const timeChar = document.getElementById('time-char');
    timeChar.innerHTML = `
        <p>Thời Gian Chờ Trung Bình: ${wt}</p>
        <p>Thời Gian Đáp Ứng Trung Bình: ${rt}</p>
        <p>Thời Gian Hoàn Thành Trung Bình: ${tt}</p>
    `;
}
