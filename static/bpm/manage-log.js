let key = "bpm-x";

const readLog = () => {
    let ob = localStorage.getItem(key);
    if(!ob) {
        return [];
    }
    return JSON.parse(ob);
}
const writeLog = (updated) => {
    localStorage.setItem(key, JSON.stringify(updated));
}

const appendLog = (entry) => {
    let nLog = [...readLog(), entry];
    writeLog(nLog);
}

const deleteEntry = (ind) => {
    let nLog = [...readLog()].filter((v, i) => ind !== i);
    console.log("NLOG", JSON.stringify(nLog, ' '));
    writeLog(nLog);
}