import fs from 'fs'

const reportPath = '/lighthouse/report/1701677271231/summary.html'
compareReports(reportPath, reportPath)

function compareReports(report1, report2) {

  const html = `
<html>

<body class="body">
  <iframe class="frame-l" src="${report1}"></iframe>
  <iframe class="frame-r" src="${report2}"></iframe>
</body>

<style>
  .body {
    padding-top: 30;
  }

  .frame-l {
    width: 785;
    height: 5000;
    border-top: 0;
    border-left: 0;
    border-right: 1;
    border-right-color: gray;
    padding-right: 0;
    margin-right: 0;

  }

  .frame-r {
    width: 785;
    height: 5000;
    border-top: 0;
    border-left: 0;
    border-left-color: white;
    border-right: 0;
    padding-left: 0;
    margin-left: 0;
  }
</style>

</html>
`

  if (fs.existsSync('../lighthouse/report')) {
    fs.writeFileSync('../lighthouse/report/compare-report.html', html)
  }
  else { console.log('There are no reports to compare.') }
}
