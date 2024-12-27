const phases = [
    { title: "立论", time: "03:30" },
    { title: "质询", time: "02:00" },
    { title: "驳论", time: "03:00" },
    { title: "申论", time: "03:00" },
    { title: "反方盘问", time: "02:30", single: true },
    { title: "正方盘问", time: "02:30", single: true },
    { title: "小结", time: "01:30" },
    { title: "自由辩论", time: "04:00" },
    { title: "总结陈词", time: "03:30" }
];
let currentPhase = 0;

const timers = {
    affirmative: null,
    negative: null,
    remaining: { affirmative: 0, negative: 0 }
};

document.addEventListener("DOMContentLoaded", () => {
    const proceedButton = document.getElementById("proceed-to-info");
    const templateButtons = document.querySelectorAll(".template-button");

    // 手动输入的下一步按钮
    proceedButton.addEventListener("click", () => {
        const title = document.getElementById("title").value;
        const affirmativeTeam = document.getElementById("affirmative-team").value;
        const affirmativeTopic = document.getElementById("affirmative-topic").value;
        const negativeTeam = document.getElementById("negative-team").value;
        const negativeTopic = document.getElementById("negative-topic").value;

        if (!title || !affirmativeTeam || !affirmativeTopic || !negativeTeam || !negativeTopic) {
            alert("请填写完整信息！");
            return;
        }

        // 填充计时器页面信息
        startMatch(title, affirmativeTeam, affirmativeTopic, negativeTeam, negativeTopic);
    });

    // 选择模板按钮
    templateButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const title = e.target.dataset.title;
            const affirmativeTeam = e.target.dataset.affirmativeTeam;
            const affirmativeTopic = e.target.dataset.affirmativeTopic;
            const negativeTeam = e.target.dataset.negativeTeam;
            const negativeTopic = e.target.dataset.negativeTopic;

            // 填充计时器页面信息并跳转
            startMatch(title, affirmativeTeam, affirmativeTopic, negativeTeam, negativeTopic);
        });
    });

    // 开始比赛，跳转到计时器页面
    function startMatch(title, affirmativeTeam, affirmativeTopic, negativeTeam, negativeTopic) {
        document.getElementById("match-title").textContent = title;
        document.getElementById("affirmative-name").textContent = affirmativeTeam;
        document.getElementById("affirmative-debate").textContent = affirmativeTopic;
        document.getElementById("negative-name").textContent = negativeTeam;
        document.getElementById("negative-debate").textContent = negativeTopic;

        document.getElementById("cover-page").style.display = "none";
        document.getElementById("timer-page").style.display = "block";
    }
});


// Info page to timer page
document.getElementById("start-match").addEventListener("click", () => {
    const affirmativeTeam = document.getElementById("affirmative-team").value;
    const affirmativeTopic = document.getElementById("affirmative-topic").value;
    const negativeTeam = document.getElementById("negative-team").value;
    const negativeTopic = document.getElementById("negative-topic").value;
    const matchTitle = document.getElementById("title").value;

    // Update match info
    document.getElementById("match-title").textContent = matchTitle;
    document.getElementById("affirmative-name").textContent = affirmativeTeam;
    document.getElementById("affirmative-debate").textContent = affirmativeTopic;
    document.getElementById("negative-name").textContent = negativeTeam;
    document.getElementById("negative-debate").textContent = negativeTopic;

    document.getElementById("info-page").style.display = "none";
    document.getElementById("timer-page").style.display = "block";
    setPhase(currentPhase);
});

function setPhase(index) {
    const phase = phases[index];
    document.getElementById("phase-title").textContent = `环节${index + 1}：${phase.title}`;
    document.getElementById("affirmative-time").textContent = phase.time;
    document.getElementById("negative-time").textContent = phase.time;

    if (phase.single) {
        if (index === 4) { // 反方盘问
            document.getElementById("affirmative-timer").style.display = "none";
            document.getElementById("negative-timer").style.display = "inline-block";
        } else if (index === 5) { // 正方盘问
            document.getElementById("negative-timer").style.display = "none";
            document.getElementById("affirmative-timer").style.display = "inline-block";
        }
    } else {
        // 显示双计时器环节
        document.getElementById("affirmative-timer").style.display = "inline-block";
        document.getElementById("negative-timer").style.display = "inline-block";
    }
}

function prevPhase() {
    if (currentPhase > 0) {
        currentPhase--;
        setPhase(currentPhase);
    }
}

function nextPhase() {
    if (currentPhase < phases.length - 1) {
        currentPhase++;
        setPhase(currentPhase);
    }
}

function startTimer(side) {
    if (timers[side]) return;
    const timeText = document.getElementById(`${side}-time`);
    let [minutes, seconds] = timeText.textContent.split(":").map(Number);
    timers.remaining[side] = minutes * 60 + seconds;

    timers[side] = setInterval(() => {
        if (timers.remaining[side] <= 0) {
            stopTimer(side);
            playSound();
        } else {
            timers.remaining[side]--;
            const mins = String(Math.floor(timers.remaining[side] / 60)).padStart(2, "0");
            const secs = String(timers.remaining[side] % 60).padStart(2, "0");
            timeText.textContent = `${mins}:${secs}`;
        }
    }, 1000);
}

function stopTimer(side) {
    clearInterval(timers[side]);
    timers[side] = null;
}

function resetTimer(side) {
    stopTimer(side);
    const phase = phases[currentPhase];
    document.getElementById(`${side}-time`).textContent = phase.time;
}

function playSound() {
    const sound = document.getElementById("bell-sound");
    sound.play();
}
