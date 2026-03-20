document.addEventListener('DOMContentLoaded', () => {
    const heightInput = document.getElementById('height');
    const weightInput = document.getElementById('weight');
    const calcBtn = document.getElementById('calculate-btn');
    const resultDisplay = document.getElementById('result-display');
    const bmiScoreDisplay = document.getElementById('bmi-score');
    const bmiCategoryDisplay = document.getElementById('bmi-category');
    const gaugeNeedle = document.getElementById('gauge-needle');
    const statusDot = document.getElementById('status-dot');
    
    const toggleMetric = document.getElementById('toggle-metric');
    const toggleImperial = document.getElementById('toggle-imperial');
    const heightUnit = document.getElementById('height-unit');
    const weightUnit = document.getElementById('weight-unit');

    let currentUnits = 'metric';

    // Unit toggle logic
    toggleMetric.addEventListener('click', () => {
        if (currentUnits === 'imperial') {
            currentUnits = 'metric';
            toggleMetric.classList.add('active');
            toggleImperial.classList.remove('active');
            heightUnit.textContent = 'cm';
            weightUnit.textContent = 'kg';
            heightInput.placeholder = '175';
            weightInput.placeholder = '70';
            // Convert existing values if any
            if (heightInput.value) heightInput.value = (heightInput.value * 30.48 / 1).toFixed(1);
            if (weightInput.value) weightInput.value = (weightInput.value / 2.205).toFixed(1);
        }
    });

    toggleImperial.addEventListener('click', () => {
        if (currentUnits === 'metric') {
            currentUnits = 'imperial';
            toggleImperial.classList.add('active');
            toggleMetric.classList.remove('active');
            heightUnit.textContent = 'in'; // Simplified for slider/input
            weightUnit.textContent = 'lbs';
            heightInput.placeholder = '69';
            weightInput.placeholder = '154';
            // Convert existing values if any
            if (heightInput.value) heightInput.value = (heightInput.value / 2.54).toFixed(1);
            if (weightInput.value) weightInput.value = (weightInput.value * 2.205).toFixed(1);
        }
    });

    calcBtn.addEventListener('click', () => {
        const height = parseFloat(heightInput.value);
        const weight = parseFloat(weightInput.value);

        if (!height || !weight || height <= 0 || weight <= 0) {
            alert('Please enter valid height and weight values.');
            return;
        }

        let bmi;
        if (currentUnits === 'metric') {
            // BMI = kg / m^2
            const heightInMeters = height / 100;
            bmi = weight / (heightInMeters * heightInMeters);
        } else {
            // BMI = 703 * lbs / in^2
            bmi = 703 * weight / (height * height);
        }

        displayResult(bmi);
    });

    function displayResult(bmi) {
        const score = bmi.toFixed(1);
        bmiScoreDisplay.textContent = score;

        let category = '';
        let color = '';
        let percentage = 0;

        if (bmi < 18.5) {
            category = 'Underweight';
            color = '#a371f7';
            percentage = Math.min((bmi / 18.5) * 18.5, 18.5); // Map to 0-18.5%
        } else if (bmi < 25) {
            category = 'Normal Weight';
            color = '#3fb950';
            percentage = 18.5 + ((bmi - 18.5) / 6.5) * (25 - 18.5); // Map to 18.5-25%
        } else if (bmi < 30) {
            category = 'Overweight';
            color = '#d29922';
            percentage = 25 + ((bmi - 25) / 5) * (30 - 25); // Map to 25-30%
        } else {
            category = 'Obese';
            color = '#f85149';
            percentage = Math.min(30 + ((bmi - 30) / 10) * 70, 100); // Map to 30-100%
        }

        bmiCategoryDisplay.textContent = category;
        bmiCategoryDisplay.style.color = color;
        statusDot.style.background = color;
        statusDot.style.boxShadow = `0 0 8px ${color}`;
        gaugeNeedle.style.left = `${percentage}%`;

        // Highlight relevant row in table
        const rows = document.querySelectorAll('.who-table tbody tr');
        rows.forEach(row => {
            row.classList.remove('highlight-row');
            if (row.dataset.range === category.toLowerCase().split(' ')[0]) {
                row.classList.add('highlight-row');
            }
        });

        resultDisplay.classList.remove('hidden');
        resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
