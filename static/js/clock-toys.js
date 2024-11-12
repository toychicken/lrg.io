let timeKeys = ['ms', 's', 'm', 'h', 'd']; // ascending order of size
let timeVals = [];

// help with conversion :)
let tt = {
    ms :    {ms: 1,                s: 1000,       m : 60*1000,   h : 60*60*1000,    d : 24*60*60*1000 },
    s :     {ms: 1/1000,           s: 1,          m : 60,        h : 60*60,         d : 24*60*60 },
    m :     {ms: 1/60/1000,        s: 1/60,       m : 1,         h : 60,            d : 24*60 },
    h :     {ms: 1/60/60/1000,     s: 1/60/60,    m : 1/60,      h : 1,             d : 24 },
    d :     {ms: 1/24/60/60/1000,  s: 1/24/60/60, m : 1/24/60,   h : 1/24,          d : 1 },
}


/**
 * 
 * Why I'm an idiot
 * 
 * Basically the output for sweep time is alway 1 / time - i.e.
 * 
 * If I'm mapping 360º around a clock, say for a minute hand, the value I need back is a linear 
 * conversion of 60 / 360 = seconds per minute / degrees in circle
 * 
 * So, for any given degree on that circle I need a value between 0 - 1 , to multiply by 360 to 
 * get the posittion of tthe second hand
 * 
 * e.g. at 00m05 seconds, my hand has travelled 5/60ths of it's journey -  0.08333 = l
 * 
 * Multiply  360 * l = 30º (well 29.9998888 in JS, sigh)
 * 
 * This now makes it easy to convert with a bounce and easing functions, because the value of l is
 * always 0-1
 * 
 * 
 * 
 * So, when I'm doing a sweeptime calculation, I don't really _care_ what the dividend is, just the 
 * 
 *      timeObj (because I want to be able to arbitrarily define the time)
 *      parva   - the granularity of the calculation, from the 
 *      magna   - the _scope_ of the calculation
 *      easing  - the easing function (see easings.net)
 *      bounce  - whether or not it's a 'clock' function with a tickover from 1, to 0, or a reverse...
 * 
 * NOW, if I'm using the same params, I only have to do the function once...
 * 
 */







const sweepTime = (params) => {

    const {
        dividend,
        timeObj, 
        p,
        m,
        easing,
        bounce,
    } = {...{
        easing : 'linear',
        bounce : false,
    }, ...params};

    // to calc ms in h, we do ms*s*m
    const s = timeKeys.indexOf(p);
    const f = timeKeys.indexOf(m);

    const vArr = timeVals.slice(s, f);
    const kArr = timeKeys.slice(s, f);
    const pInM = vArr.reduce((c, n) => { return c * n }); // our total p in m

    // get deg would be 360 / time

    let currentP = 0;
    kArr.forEach((k, ind) => {
        // if the key is the same as p, we don't need to multiply it, it's already correct.
        let timek = 0;
        if (k === p) {
            // just add this to currentP
            timek = timeObj[k];
        } else {
            const sArr = vArr.slice(0, ind);
            const sss = sArr.reduce((c, n) => {
                return c * n
            })
            timek = sss * timeObj[k];
        }
        currentP = currentP + timek;
        // console.log(`k = ${k}, p = ${p}, timek = ${timek} | currentP = ${currentP}`)
    });
    let out;
    if(bounce) {
        out = Math.abs(easingFunctions[easing]((dividend / pInM) * currentP) - (dividend /2)) * 2;
    } else {
        out = easingFunctions[easing]((dividend / pInM) * currentP);
    }

    // console.log(`(dividend / pInM) = (${dividend} / ${pInM}) * ${currentP} = ${out}`, JSON.stringify(kArr), JSON.stringify(vArr), s, f, JSON.stringify(time))

    return out;

}


let cpState = {};

const dateTimeToTimeObj = (t) => {

    const tob = {
        ms: t.getMilliseconds(),
        s: t.getSeconds(),
        m: t.getMinutes(),
        h: cpState.is24hour ? t.getHours() : t.getHours() % 12,
    }
    const milliseconds = (tt.ms.ms * tob.ms) + (tt.ms.s * tob.s) + (tt.ms.m * tob.m) + (tt.ms.h * tob.h);
    const zeroHour = t.getTime() - milliseconds;
    return {
        ...tob,
        milliseconds,
        zeroHour
    }
}

const timeObjToMilliseconds = (tob) => {
    return (tt.ms.ms * tob.ms) + (tt.ms.s * tob.s) + (tt.ms.m * tob.m) + (tt.ms.h * tob.h);
}

const timeObjToDate = (tob) => {
    return new Date((tob.zeroHour + tob.milliseconds));
}

const getClockTime = (params) => {

    let {t} = {...{ t: new Date() }, ...params}
    if(controlPanel.isOpen()) {
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
    if(cpState.panel) {
        console.warn('cPanel already exists', cpState.panel);
    }
    const cp = document.createElement('aside');
    cp.classList.add('control-panel');
    const body = document.querySelector('body').append(cp);
    cpState.panel = cp;
    drawCp();
}

const toggleControlPanel = (open) => {

    controlPanel.toggleOpen(open);
    console.log(controlPanel.isOpen());
    if(cpState.open) {
        cpState.panel.classList.add('open');
    } else {
        cpState.panel.classList.remove('open');
    }
}

const cpInit = (overrides) => {
    // need sanitation check on overrides?

    const defaults = {
        open : false,
        time : null,
        panel : null,
    }
    cpState = {...defaults, ...overrides};
    controlPanel.initClockTime();


    timeVals = [1000, 60, 60, (cpState.is24hour ? 24 : 12), 1]



    cpCreate();
}

const nextTime = (params) => {
    const { el, inc, abs } = params;
    let k = el.dataset.timekey;
    let now = {...controlPanel.getClockTime()};
    let next = {...controlPanel.getClockTime()};
    let nms;
    if(inc) {
        nms = now.milliseconds + (tt.ms[k] * inc);
    } else {
        next[k] = abs;
        nms = timeObjToMilliseconds(next);
    }
    next.milliseconds = nms;
    let nt = timeObjToDate(next);
    controlPanel.setClockTime(nt);     
}

const controlPanel = {
    isOpen : () => cpState.open,
    toggleOpen : (open) => { cpState.open = (open) ? open : !cpState.open; return cpState.open; },
    setTime: (params) => { cpState.time = (params) ? params : getClockTime() },
    getClockTime: () => cpState.clockTime,
    initClockTime: () => { cpState.clockTime = getClockTime(); return cpState.clockTime; },
    setClockTime: (t) => { cpState.clockTime = dateTimeToTimeObj(t); drawCp();},
    updateTime: (el) => {
        nextTime({el, abs: el.value})
    },
    incTime: (el) => {
        nextTime({el, inc: 1});
    },
    decTime: (el) => {
        nextTime({el, inc: -1});
    },
}

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

const easingFunctions = {
    'linear' : x => x,
}