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
    let heightCm = null;
    let weightKg = null;

    // Synchronize base metric values on input
    heightInput.addEventListener('input', () => {
        const val = parseFloat(heightInput.value);
        if (isNaN(val)) {
            heightCm = null;
        } else {
            heightCm = currentUnits === 'metric' ? val : val * 2.54;
        }
    });

    weightInput.addEventListener('input', () => {
        const val = parseFloat(weightInput.value);
        if (isNaN(val)) {
            weightKg = null;
        } else {
            weightKg = currentUnits === 'metric' ? val : val / 2.205;
        }
    });

    const updateUIValues = () => {
        if (heightCm !== null) {
            heightInput.value = currentUnits === 'metric' ? 
                heightCm.toFixed(1) : (heightCm / 2.54).toFixed(1);
        }
        if (weightKg !== null) {
            weightInput.value = currentUnits === 'metric' ? 
                weightKg.toFixed(1) : (weightKg * 2.205).toFixed(1);
        }
    };

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
            updateUIValues();
        }
    });

    toggleImperial.addEventListener('click', () => {
        if (currentUnits === 'metric') {
            currentUnits = 'imperial';
            toggleImperial.classList.add('active');
            toggleMetric.classList.remove('active');
            heightUnit.textContent = 'in';
            weightUnit.textContent = 'lbs';
            heightInput.placeholder = '69';
            weightInput.placeholder = '154';
            updateUIValues();
        }
    });

    calcBtn.addEventListener('click', () => {
        if (heightCm === null || weightKg === null || heightCm <= 0 || weightKg <= 0) {
            alert('Please enter valid height and weight values.');
            return;
        }

        // Always calculate from base metric values for maximum precision
        const heightInMeters = heightCm / 100;
        const bmi = weightKg / (heightInMeters * heightInMeters);

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
        const rangeKey = category.toLowerCase().replace('weight', '');
        rows.forEach(row => {
            row.classList.remove('highlight-row');
            if (row.dataset.range === rangeKey) {
                row.classList.add('highlight-row');
            }
        });

        resultDisplay.classList.remove('hidden');
        resultDisplay.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
});
