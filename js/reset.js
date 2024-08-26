function resetPage() {

    if (tasks.length === 0) {
        alert("Chưa Hiển Thị Thông Tin. Không Thể Xóa !");
        return;
    }

    // Reset form inputs
    document.getElementById("taskID").value = "";
    document.getElementById("arrivalTime").value = "";
    document.getElementById("burstTime").value = "";

    // Clear input task table
    var taskTable = document.getElementById("taskTable");
    while (taskTable.rows.length > 1) {
        taskTable.deleteRow(1);
    }

    // Clear result table
    var resultTable = document.getElementById("resultTable");
    while (resultTable.rows.length > 1) {
        resultTable.deleteRow(1);
    }

    // Clear Gantt chart
    var ganttChart = document.getElementById("gantt-chart");
    ganttChart.innerHTML = "";

    // Clear time-char content
    var timeChar = document.getElementById("time-char");
    timeChar.innerHTML = "";

    // Cập Nhật task
    tasks.length = 0;
}
// Attach the resetPage function to the Clear Task button
document.querySelector('button[onclick="resetPage()"]').addEventListener("onclick", resetPage);
