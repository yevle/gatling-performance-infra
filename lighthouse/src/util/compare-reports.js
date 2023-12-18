import fs from 'fs'

const reportPath1 = '/lighthouse/report/1702886338878/summary-1702886338878.html'
const reportPath2 = '/lighthouse/report/1702886490831/summary-1702886490831.html'
compareReports(reportPath1, reportPath2)

function compareReports(report1, report2) {

  const html = `
<html>
<body>
  <iframe class="frame-l" src="${report1}"></iframe>
  <iframe class="frame-r" src="${report2}"></iframe>
</body>

<style>

  .frame-l {
    width: 785;
    height: 3000;
    border-top: 0;
    border-left: 0;
    border-right: 1;
    border-right-color: gray;
    padding-right: 0;
    margin-right: 0;

  }

  .frame-r {
    width: 785;
    height: 3000;
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
