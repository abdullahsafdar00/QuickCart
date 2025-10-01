const autocannon = require('autocannon');

const apis = [
    'http://hmelectronics.com/',
];

function runLoadTest(url) {
    return new Promise((resolve, reject) => {
        const instance = autocannon({
            url,
            connections: 10,  // 0 means unlimited connections
            duration: 300,    // duration in seconds
            method: 'GET',   // default method
            timeout: 10,     // timeout in seconds
            workers: 8,      // use 8 worker threads for maximum performance
            pipelining: 1    // number of pipelined requests
        }, (err, results) => {
            if (err) {
                reject(err);
                return;
            }
            resolve({ url, results });
        });

        autocannon.track(instance, {
            renderProgressBar: true,
            renderResultsTable: true,
            renderLatencyTable: true,
            renderStatusCodes: true
        });

        process.once('SIGINT', () => {
            instance.stop();
        });
    });
}

async function runAllTests() {
    console.log('Starting load tests for all APIs...\n');
    
    try {
        const results = await Promise.all(
            apis.map(api => runLoadTest(api))
        );

        console.log('\n=== FINAL RESULTS ===\n');
        results.forEach(({ url, results }) => {
            console.log(`\nResults for ${url}:`);
            console.log('  Requests/sec:', results.requests.average);
            console.log('  Latency (ms):', results.latency.average);
            console.log('  Throughput (MB/sec):', (results.throughput.average / 1024 / 1024).toFixed(2));
            console.log('  2xx:', results['2xx']);
            console.log('  Non 2xx:', results.non2xx);
        });

    } catch (error) {
        console.error('Error running load tests:', error);
    }
}

// Run all load tests
runAllTests();