const http = require('http');

// Simple health check test
function testHealthCheck() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000/api/health', (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    if (response.status === 'success') {
                        console.log('✅ Health check passed');
                        resolve(true);
                    } else {
                        console.log('❌ Health check failed');
                        reject(false);
                    }
                } catch (error) {
                    console.log('❌ Invalid response format');
                    reject(error);
                }
            });
        });

        req.on('error', (error) => {
            console.log('❌ Health check request failed:', error.message);
            reject(error);
        });

        req.setTimeout(5000, () => {
            req.abort();
            reject(new Error('Request timeout'));
        });
    });
}

// Test database connection
function testDatabaseConnection() {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000/api/products', (res) => {
            if (res.statusCode === 200) {
                console.log('✅ Database connection test passed');
                resolve(true);
            } else {
                console.log('❌ Database connection test failed');
                reject(false);
            }
        });

        req.on('error', (error) => {
            console.log('❌ Database test failed:', error.message);
            reject(error);
        });

        req.setTimeout(5000, () => {
            req.abort();
            reject(new Error('Request timeout'));
        });
    });
}

// Run tests
async function runTests() {
    console.log('🚀 Running EcoFinds tests...\n');
    
    try {
        await testHealthCheck();
        await testDatabaseConnection();
        console.log('\n🎉 All tests passed! EcoFinds is working correctly.');
        process.exit(0);
    } catch (error) {
        console.log('\n❌ Tests failed:', error.message);
        console.log('\nMake sure the server is running with: npm start');
        process.exit(1);
    }
}

runTests();
