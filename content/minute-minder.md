---
title: The Minute Minder
subheading: An LRG experimental tool
subtitle: Time keeps on ticking
description: "Ever wondered how much it costs your business for you to wait for your crappy laptop to load, or have you attend that pointless meeting? Well, now you can work it out!"

date: 2012-08-22
style: "classic experiments"
images: ["/images/minute-minder.jpg"]
tags:
 - app
 - calculator
 - work
 - time
---

Originally from one of my earlier instances of a personal website, I'm re-doing and re-posting it here, because my _God_ it's a perennially useful tool...

The idea is that small inconveniences can end up costing a significant chunk of money, and this calculator helps surface those costs. Perhaps it's a slow laptop, and you need to justify buying a new one. Perhaps it's rationalising how much time is being wasted in a regular, pointless meeting. 

:warning: But, be warned! With great power comes great responsibility. If you spend time making and drinking a cup of tea, just think about how much _that_ costs... and do you want it thrown in your face? (The cost, not the tea).

Use it how you will. All the calculations are performed in the page, and no data is sent anywhere, or otherwise captured for any reason. If you want to see the code, just view the source of this page.

{{< script >}}
<form id="mm-form" class="inline-app formica">
		<span class="loosey-goosey">
			<label for="workingYear">Typical working days per year:</label>
			<input id="workingYear" name="workingYear" type="number" value="220" />
		</span>
		<span>
			<label for="rate">Your rate:</label>
			<input id="rate" name="rate" type="number" value="300" />
			<label for="rateMeasure">per</label>
			<select id="rateMeasure" name="rateMeasure" >
				<option>Hour</option>
				<option selected>Day</option>
			</select>
		</span>
		<span>
			<label for="consumed">I spend</label>
			<input id="consumed" name="consumed" type="number" value="8" />
			<label for="consumedRate">of</label>
			<select id="consumedRate" name="consumedRate">
				<option selected>Minutes</option>
				<option >Hours</option>
			</select>
			<label for="frequency">Every</label>
			<select id="frequency" name="frequency">
				<option selected>Day</option>
				<option>Week</option>
				<option>Fortnight</option>
			</select>
		</span>
			<label for="task">Wasting time by</label>
			<input id="task" name="task" type="text" value="waiting for my laptop to boot" />
    <blockquote><output class="main-output success"></output></blockquote>
       </form>
    <script>
        const form = document.querySelector("#mm-form");
        const out = document.querySelector("#mm-form output");
        const frequencyMap = {
            Day: 8,
            Week: 40,
            Fortnight: 80
        };
        const consumedRateMap = {
            Minutes : 0.0166667,
            Hours : 1
        }
        const rateMeasureMap = {
            Hour : 1,
            Day : 0.125
        }
        const write = ({frequency, consumed, consumedRate, task, workingYear, rate, rateMeasure, cost}) => {
            return `Every ${frequency.toLowerCase()}, I spend around 
            ${consumed} ${consumedRate.toLowerCase()} ${task}. 
            Given that I typically work ${workingYear} days a year, 
            and my rate is £${rate}&nbsp;per&nbsp;${rateMeasure.toLowerCase()}, 
            I estimate that this is costing 
            <strong>£${cost}&nbsp;a&nbsp;year</strong>.
            `;
        }
        const costimate =  ({frequency, consumed, consumedRate, task, workingYear, rate, rateMeasure}) => {
            let perHour = (consumed * consumedRateMap[consumedRate]) / frequencyMap[frequency];
            let workingHours = workingYear * 8; // it's always an 8 hour day
            let taskTime = workingHours * perHour;
            let hourlyRate = rate * rateMeasureMap[rateMeasure];
            return hourlyRate * taskTime;
        }
        const calculate = () => {
            let formData = new FormData(form); 
            let o = Object.fromEntries(formData.entries());
            o.cost = costimate(o).toFixed(2);
            out.innerHTML = write(o);
        }
        form.addEventListener('change', (e) => {calculate()});
        calculate();
    </script>
{{< /script >}}




The Minute Minder is [completely free for you to use](https://creativecommons.org/publicdomain/zero/1.0/) - any way you like. It is certainly improvable :smile: