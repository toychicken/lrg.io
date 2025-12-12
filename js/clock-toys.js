let timeKeys = ['ms', 's', 'm', 'h', 'd']; // ascending order of size
let timeVals = [];
let ticker;

// help with conversion :)
let rangeFinder = {
    ms: { ms: 1, s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 },
    s: { ms: 1 / 1000, s: 1, m: 60, h: 60 * 60, d: 24 * 60 * 60 },
    m: { ms: 1 / 60 / 1000, s: 1 / 60, m: 1, h: 60, d: 24 * 60 },
    h: { ms: 1 / 60 / 60 / 1000, s: 1 / 60 / 60, m: 1 / 60, h: 1, d: 24 },
    d: { ms: 1 / 24 / 60 / 60 / 1000, s: 1 / 24 / 60 / 60, m: 1 / 24 / 60, h: 1 / 24, d: 1 },
}

const rangeBuilder = (is24hour) => {
    const tfh = (is24hour) ? 24 : 12;
    return {
        ms: { ms: 1, s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: tfh * 60 * 60 * 1000 },
        s: { ms: 1 / 1000, s: 1, m: 60, h: 60 * 60, d: tfh * 60 * 60 },
        m: { ms: 1 / 60 / 1000, s: 1 / 60, m: 1, h: 60, d: tfh * 60 },
        h: { ms: 1 / 60 / 60 / 1000, s: 1 / 60 / 60, m: 1 / 60, h: 1, d: tfh },
        d: { ms: 1 / tfh / 60 / 60 / 1000, s: 1 / tfh / 60 / 60, m: 1 / tfh / 60, h: 1 / tfh, d: 1 },
    }
}
const zeroToElapsed = (timeObj, p, m) => {
    const s = timeKeys.indexOf(p);
    const f = timeKeys.indexOf(m);
    // make an array of things to add
    const parts = timeKeys.slice(s,f);
    let elapsed = 0;
    parts.forEach((cM) => {
        elapsed = elapsed + (rangeFinder[p][cM] * timeObj[cM]);
    })
    return elapsed;
};

const nTime = (params) => {

    const {
        v,  // value
        r,  // range
        p,  // time value
        m,  // time range
        easing,
        bounce,
    } = {
        ...{
            easing: 'linear',
            bounce: false,
        }, ...params
    };

    /**
     * 
     * 'v' is the value
     * 'r' is the range
     * 
     * if the p & m values are set, this means we use the current TIME, and then return the values based on
     * 
     * 'p' being the key for the time object i.e. p = time[seconds] = 30
     * 'm' being the key for the tRange i.e. m = 'minute' = tt[seconds][minute] = 60
     */


    const timeObj = getClockTime();


    
    let rng = (r) ? r : rangeFinder[p][m];
    let t = (v) ? v : zeroToElapsed(timeObj, p, m);

    let n = t/rng;
    // before the output

    // half bounce
    let bn = Math.abs((n)-0.5)*2; // offset and Abs to create a bounce

    let bounced = easingFunctions[easing](bn);
    let eased = easingFunctions[easing](n);
    return {
        eased, 
        bounced,
        timeObj,
        range: rng,
        val : t,
        linear : n
    };
}

let cpState = {};

const dateTimeToTimeObj = (t) => {

    const tob = {
        ms: t.getMilliseconds(),
        s: t.getSeconds(),
        m: t.getMinutes(),
        h: cpState.is24hour ? t.getHours() : t.getHours() % 12,
    }
    const milliseconds = (rangeFinder.ms.ms * tob.ms) + (rangeFinder.ms.s * tob.s) + (rangeFinder.ms.m * tob.m) + (rangeFinder.ms.h * tob.h);
    const zeroHour = t.getTime() - milliseconds;
    return {
        ...tob,
        milliseconds,
        zeroHour
    }
}

const timeObjToMilliseconds = (tob) => {
    return (rangeFinder.ms.ms * tob.ms) + (rangeFinder.ms.s * tob.s) + (rangeFinder.ms.m * tob.m) + (rangeFinder.ms.h * tob.h);
}

const timeObjToDate = (tob) => {
    return new Date((tob.zeroHour + tob.milliseconds));
}

const getClockTime = (params) => {

    let { t } = { ...{ t: new Date() }, ...params }
    if (controlPanel.isOpen()) {
        return controlPanel.getClockTime();
    }
    // time is a Date object
    return dateTimeToTimeObj(t);
}

