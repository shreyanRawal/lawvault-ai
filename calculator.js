document.addEventListener('DOMContentLoaded', () => {
    const calculatorButtons = document.querySelectorAll('.calculator-button');
    const calculatorModal = document.getElementById('calculator-modal');
    const modalContent = document.getElementById('modal-calculator-content');
    const closeModal = document.querySelector('.close-modal');

    // ================================
    // Court Fee Calculator
    // ================================
    window.calculateCourtFee = () => {
        const caseAmount = parseFloat(document.getElementById('case-amount').value);
        let courtFee = 0;

        if (caseAmount <= 25000) {
            courtFee = 500;
        } else if (caseAmount <= 50000) {
            courtFee = caseAmount * 0.05;
        } else if (caseAmount <= 100000) {
            courtFee = caseAmount * 0.035;
        } else if (caseAmount <= 500000) {
            courtFee = caseAmount * 0.02;
        } else if (caseAmount <= 2500000) {
            courtFee = caseAmount * 0.015;
        } else {
            courtFee = caseAmount * 0.01;
        }

        document.getElementById('court-fee-result').innerHTML = `
            <p><strong>Case Amount:</strong> Rs. ${caseAmount.toFixed(2)}</p>
            <p><strong>Calculated Court Fee:</strong> Rs. ${courtFee.toFixed(2)}</p>
        `;
    };
    window.calculateLandTax = () => {
        const purchasePrice = parseFloat(document.getElementById('purchase-price').value);
        const salePrice = parseFloat(document.getElementById('sale-price').value);
        const registrationRate = parseFloat(document.getElementById('registration-rate').value);
    
        if (isNaN(purchasePrice) || isNaN(salePrice) || isNaN(registrationRate)) {
            document.getElementById('land-tax-result').innerHTML = `<p>Please fill all fields with valid numbers.</p>`;
            return;
        }
    
        const capitalGain = salePrice - purchasePrice;
        const capitalGainTax = capitalGain * 0.05; // 5% Capital Gain Tax
        const registrationFee = salePrice * (registrationRate / 100);
    
        document.getElementById('land-tax-result').innerHTML = `
            <p><strong>Capital Gain:</strong> Rs. ${capitalGain.toFixed(2)}</p>
            <p><strong>Capital Gain Tax (5%):</strong> Rs. ${capitalGainTax.toFixed(2)}</p>
            <p><strong>Registration Fee (${registrationRate}%):</strong> Rs. ${registrationFee.toFixed(2)}</p>
        `;
    };
    window.calculateMigrantCompensation = () => {
        const employmentType = document.getElementById("employment-type").value;
        const hasInsurance = document.getElementById("insurance-status").value;
        const isRegistered = document.getElementById("is-registered").checked;
    
        let compensation = 0;
        let message = "";
    
        if (!isRegistered) {
            message = "Compensation is not applicable as the migrant worker is not registered with the Foreign Employment Board.";
        } else {
            if (employmentType === "government") {
                compensation = 0;
                message = "Government employees are not covered under foreign employment compensation.";
            } else {
                if (hasInsurance === "yes") {
                    compensation = 700000; // e.g., amount defined by law in NPR
                    message = `The compensation amount for the deceased migrant worker is NPR ${compensation.toLocaleString()}.`;
                } else {
                    compensation = 300000; // Reduced if no insurance
                    message = `Since insurance was not available, compensation is limited to NPR ${compensation.toLocaleString()}.`;
                }
            }
        }
    
        document.getElementById("migrant-comp-result").innerHTML = `<p>${message}</p>`;
    };
    
    window.calculateCompanyRegFee = () => {
        const companyType = document.getElementById('company-type').value;
        const capital = parseFloat(document.getElementById('authorized-capital').value);
        let fee = 0;
    
        if (isNaN(capital) || capital <= 0) {
            document.getElementById('company-reg-fee-result').innerHTML = `<p>Please enter a valid capital amount.</p>`;
            return;
        }
    
        if (companyType === 'private') {
            if (capital <= 100000) {
                fee = 1000;
            } else if (capital <= 500000) {
                fee = 4500;
            } else if (capital <= 2500000) {
                fee = 9500;
            } else if (capital <= 10000000) {
                fee = 16000;
            } else if (capital <= 100000000) {
                fee = 16000 + Math.ceil((capital - 10000000) / 10000000) * 3000;
            } else {
                const baseFee = 16000 + (9 * 3000); // For first 10 crores
                const extraFee = Math.ceil((capital - 100000000) / 100000) * 30;
                fee = baseFee + extraFee;
            }
        } else if (companyType === 'public') {
            if (capital <= 10000000) {
                fee = 15000;
            } else if (capital <= 100000000) {
                fee = 40000;
            } else {
                const extraFee = Math.ceil((capital - 100000000) / 10000000) * 3000;
                fee = 40000 + extraFee;
            }
        } else if (companyType === 'non-profit') {
            fee = 15000;
        }
    
        document.getElementById('company-reg-fee-result').innerHTML = `
            <p><strong>Company Type:</strong> ${companyType.replace('-', ' ').toUpperCase()}</p>
            <p><strong>Authorized Capital:</strong> Rs. ${capital.toLocaleString()}</p>
            <p><strong>Estimated Registration Fee:</strong> Rs. ${fee.toLocaleString()}</p>
        `;
    };
    
    window.calculateGratuity = () => {
        const yearsServed = parseFloat(document.getElementById('years-served').value);
        const basicSalary = parseFloat(document.getElementById('basic-salary').value);
        const resultDiv = document.getElementById('gratuity-result');
    
        let resultHTML = '';
    
        if (isNaN(yearsServed) || yearsServed <= 0) {
            resultHTML = `<p style="color:red;">Please enter a valid number of years served.</p>`;
        } else if (isNaN(basicSalary) || basicSalary <= 0) {
            resultHTML = `<p style="color:red;">Please enter a valid basic salary.</p>`;
        } else {
            const gratuity = (yearsServed * basicSalary * 15) / 26;
    
            resultHTML = `
                <p><strong>Years of Service:</strong> ${yearsServed}</p>
                <p><strong>Basic Salary (incl. DA):</strong> Rs. ${basicSalary.toFixed(2)}</p>
                <p><strong>Gratuity Amount:</strong> Rs. ${gratuity.toFixed(2)}</p>
                <p><em>(Formula used: N × B × 15 ÷ 26)</em></p>
            `;
        }
    
        resultDiv.innerHTML = resultHTML;
    };
    
    window.calculateEmi = () => {
        const loanAmount = parseFloat(document.getElementById('loan-amount').value);
        const interestRate = parseFloat(document.getElementById('interest-rate').value);
        const tenureMonths = parseFloat(document.getElementById('loan-tenure').value);
        const resultDiv = document.getElementById('emi-result');
    
        let resultHTML = '';
    
        if (isNaN(loanAmount) || loanAmount <= 0) {
            resultHTML = `<p style="color:red;">Please enter a valid Loan Amount.</p>`;
        } else if (isNaN(interestRate) || interestRate <= 0) {
            resultHTML = `<p style="color:red;">Please enter a valid Interest Rate.</p>`;
        } else if (isNaN(tenureMonths) || tenureMonths <= 0) {
            resultHTML = `<p style="color:red;">Please enter a valid Loan Tenure in months.</p>`;
        } else {
            const monthlyRate = interestRate / (12 * 100);
            const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
                        (Math.pow(1 + monthlyRate, tenureMonths) - 1);
    
            const totalPayment = emi * tenureMonths;
            const totalInterest = totalPayment - loanAmount;
    
            resultHTML = `
                <p><strong>Monthly EMI:</strong> Rs. ${emi.toFixed(2)}</p>
                <p><strong>Total Interest:</strong> Rs. ${totalInterest.toFixed(2)}</p>
                <p><strong>Total Payment:</strong> Rs. ${totalPayment.toFixed(2)}</p>
            `;
        }
    
        resultDiv.innerHTML = resultHTML;
    };
    
    
    
    window.calculateVehicleTax = () => {
        const type = document.getElementById('vehicle-type').value;
        const engineValue = parseFloat(document.getElementById('engine-value').value);
        const yearsExpired = parseInt(document.getElementById('years-expired').value || '0');
        let tax = 0, renewal = 0, insurance = 0, fine = 0;
    
        if (type === '2w') {
            if (engineValue <= 125) tax = 3000;
            else if (engineValue <= 150) tax = 5000;
            else if (engineValue <= 225) tax = 6500;
            else if (engineValue <= 400) tax = 12000;
            else if (engineValue <= 650) tax = 25000;
            else tax = 35000;
            renewal = 300;
            if (engineValue <= 149) insurance = 1715;
            else if (engineValue <= 250) insurance = 1941;
            else insurance = 2167;
        } else if (type === '4w') {
            if (engineValue <= 1000) tax = 22000;
            else if (engineValue <= 1500) tax = 25000;
            else if (engineValue <= 2000) tax = 27000;
            else if (engineValue <= 2500) tax = 37000;
            else if (engineValue <= 3000) tax = 50000;
            else if (engineValue <= 3500) tax = 65000;
            else tax = 70000;
            renewal = 500;
            if (engineValue <= 1000) insurance = 7365;
            else if (engineValue <= 1600) insurance = 8495;
            else insurance = 10747;
        }
    
        fine = yearsExpired > 0 ? (tax * 0.32 * yearsExpired) : 0;
        const renewalFine = yearsExpired > 0 ? renewal : 0;
    
        const total = tax + (renewal * yearsExpired) + insurance + fine + renewalFine;
    
        document.getElementById('vehicle-tax-result').innerHTML = `
            <p><strong>Base Tax:</strong> Rs. ${tax}</p>
            <p><strong>Renewal Charges:</strong> Rs. ${renewal * yearsExpired}</p>
            <p><strong>Insurance:</strong> Rs. ${insurance}</p>
            <p><strong>Fine (if any):</strong> Rs. ${fine + renewalFine}</p>
            <p><strong>Total Payable:</strong> Rs. ${total}</p>
        `;
    };
        // House Rent Tax Calculator
    window.calculateHouseRentTax = () => {
        const rentIncome = parseFloat(document.getElementById('rent-income').value);
        let taxRate = 0;

        if (rentIncome <= 200000) {
            taxRate = 0.10;
        } else if (rentIncome <= 500000) {
            taxRate = 0.15;
        } else if (rentIncome <= 1000000) {
            taxRate = 0.20;
        } else {
            taxRate = 0.25;
        }

        const taxAmount = rentIncome * taxRate;

        document.getElementById('house-rent-tax-result').innerHTML = `
            <p><strong>Annual Rent Income:</strong> NPR ${rentIncome.toLocaleString()}</p>
            <p><strong>Tax Rate:</strong> ${taxRate * 100}%</p>
            <p><strong>Tax Amount:</strong> NPR ${taxAmount.toLocaleString()}</p>
        `;
    };


    

    // ================================
    // Income Tax Calculator (FY 2078/79)
    // ================================
    window.calculateIncomeTax = () => {
        const income = parseFloat(document.getElementById("income").value);
        const isCouple = document.getElementById("isCouple").checked;
        const isWomanWithOnlyRemunerationIncome = document.getElementById("isWomanWithOnlyRemunerationIncome").checked;
        const isPension = document.getElementById("isPension").checked;
        const isIncapacitated = document.getElementById("isIncapacitated").checked;
        const remoteAreaCategory = document.getElementById("remoteAreaCategory").value;
        const lifeInsurancePremium = parseFloat(document.getElementById("lifeInsurancePremium").value) || 0;
        const medicalInsurancePremium = parseFloat(document.getElementById("medicalInsurancePremium").value) || 0;
        const retirementContribution = parseFloat(document.getElementById("retirementContribution").value) || 0;
        const foreignTaxPaid = parseFloat(document.getElementById("foreignTaxPaid").value) || 0;
        const foreignIncome = parseFloat(document.getElementById("foreignIncome").value) || 0;
        const medicalExpenses = parseFloat(document.getElementById("medicalExpenses").value) || 0;

        let exemption = isCouple ? 450000 : 400000;

        if (isWomanWithOnlyRemunerationIncome) exemption *= 0.9;
        if (isPension) exemption += 500000;
        if (isIncapacitated) exemption += 500000;

        const remoteAreaDiscounts = {
            'A': 50000,
            'B': 40000,
            'C': 30000,
            'D': 20000,
            'E': 10000
        };

        if (remoteAreaDiscounts[remoteAreaCategory]) {
            exemption += remoteAreaDiscounts[remoteAreaCategory];
        }

        const maxLifeInsurance = Math.min(lifeInsurancePremium, 25000);
        const maxMedicalInsurance = Math.min(medicalInsurancePremium, 20000);
        const maxRetirementContribution = Math.min(retirementContribution, 300000);

        exemption += maxLifeInsurance + maxMedicalInsurance + maxRetirementContribution;

        let taxableIncome = Math.max(income - exemption, 0);
        let tax = 0;

        const brackets = [
            { limit: 100000, rate: 0.01 },
            { limit: 100000, rate: 0.10 },
            { limit: 200000, rate: 0.20 },
            { limit: Infinity, rate: 0.30 }
        ];

        if (isCouple) {
            brackets[0].limit = 100000;
            brackets[1].limit = 200000;
        }

        for (let i = 0; i < brackets.length && taxableIncome > 0; i++) {
            const slab = Math.min(taxableIncome, brackets[i].limit);
            tax += slab * brackets[i].rate;
            taxableIncome -= slab;
        }

        const socialSecurityTax = income * 0.01;
        const foreignTaxCredit = Math.min(foreignTaxPaid, foreignIncome * 0.15, tax);
        const finalTax = tax + socialSecurityTax - foreignTaxCredit;

        document.getElementById('income-tax-result').innerHTML = `
            <p><strong>Taxable Income:</strong> Rs ${income.toFixed(2)}</p>
            <p><strong>Total Tax:</strong> Rs ${tax.toFixed(2)}</p>
            <p><strong>Social Security Tax (1%):</strong> Rs ${socialSecurityTax.toFixed(2)}</p>
            <p><strong>Foreign Tax Credit:</strong> Rs ${foreignTaxCredit.toFixed(2)}</p>
            <p><strong>Final Tax Liability:</strong> Rs ${finalTax.toFixed(2)}</p>
        `;
    };

    // ================================
    // Modal Interactions
    // ================================
    calculatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            const calculatorType = button.dataset.calculator;

            if (calculatorType === 'court-fee') {
                modalContent.innerHTML = `
                    <h2>Court Fee Estimator</h2>
                    <form id="court-fee-form">
                        <label>Enter Case Amount:
                            <input type="number" id="case-amount" placeholder="Enter case amount" />
                        </label>
                        <button type="button" onclick="calculateCourtFee()">Estimate Fee</button>
                        <div id="court-fee-result"></div>
                    </form>
                `;
            }
            else if (calculatorType === 'emi') {
                modalContent.innerHTML = `
                    <h2>EMI Calculator</h2>
                    <form id="emi-form">
                        <label>Loan Amount:
                            <input type="number" id="loan-amount" placeholder="Enter loan amount" />
                        </label>
                        <label>Annual Interest Rate (%):
                            <input type="number" id="interest-rate" placeholder="e.g., 7.5" />
                        </label>
                        <label>Loan Tenure (in months):
                            <input type="number" id="loan-tenure" placeholder="e.g., 60 for 5 years" />
                        </label>
                        <button type="button" onclick="calculateEmi()">Calculate EMI</button>
                        <div id="emi-result" style="margin-top: 10px;"></div>
                    </form>
                `;
            if (calculatorType === 'foreign-employment-comp') {
                    modalContent.innerHTML = `
                        <h2>Foreign Employment Compensation Calculator</h2>
                        <form id="migrant-comp-form">
                            <label>Type of Employment:
                                <select id="employment-type">
                                    <option value="private">Private (Foreign Employment)</option>
                                    <option value="government">Government Employee</option>
                                </select>
                            </label><br><br>
                
                            <label>Was the worker insured?
                                <select id="insurance-status">
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </label><br><br>
                
                            <label>
                                <input type="checkbox" id="is-registered" />
                                Worker was registered with the Foreign Employment Board
                            </label><br><br>
                
                            <button type="button" onclick="calculateMigrantCompensation()">Calculate Compensation</button>
                            <div id="migrant-comp-result" style="margin-top: 10px;"></div>
                        </form>
                    `;
                }
                
            }
            else if (calculatorType === 'foreign-employment-comp') {
                modalContent.innerHTML = `
                    <h2>Foreign Employment Compensation Calculator</h2>
                    <form id="migrant-comp-form">
                        <label>Type of Employment:
                            <select id="employment-type">
                                <option value="private">Private (Foreign Employment)</option>
                                <option value="government">Government Employee</option>
                            </select>
                        </label><br><br>
            
                        <label>Was the worker insured?
                            <select id="insurance-status">
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </label><br><br>
            
                        <label>
                            <input type="checkbox" id="is-registered" />
                            Worker was registered with the Foreign Employment Board
                        </label><br><br>
            
                        <button type="button" onclick="calculateMigrantCompensation()">Calculate Compensation</button>
                        <div id="migrant-comp-result" style="margin-top: 10px;"></div>
                    </form>
                `;
            }
            
            else if (calculatorType === 'gratuity') {
                modalContent.innerHTML = `
                    <h2>Gratuity Calculator</h2>
                    <form id="gratuity-form">
                        <label>Years of Service:
                            <input type="number" id="years-served" placeholder="e.g., 5" />
                        </label>
                        <label>Basic Salary + DA (Monthly):
                            <input type="number" id="basic-salary" placeholder="e.g., 30000" />
                        </label>
                        <button type="button" onclick="calculateGratuity()">Calculate Gratuity</button>
                        <div id="gratuity-result" style="margin-top: 10px;"></div>
                    </form>
                `;
            }
            else if (calculatorType === 'land-tax') {
                modalContent.innerHTML = `
                    <h2>Land Registration & Capital Gain Tax Calculator</h2>
                    <form id="land-tax-form">
                        <label>Purchase Price:
                            <input type="number" id="purchase-price" placeholder="Enter purchase price" />
                        </label><br>
                        <label>Sale Price:
                            <input type="number" id="sale-price" placeholder="Enter sale price" />
                        </label><br>
                        <label>Registration Rate (%):
                            <input type="number" id="registration-rate" placeholder="E.g., 4.5" />
                        </label><br>
                        <button type="button" onclick="calculateLandTax()">Calculate</button>
                        <div id="land-tax-result" style="margin-top: 10px;"></div>
                    </form>
                `;
            }
            
            
            
            
            else if (calculatorType === 'vehicle-tax') {
                modalContent.innerHTML = `
                    <h2>Vehicle Tax Estimator</h2>
                    <form id="vehicle-tax-form">
                        <label>Vehicle Type:
                            <select id="vehicle-type">
                                <option value="2w">Two Wheeler</option>
                                <option value="4w">Four Wheeler</option>
                            </select>
                        </label>
                        <label>Engine Capacity (CC):
                            <input type="number" id="engine-value" placeholder="Enter CC value" />
                        </label>
                        <label>Years Expired (if any):
                            <input type="number" id="years-expired" placeholder="0" />
                        </label>
                        <button type="button" onclick="calculateVehicleTax()">Calculate</button>
                        <div id="vehicle-tax-result"></div>
                    </form>
                `;
            }
            else if (calculatorType === 'house-rent-tax') {
                modalContent.innerHTML = `
                    <h2>House Rent Tax Calculator</h2>
                    <form id="house-rent-tax-form">
                        <label>Enter Annual Rent Income:
                            <input type="number" id="rent-income" placeholder="e.g. 350000" />
                        </label>
                        <button type="button" onclick="calculateHouseRentTax()">Calculate Tax</button>
                        <div id="house-rent-tax-result"></div>
                    </form>
                `;
            }
            else if (calculatorType === 'company-reg-fee') {
                modalContent.innerHTML = `
                    <h2>Company Registration Fee Calculator</h2>
                    <form id="company-reg-form">
                        <label>Select Company Type:
                            <select id="company-type">
                                <option value="private">Private Limited</option>
                                <option value="public">Public Limited</option>
                                <option value="non-profit">Non-Profit Company</option>
                            </select>
                        </label>
                        <label>Enter Authorized Capital (NPR):
                            <input type="number" id="authorized-capital" placeholder="Enter amount in NPR" />
                        </label>
                        <button type="button" onclick="calculateCompanyRegFee()">Calculate Fee</button>
                        <div id="company-reg-fee-result"></div>
                    </form>
                `;
            }
            
            
    

            if (calculatorType === 'income-tax') {
                modalContent.innerHTML = `
                    <h2>Income Tax Calculator (FY 2078/79)</h2>
                    <form id="income-tax-form">
                        <label>Income: <input type="number" id="income" /></label><br>
                        <label><input type="checkbox" id="isCouple" /> Filing as Couple</label><br>
                        <label><input type="checkbox" id="isWomanWithOnlyRemunerationIncome" /> Woman with only remuneration</label><br>
                        <label><input type="checkbox" id="isPension" /> Pension Income</label><br>
                        <label><input type="checkbox" id="isIncapacitated" /> Incapacitated</label><br>
                        <label>Remote Area Category:
                            <select id="remoteAreaCategory">
                                <option value="">None</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                            </select>
                        </label><br>
                        <label>Life Insurance Premium: <input type="number" id="lifeInsurancePremium" /></label><br>
                        <label>Medical Insurance Premium: <input type="number" id="medicalInsurancePremium" /></label><br>
                        <label>Retirement Contribution: <input type="number" id="retirementContribution" /></label><br>
                        <label>Foreign Tax Paid: <input type="number" id="foreignTaxPaid" /></label><br>
                        <label>Foreign Income: <input type="number" id="foreignIncome" /></label><br>
                        <label>Medical Expenses: <input type="number" id="medicalExpenses" /></label><br>
                        <button type="button" onclick="calculateIncomeTax()">Calculate Tax</button>
                        <div id="income-tax-result"></div>
                    </form>
                `;
            }

            calculatorModal.style.display = 'block';
        });
    });

    closeModal.addEventListener('click', () => {
        calculatorModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === calculatorModal) {
            calculatorModal.style.display = 'none';
        }
    });
});
