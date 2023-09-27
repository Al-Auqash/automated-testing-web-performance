import puppeteer from 'puppeteer';
import lighthouse from 'lighthouse';
import ExcelJS from 'exceljs';
import * as fse from 'fs-extra';

const pages = [
    {
        name: "SARA Dashboard Test 1",
        url: "http://10.1.151.82:3000/index.php/employeeadmin-new/",
        headers: {
            'Authorization': 'ci_session=71106cd6d5543d729a606d8672293302ccde2f3e',
        }
    },
    {
        name: "SARA Dashboard Test 2",
        url: "http://10.1.151.82:3000/index.php/employeeadmin-new/",
        headers: {
            'Authorization': 'ci_session=71106cd6d5543d729a606d8672293302ccde2f3e',
        }
    },
    {
        name: "SARA Dashboard Test 3",
        url: "http://10.1.151.82:3000/index.php/employeeadmin-new/",
        headers: {
            'Authorization': 'ci_session=71106cd6d5543d729a606d8672293302ccde2f3e',
        }
    },
    {
        name: "SARA Dashboard Test 4",
        url: "http://10.1.151.82:3000/index.php/employeeadmin-new/",
        headers: {
            'Authorization': 'ci_session=71106cd6d5543d729a606d8672293302ccde2f3e',
        }
    },
    {
        name: "SARA Dashboard Test 5",
        url: "http://10.1.151.82:3000/index.php/employeeadmin-new/",
        headers: {
            'Authorization': 'ci_session=71106cd6d5543d729a606d8672293302ccde2f3e',
        }
    },
];

const standardValues = {
    lcp: 2500,
    fid: 100,
    cls: 0.1,
    tti: 3800,
    fcp: 2000,
    speedIndex: 4200,
    tbt: 200,
};

const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('Lighthouse Metrics');

worksheet.columns = [
    { header: 'Name', key: 'name', width: 30 },
    { header: 'URL', key: 'url', width: 50 },
    { header: 'LCP', key: 'lcp', width: 15 },
    { header: 'Standard LCP', key: 'standard_lcp', width: 15 },
    { header: 'Difference LCP', key: 'difference_lcp', width: 20 },
    { header: 'LCP Suggestion', key: 'lcp_suggestion' },
    { header: 'FID', key: 'fid', width: 15 },
    { header: 'Standard FID', key: 'standard_fid', width: 15 },
    { header: 'Difference FID', key: 'difference_fid', width: 20 },
    { header: 'FID Suggestion', key: 'fid_suggestion' },
    { header: 'CLS', key: 'cls', width: 15 },
    { header: 'Standard CLS', key: 'standard_cls', width: 15 },
    { header: 'Difference CLS', key: 'difference_cls', width: 20 },
    { header: 'CLS Suggestion', key: 'cls_suggestion' },
    { header: 'TTI', key: 'tti', width: 15 },
    { header: 'Standard TTI', key: 'standard_tti', width: 15 },
    { header: 'Difference TTI', key: 'difference_tti', width: 20 },
    { header: 'TTI Suggestion', key: 'tti_suggestion' },
    { header: 'FCP', key: 'fcp', width: 15 },
    { header: 'Standard FCP', key: 'standard_fcp', width: 15 },
    { header: 'Difference FCP', key: 'difference_fcp', width: 20 },
    { header: 'FCP Suggestion', key: 'fcp_suggestion' },
    { header: 'Speed Index', key: 'speedIndex', width: 15 },
    { header: 'Standard Speed Index', key: 'standard_speedIndex', width: 20 },
    { header: 'Difference Speed Index', key: 'difference_speedIndex', width: 25 },
    { header: 'Speed Index Suggestion', key: 'speedIndex_suggestion' },
    { header: 'TBT', key: 'tbt', width: 15 },
    { header: 'Standard TBT', key: 'standard_tbt', width: 15 },
    { header: 'Difference TBT', key: 'difference_tbt', width: 20 },
    { header: 'TBT Suggestion', key: 'tbt_suggestion' }
];

async function generate_matrics_details(metric_details) {
    console.log(metric_details);
    let description = ""
    if (metric_details != undefined) {
        switch (metric_details.type) {
            case 'opportunity':
                for (const item of metric_details.items) {
                    description += item
                }
                break;
            case 'table':
                for (const item of metric_details.items) {
                    description += item
                }
                break;
            case 'criticalrequestchain':
                description = chains
                break;
            case 'debugData':
                for (const item of metric_details.items) {
                    description += item
                }
                break;
            case 'list':
                for (const item of metric_details.items) {
                    description += item
                }
            default:
                description = "detail type supported"
        }
    }
    return description
}

