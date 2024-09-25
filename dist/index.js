const QATouch  = require('./qatouch.js');
require('dotenv').config()

const options= {
    'domain' : process.env.QATOUCH_DOMAIN,
    'apiToken': process.env.QATOUCH_API_TOKEN,
    'projectKey': process.env.QATOUCH_PROJECT_KEY,
    'testRunId': process.env.QATOUCH_TESTRUN_ID
};
class QATouchReporter {
    qaTouch = new QATouch(options);
    results = [];

   onBegin(config, suite) {
        console.log(`Starting the run with ${suite.allTests().length} tests`);
    }

    onTestBegin(test, result) {
        console.log(`Starting test ${test.title}`);
    }

    onTestEnd(test, result) {
        if (result.status === 'passed') {
            const status_id = this.qaTouch.statusConfig('Passed');
            const caseIds = this.qaTouch.TitleToCaseIds(test.title);

            if (caseIds.length > 0) {
                const results = caseIds.map(caseId => ({
                    case_id: caseId,
                    status_id: status_id,
                }));
                this.results.push(...results);
            }
        }
        else if (result.status === 'failed') {
            const status_id = this.qaTouch.statusConfig('Failed');
            const caseIds = this.qaTouch.TitleToCaseIds(test.title);

            if (caseIds.length > 0) {
                const results = caseIds.map(caseId => ({
                    case_id: caseId,
                    status_id: status_id,
                }));
                this.results.push(...results);
            }

        }
        else if (result.status === 'skipped') {
            const status_id = this.qaTouch.statusConfig('Untested');
            const caseIds = this.qaTouch.TitleToCaseIds(test.title);

            if (caseIds.length > 0) {
                const results = caseIds.map(caseId => ({
                    case_id: caseId,
                    status_id: status_id,
                }));
                this.results.push(...results);
            }

        }
       console.log(`Finished test ${test.title}: ${result.status}`);
    }

    onEnd(result) {
        console.log(`Finished the run: ${result.status}`);
        if (this.results.length === 0) {
            console.warn("No test cases were matched. Ensure that your tests are declared correctly and matches TRxxx");
            return;
        }
        this.qaTouch.publish(this.results);
    }
}

module.exports = QATouchReporter;