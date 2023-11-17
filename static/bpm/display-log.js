console.log("BPM, by LRG. A simple blood pressure and pulse diary")

const body = document.querySelector('body');
const log = document.querySelector('#log');

const logRecord = (quad, i) => {
    
    let datetime = new Date(quad[0]);
    let sys = quad[1];
    let dia = quad[2];
    let bpm = quad[3];
    console.log(datetime, sys, dia, bpm);
    let li = document.createElement('li');
    li.classList = 'pickle';
    li.innerHTML = `
                <strong>Date</strong>: ${datetime.toLocaleString()}
                <strong>Systolic</strong>: ${sys}
                <strong>Diastolic</strong>: ${dia}
                <strong>Pulse</strong>: ${bpm}BPM
            `.trim();
    let del = document.createElement('em');
    del.innerHTML =' 🚮 delete';
    
    del.addEventListener('click', e => {
        console.log('delete', i)
        deleteEntry(i);
        menu.dispatchEvent(logAddedEvent);
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

body.addEventListener('logAdded', updateLog);
updateLog();