async function authenticatePage(browser, headers) {
    const page = await browser.newPage();
    // await page.setViewport({ width: 1280, height: 800 });
    await page.setExtraHTTPHeaders(headers);
    return page;
}

async function generate_matrics_rows(page, audits) {
    console.log(audits)
    return {
        name: page.name,
        url: page.url,
        lcp: parseFloat(audits['largest-contentful-paint']?.numericValue?.toFixed(2)),
        standard_lcp: standardValues.lcp,
        difference_lcp: parseFloat((audits['largest-contentful-paint']?.numericValue - standardValues.lcp).toFixed(2)),
        lcp_suggestion: generate_matrics_details(audits['largest-contentful-paint'].details),
        fid: parseFloat(audits['max-potential-fid']?.numericValue?.toFixed(2)),
        standard_fid: standardValues.fid,
        difference_fid: parseFloat((audits['max-potential-fid']?.numericValue - standardValues.fid).toFixed(2)),
        fid_suggestion: generate_matrics_details(audits['max-potential-fid'].details),
        cls: parseFloat(audits['cumulative-layout-shift']?.numericValue?.toFixed(2)),
        standard_cls: standardValues.cls,
        difference_cls: parseFloat((audits['cumulative-layout-shift']?.numericValue - standardValues.cls).toFixed(2)),
        cls_suggestion: generate_matrics_details(audits['cumulative-layout-shift'].details),
        tti: parseFloat(audits['interactive']?.numericValue?.toFixed(2)),
        standard_tti: standardValues.tti,
        difference_tti: parseFloat((audits['interactive']?.numericValue - standardValues.tti).toFixed(2)),
        tti_suggestion: generate_matrics_details(audits['interactive'].details),
        fcp: parseFloat(audits['first-contentful-paint']?.numericValue?.toFixed(2)),
        standard_fcp: standardValues.fcp,
        difference_fcp: parseFloat((audits['first-contentful-paint']?.numericValue - standardValues.fcp).toFixed(2)),
        fcp_suggestion: generate_matrics_details(audits['first-contentful-paint'].details),
        speedIndex: parseFloat(audits['speed-index']?.numericValue?.toFixed(2)),
        standard_speedIndex: standardValues.speedIndex,
        difference_speedIndex: parseFloat((audits['speed-index']?.numericValue - standardValues.speedIndex).toFixed(2)),
        speedIndex_suggestion: generate_matrics_details(audits['speed-index'].details),
        tbt: parseFloat(audits['total-blocking-time']?.numericValue?.toFixed(2)),
        standard_tbt: standardValues.tbt,
        difference_tbt: parseFloat((audits['total-blocking-time']?.numericValue - standardValues.tbt).toFixed(2)),
        tbt_suggestion: generate_matrics_details(audits['total-blocking-time'].details)
    }
}

async function lighthouseAudit(pageObj) {
    const browser = await puppeteer.launch();
    const page = await authenticatePage(browser, pageObj.headers);
    const { port } = new URL(browser.wsEndpoint());
    const options = {
        port,
        output: 'json',
        emulatedFormFactor: 'desktop',
        throttlingMethod: 'provided',
        onlyCategories: ['performance'],
    };

    try {
        await page.goto(pageObj.url, { waitUntil: 'networkidle0', timeout: 300000 });
        const runnerResult = await lighthouse(pageObj.url, options);
        const resultJSON = JSON.stringify(runnerResult.lhr, null, 2);
        const audits = runnerResult.lhr.audits;
        const metrics = await generate_matrics_rows(pageObj, audits);

        // Generate reports
        worksheet.addRow(metrics);
        fse.outputFile(`results/${pageObj.name.replace(" ", "-")}-${new Date().getTime()}.json`, resultJSON, err => {
            if (err) {
                console.log(err);
            } else {
                console.log('The file has been saved!');
            }
        });

    } catch (error) {
        console.error(`Error running Lighthouse for ${pageObj.name}:`, error);
    } finally {
        await browser.close();
    }
}

async function main() {
    for (const page of pages) {
        await lighthouseAudit(page);
    }
    await workbook.xlsx.writeFile(`lighthouse_summary-${new Date().getTime()}.xlsx`);
    console.log('Excel file with extended metrics, and differences to standard values has been written.');
}

main().catch(console.error);