const logAddedEvent = new Event('logAdded' ,{bubbles: true});

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
    menu.dispatchEvent(logAddedEvent);
}

menu.addEventListener('submit', (e) => {
    e.preventDefault();
    addLog();
});