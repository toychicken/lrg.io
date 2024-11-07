
const sweepTime = (dividend, time, p, m, is24hour = false) => {

    // to calc ms in h, we do ms*s*m
    const keys = ['ms', 's', 'm', 'h', 'd']; // ascending order of size
    const vals = [1000,  60,  60,  (is24hour ? 24 : 12),  1];
    const s = keys.indexOf(p);
    const f = keys.indexOf(m);
    
    const vArr = vals.slice(s,f);
    const kArr = keys.slice(s,f);
    const pInM = vArr.reduce((c,n) => { return c * n }); // our total p in m

    // get deg would be 360 / time

    let currentP = 0;
    kArr.forEach((k, ind) => {
        // if the key is the same as p, we don't need to multiply it, it's already correct.



        let timek = 0;

        if(k === p) {
            // just add this to currentP
            timek = time[k];
        } else {
            const sArr = vArr.slice(0,ind);
            const sss = sArr.reduce((c, n) => {
                return c * n
            })
            timek = sss * time[k];
        }
        currentP = currentP + timek;
        // console.log(`k = ${k}, p = ${p}, timek = ${timek} | currentP = ${currentP}`)
    });

    const out = (dividend / pInM) * currentP;

    // console.log(`(dividend / pInM) = (${dividend} / ${pInM}) * ${currentP} = ${out}`, JSON.stringify(kArr), JSON.stringify(vArr), s, f, JSON.stringify(time))

    return out;

}

const getClockTime = (t = new Date(), is24hour = false) => {

    // time is a Date object
    const time = {
        ms : t.getMilliseconds(),
        s : t.getSeconds(),
        m : t.getMinutes(),
        h : is24hour ? t.getHours() : t.getHours()%12,
    }
    return time;
}


const timeToOtherThings = (t, is24hour = false) => {
    // time is a Date object
    const time = {
        ms : t.getMilliseconds(),
        s : t.getSeconds(),
        m : t.getMinutes(),
        h : t.getHours(),
    }

    return {
        time,
        deg: {
            ms : (360/1000) * time.ms, // milliseconds in the current second
            s : (360/60) * time.s, // seconds in the current minute
            msm : (360/60000) * ((time.s * 1000) + time.ms), // milliseconds in the current minute (for sweeping hands)
            m : (360/60) * time.m, // minutes in the current hour
            sh: (360/3600) * ((time.m * 60) + time.s), // seconds in the current hour (for sweeping hands)
            h : is24hour ? (360/24) * time.h : (360/12) * (time.h%12), // hours in the current day
            md: (360/720) * ((time.h%12 * 12) + time.m)
        },
        perc: {
            ms : (100/1000) * time.ms,
            s : (100/60) * time.s,
            msm : (100/60000) * ((time.s * 1000) + time.ms), // milliseconds in the current minute
            m : (100/60) * time.m,
            sh: (100/3600) * ((time.m * 60) + time.s), // seconds in the current hour (for sweeping hands)
            h : is24hour ? (100/24) * time.h : (100/12) * (time.h%12)
        }
    }
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