const drawCp = () => {

    const template = `
    <h2>Controls</h2>


    <div><button onclick="controlPanel.decTime(this)" data-timekey="h">-</button><input type="number" value="${cpState.clockTime.h}" data-timekey="h" onchange="controlPanel.updateTime(this)" min=0 max=23 /><button onclick="controlPanel.incTime(this)" data-timekey="h">+</></div>
    <div><button onclick="controlPanel.decTime(this)" data-timekey="m">-</button><input type="number" value="${cpState.clockTime.m}" data-timekey="m" onchange="controlPanel.updateTime(this)" min=0 max=59 /><button onclick="controlPanel.incTime(this)" data-timekey="m">+</></div>
    <div><button onclick="controlPanel.decTime(this)" data-timekey="s">-</button><input type="number" value="${cpState.clockTime.s}" data-timekey="s" onchange="controlPanel.updateTime(this)" min=0 max=59 /><button onclick="controlPanel.incTime(this)" data-timekey="s">+</></div>
    <div><button onclick="controlPanel.decTime(this)" data-timekey="ms">-</button><input type="number" value="${cpState.clockTime.ms}" data-timekey="ms" onchange="controlPanel.updateTime(this)" min=0 max=999 step=100 /><button onclick="controlPanel.incTime(this)" data-timekey="ms">+</></div>
`
    cpState.panel.innerHTML = template;
}

const cpCreate = () => {
    if (cpState.panel) {
        console.warn('cPanel already exists', cpState.panel);
    }
    const cp = document.createElement('aside');
    cp.classList.add('control-panel');
    const body = document.querySelector('body').append(cp);
    cpState.panel = cp;
    drawCp();
}

const toggleControlPanel = () => {

    if (cpState.open) {
        cpState.panel.classList.add('open');
        controlPanel.toggleRunning(false);
        cancelAnimationFrame(ticker);
    } else {
        cpState.panel.classList.remove('open');
        controlPanel.toggleRunning(true);
        tick();
    }
}

const cpInit = (overrides) => {
    // need sanitation check on overrides?

    const defaults = {
        open: false,
        running: true,
        time: null,
        panel: null,
        callback: () => {
            console.warn('cpInit without callback for tick');
            setTimeout(()  => {}, 1000);
        },
    }
    cpState = { ...defaults, ...overrides };
    rangeFinder = rangeBuilder(cpState.is24hour);
    controlPanel.initClockTime();


    timeVals = [1000, 60, 60, (cpState.is24hour ? 24 : 12), 1]



    cpCreate();

    // start the first tick;
    tick();
}

const nextTime = (params) => {
    const { el, inc, abs } = params;
    let k = el.dataset.timekey;
    let now = { ...controlPanel.getClockTime() };
    let next = { ...controlPanel.getClockTime() };
    let nms;
    if (inc) {
        nms = now.milliseconds + (rangeFinder.ms[k] * inc);
    } else {
        next[k] = abs;
        nms = timeObjToMilliseconds(next);
    }
    next.milliseconds = nms;
    let nt = timeObjToDate(next);
    controlPanel.setClockTime(nt);
    cpState.callback();
}

const controlPanel = {
    isOpen: () => cpState.open,
    toggleOpen: (open) => {

        if(typeof(open) == 'boolean') {
            cpState.open = open ? open : !cpState.open;
        } else {
            cpState.open = !cpState.open;
        }
        toggleControlPanel(cpState.open);
    },
    isRunning : () => cpState.running,
    toggleRunning: (running) => { running ? running : !cpState.running; return cpState.running; },
    setTime: (params) => { cpState.time = (params) ? params : getClockTime() },
    getClockTime: () => cpState.clockTime,
    initClockTime: () => { cpState.clockTime = getClockTime(); return cpState.clockTime; },
    setClockTime: (t) => { cpState.clockTime = dateTimeToTimeObj(t); drawCp(); },
    updateTime: (el) => {
        nextTime({ el, abs: el.value })
    },
    incTime: (el) => {
        nextTime({ el, inc: 1 });
    },
    decTime: (el) => {
        nextTime({ el, inc: -1 });
    },
}

const tick = (frameTime) => {
    // console.log('tick', cpState.running);
    cpState.callback(frameTime);
    if(cpState.running) {
        ticker = requestAnimationFrame(tick);
    }
};




const hslToHex = (h, s, l) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');   // convert to Hex and prefix "0" if needed
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}


const crudeDate = (offset) => {
    let x = new Date();
    x.setTime(x.getTime() + (offset * 60 * 60 * 1000));
    return x;
}


const easeOutBounce = x => {
    const n1 = 7.5625;
    const d1 = 2.75;

    if (x < 1 / d1) {
        return n1 * x * x;
    } else if (x < 2 / d1) {
        return n1 * (x -= 1.5 / d1) * x + 0.75;
    } else if (x < 2.5 / d1) {
        return n1 * (x -= 2.25 / d1) * x + 0.9375;
    } else {
        return n1 * (x -= 2.625 / d1) * x + 0.984375;
    }
}

const easingFunctions = {
    'linear': x => x,
    'switch': x => ((x < 0.5) ? 0 : 1),
    'easeInOutBounce': x => {
        return x < 0.5
            ? (1 - easeOutBounce(1 - 2 * x)) / 2
            : (1 + easeOutBounce(2 * x - 1)) / 2;
    },
    'easeInQuart' : x => {
        return x * x * x * x;
    },
    easeInOutCubic : (x) => {
        return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    },
    easeOutBounce,
}