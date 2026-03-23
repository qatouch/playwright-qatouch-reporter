"use strict";

const request = require('sync-request');
const fs = require("fs");

class QATouch {
    constructor(options) {
        this.options = options;
        this.base = 'https://api.qatouch.com/api/v1/';
    }

    _url(path) {
        return `${this.base}${path}`;
    }

    publish(results, error = undefined) {

        let finalArray = results.map(r => {

            let attachments = [];

            if (r.attachments && Array.isArray(r.attachments)) {
                r.attachments.forEach(file => {
                    
// console.log("Processing attachment:", file);
                    if (!file.path || !file.path.toLowerCase().endsWith('.png')) {
                        return;
                    }

                    try {
                        let binary = fs.readFileSync(file.path);

                        attachments.push({
                            name: file.name,
                            contentType: 'image/png',
                            content: binary.toString('base64')
                        });
                    } catch (e) {
                        console.log("Attachment read failed:", file.path);
                    }
                });
            }

            return {
                case: r.case_id,
                status: r.status_id,
                execution_time:  this.formatExecutionTime(r.execution_time || 0),
                comments: 'Executed via Playwright Automation - ' + 
                (r.testedBy ? r.testedBy.charAt(0).toUpperCase() + r.testedBy.slice(1) : '') + 
                ' Browser Status',                description: r.description || '',
                attachments: attachments
            };
        });

        const chunkSize = 5;
        // console.log(finalArray);
        // return;

        for (let i = 0; i < finalArray.length; i += chunkSize) {

            const chunk = finalArray.slice(i, i + chunkSize);

            let configure = {
                headers: {
                    "api-token": this.options.apiToken,
                    "domain": this.options.domain,
                    "Content-Type": "application/json"
                },
                json: {
                    project: this.options.projectKey,
                    test_run: this.options.testRunId,
                    result: JSON.stringify(chunk)                }
            };

            try {
                let res = request("POST", this._url("testRunResults/playwright/status/multiple"), configure);

                let result = JSON.parse(res.getBody('utf8'));

                if (result.error) {
                    if (error) {
                        error(result.error);
                    } else {
                        throw new Error(result.error);
                    }
                }

            } catch (err) {
                console.error("Chunk failed:", err.message);
                if (error) {
                    error(err.message);
                } else {
                    throw err;
                }
            }
        }
    }

     formatExecutionTime(time) {
        if (!time) return '0ms';
    
        if (time < 1) {
            return Math.round(time * 1000) + 'ms';
        } else {
            return time.toFixed(1) + 's';
        }
    }

    statusConfig(status) {
        switch (status) {
            case 'Passed': return 1;
            case 'Untested': return 2;
            case 'Blocked': return 3;
            case 'Retest': return 4;
            case 'Failed': return 5;
            case 'Not Applicable': return 6;
            case 'In Progress': return 7;
            default: return 2;
        }
    }

    TitleToCaseIds(title) {
        let caseIds = [];
        let regex = /\bTR(\d+)\b/g;
        let m;
        while ((m = regex.exec(title)) !== null) {
            caseIds.push(parseInt(m[1]));
        }
        return caseIds;
    }
}

module.exports = QATouch;