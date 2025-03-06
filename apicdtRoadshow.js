const phases = [
    { title: "队伍介绍", notime: true },
    { title: "评审介绍", notime: true },
    { title: "正方一辩立论", time: "05:00", mono: true },
    { title: "反方二辩质询正方一辩", time: "02:30", mono: true },
    { title: "反方一辩立论", time: "05:00", mono: true },
    { title: "正方二辩质询反方一辩", time: "02:30", mono: true },
    { title: "反方二辩驳论", time: "02:30", mono: true },
    { title: "正方二辩驳论", time: "02:30", mono: true },
    { title: "正反三辩攻辩", time: "02:30" },
    { title: "正方三辩陈词", time: "02:30", mono: true },
    { title: "反方三辩陈词", time: "02:30", mono: true },
    { title: "正方一辩质询反方二、三、四辩", time: "affirmativeStore", mono: true },//
    { title: "反方一辩质询反方二、三、四辩", time: "negativeStore", mono: true },//
    { title: "正方四辩第一次总结", time: "05:00", mono: true },
    { title: "反方四辩第一次总结", time: "05:00", mono: true },
    { title: "自由辩论", time: "03:30" },
    { title: "反方四辩第二次总结", time: "negativeStore", mono: true },//
    { title: "正方四辩第二次总结", time: "affirmativeStore", mono: true },//
    { title: "缓冲时间", time: "10:00", mono: true },
    { title: "公布印象票", time: "0:00", notime: true },
    { title: "评审点评", time: "10:00", mono: true },
    { title: "比赛结果", time: "0:00", notime: true}
];
let currentPhase = 0;
let soundFlag = 0;
let affirmativeStore = "05:00";
let negativeStore = "05:00";

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
        setPhase(0);
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

    // 让 stored time 覆盖 phase 里的时间
    let phaseTime = phase.time;
    if (phase.title === "正方一辩质询反方二、三、四辩" || phase.title === "正方四辩第二次总结") {
        phaseTime = affirmativeStore;
    } else if (phase.title === "反方一辩质询反方二、三、四辩" || phase.title === "反方四辩第二次总结") {
        phaseTime = negativeStore;
    }

    // 设置 UI 显示内容
    document.getElementById("phase-title").textContent = phase.title;
    document.getElementById("phase-title-notime").innerHTML = `<br>${phase.title}<br><br>`;
    document.getElementById("general-time").textContent = phaseTime;
    document.getElementById("affirmative-time").textContent = phaseTime;
    document.getElementById("negative-time").textContent = phaseTime;

    if (phase.single) {
        if (index === 4) { // 反方盘问
            document.getElementById("affirmative-timer").style.display = "none";
            document.getElementById("negative-timer").style.display = "inline-block";
            document.getElementById("general-timer").style.display = "none";
            document.getElementById("phase-title").style.display = "inline-block";
            document.getElementById("phase-title-notime").style.display = "none";
        } else if (index === 5) { // 正方盘问
            document.getElementById("negative-timer").style.display = "none";
            document.getElementById("affirmative-timer").style.display = "inline-block";
            document.getElementById("general-timer").style.display = "none";
            document.getElementById("phase-title").style.display = "inline-block";
            document.getElementById("phase-title-notime").style.display = "none";
        }
    } else if (phase.mono) {
        document.getElementById("affirmative-timer").style.display = "none";
        document.getElementById("negative-timer").style.display = "none";
        document.getElementById("general-timer").style.display = "inline-block";
        document.getElementById("phase-title").style.display = "inline-block";
        document.getElementById("phase-title-notime").style.display = "none";
    } else if (phase.notime) {
        document.getElementById("affirmative-timer").style.display = "none";
        document.getElementById("negative-timer").style.display = "none";
        document.getElementById("general-timer").style.display = "none";
        document.getElementById("phase-title").style.display = "none";
        document.getElementById("phase-title-notime").style.display = "inline-block";
    } else {
        // 显示双计时器环节
        document.getElementById("affirmative-timer").style.display = "inline-block";
        document.getElementById("negative-timer").style.display = "inline-block";
        document.getElementById("general-timer").style.display = "none";
        document.getElementById("phase-title").style.display = "inline-block";
        document.getElementById("phase-title-notime").style.display = "none";
    }

    console.log(`Phase ${index}: ${phase.title}, Time: ${phaseTime}`);
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
    if (timers[side]) return; // Timer is already running

    // Stop the other timer in "自由辩论"
    if (phases[currentPhase].title === "自由辩论" || phases[currentPhase].title === "正反三辩攻辩") {
        const otherSide = side === "affirmative" ? "negative" : "affirmative";
        stopTimer(otherSide);
    }

    const timeText = document.getElementById(`${side}-time`);
    let [minutes, seconds] = timeText.textContent.split(":").map(Number);
    timers.remaining[side] = minutes * 60 + seconds;

    timers[side] = setInterval(() => {
        const currentPhaseTitle = phases[currentPhase].title;

        if (timers.remaining[side] === 31 && currentPhaseTitle !== "评审点评" && currentPhaseTitle !== "缓冲时间") {
            playSound();
        }

        if (timers.remaining[side] <= 0 && currentPhaseTitle !== "评审点评" && currentPhaseTitle !== "缓冲时间") {
            stopTimer(side);
            playSound2();
        } else if (timers.remaining[side] <= 0 && (currentPhaseTitle === "评审点评" || currentPhaseTitle === "缓冲时间")) {
            stopTimer(side);
        } else {
            timers.remaining[side]--;
            const mins = String(Math.floor(timers.remaining[side] / 60)).padStart(2, "0");
            const secs = String(timers.remaining[side] % 60).padStart(2, "0");
            timeText.textContent = `${mins}:${secs}`;
        }
    }, 1000);
}

function stopTimer(side) {
    const currentPhaseTitle = phases[currentPhase].title;

    if (timers[side]) {
        // 获取当前计时器的时间文本
        const timeText = document.getElementById(`${side}-time`).textContent;

        // 直接存储 "MM:SS" 格式
        if (currentPhaseTitle === "正方一辩立论" || currentPhaseTitle === "正方四辩第一次总结") {
            affirmativeStore = timeText;
            console.log("Saved affirmativeStore:", affirmativeStore);
        } 
        else if (currentPhaseTitle === "反方一辩立论" || currentPhaseTitle === "反方四辩第一次总结") {
            negativeStore = timeText;
            console.log("Saved negativeStore:", negativeStore);
        }

        clearInterval(timers[side]);
        timers[side] = null;
        console.log("Timer stopped for:", side);
    } else {
        console.log("No active timer for:", side);
    }
}




function resetTimer(side) {
    stopTimer(side);
    const phase = phases[currentPhase];
    document.getElementById(`${side}-time`).textContent = phase.time;
}

function playSound() {
    const sound = document.getElementById("bell-sound");
    sound.play();
    soundFlag++;
}

function playSound2() {
    const sound = document.getElementById("bell-sound2");
    sound.play();
    soundFlag++;
}
