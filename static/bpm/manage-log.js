console.log("BPM, by LRG. A simple blood pressure and pulse diary")
const key = "bpm-x";
const body = document.querySelector('body');
const log = document.querySelector('#log');
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
    if(confirm("Delete this record?")) {
        writeLog(nLog);
    }
}

// display a record
const logRecord = (quad, i) => {
    
    let datetime = new Date(quad[0]);
    let sys = quad[1];
    let dia = quad[2];
    let bpm = quad[3];
    console.log(datetime, sys, dia, bpm);
    let li = document.createElement('li');
    li.classList = 'reading';
    li.innerHTML = `
                <strong>Date</strong>: ${datetime.toLocaleString()}
                <strong>Pulse</strong>: ${bpm}BPM
                <span class="bp">
                    <span class="sys">${sys}</span>
                    <span class="dia">${dia}</span>
                </span>
            `.trim();
    let del = document.createElement('em');
    del.innerHTML =' 🚮 delete';
    
    del.addEventListener('click', e => {
        deleteEntry(i);
        menu.dispatchEvent(logChangedEvent);
    })
    li.appendChild(del);
    log.appendChild(li);

}
const updateLog = (e) => {
    if(e) {
        e.preventDefault();
    }
    console.log('Update Log');
    log.innerHTML = '';
    let data = readLog();
    data.forEach((quad, i) => logRecord(quad, i));
}

body.addEventListener('logChanged', updateLog);
updateLog();


const logChangedEvent = new Event('logChanged' ,{bubbles: true});

const menu = document.querySelector('#menu');

const addLog = () => {
    let formData = new FormData(menu);
    console.log(formData.get('sys'))
    let ent = [Date.now(), 
        formData.get('sys'), 
        formData.get('dia'),
        formData.get('bpm')
    ];
    appendLog(ent);
    menu.dispatchEvent(logChangedEvent);
}

menu.addEventListener('submit', (e) => {
    e.preventDefault();
    addLog();
});