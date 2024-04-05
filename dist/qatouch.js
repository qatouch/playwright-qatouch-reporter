"use strict";

const request = require('sync-request')

class QATouch {
    constructor(options) {
        this.options = options;
        this.base = 'https://api.qatouch.com/api/v1/';
    }

    _url(path) {
        return `${this.base}${path}`;
    }

    publish(results,error=undefined) {
        let finalArray = this.addResultsForTestRun(results);
        let endPoint = `testRunResults/status/multiple?project=${this.options.projectKey}&test_run=${this.options.testRunId}&result=${JSON.stringify(finalArray)}&comments=Status changed by playwright automation script.`;
        let configure = {
            headers: {
                "api-token": this.options.apiToken,
                "domain": this.options.domain,
                "Content-Type": "application/json"
            },
        };

        let result = request("PATCH", this._url(endPoint), configure);
        result = JSON.parse(result.getBody('utf8'));
        if (result.error) {
            if (error) {
                error(result.error);
            } else {
                throw new Error(result.error);
            }
        }
    }

    addResultsForTestRun(results) {
        let result = [];
        results.forEach(function (value, item) {
            result.push({
                'case': value.case_id,
                'status': value.status_id,
            });
        });
        return result;
    }

    statusConfig(status) {
        let statusId = 2;
        switch (status) {
            case 'Passed':
                statusId = 1;
                break;
            case 'Untested':
                statusId = 2;
                break;
            case 'Blocked':
                statusId = 3;
                break;
            case 'Retest':
                statusId = 4;
                break;
            case 'Failed':
                statusId = 5;
                break;
            case 'Not Applicable':
                statusId = 6;
                break;
            case 'In Progress':
                statusId = 7;
                break;
            default:
                statusId = 2;
        }
        return statusId;
    }

    TitleToCaseIds(title) {
        let caseIds = [];
        let testCaseIdRegExp = /\bTR(\d+)\b/g;
        let m;
        while((m = testCaseIdRegExp.exec(title)) !== null) {
            let caseId = parseInt(m[1]);
            caseIds.push(caseId);
        }
        return caseIds;
    }
}

module.exports = QATouch;
