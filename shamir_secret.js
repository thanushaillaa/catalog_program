const fs = require('fs');

// Read JSON files
const testFiles = ['input1.json', 'input2.json'];

function readAndProcessJson(file) {
    const rawData = fs.readFileSync(file);
    const jsonData = JSON.parse(rawData);

    const n = jsonData.keys.n;
    const k = jsonData.keys.k;
    let points = [];

    // Decode Y values from different bases
    for (const key in jsonData) {
        if (key !== "keys") {
            const x = parseInt(key, 10);
            const base = parseInt(jsonData[key].base, 10);
            const y = BigInt(parseInt(jsonData[key].value, base));
            points.push([BigInt(x), y]);
        }
    }

    // Find the constant term using Lagrange interpolation
    return lagrangeInterpolation(points, k);
}

// Lagrange Interpolation to find the constant term
function lagrangeInterpolation(points, k) {
    let result = 0n;
    for (let i = 0; i < k; i++) {
        let [xi, yi] = points[i];
        let term = yi;
        
        for (let j = 0; j < k; j++) {
            if (i !== j) {
                let [xj, _] = points[j];
                term *= -xj / (xi - xj);
            }
        }
        result += term;
    }
    return result;
}

// Process both test cases
const secrets = testFiles.map(file => readAndProcessJson(file));

// Print the results
console.log("Secrets (constant terms) for both test cases:", secrets.map(secret => secret.toString()).join(", "));
