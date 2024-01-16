import fs from 'fs'

export function compareReports() {
  let recentReportDirName
  let previousReportDirName

  fs.readdir(`${process.cwd()}/report`, (error, files) => {
    if (error) {
      console.log(error)
    } else {
      const dirNames = files
      recentReportDirName = dirNames.pop()
      previousReportDirName = dirNames.pop()

      const recentReport = `${process.env.WORK_SPACE}/report/${recentReportDirName}/summary-${recentReportDirName}.html`
      const previousReport = `${process.env.WORK_SPACE}/report/${previousReportDirName}/summary-${previousReportDirName}.html`

      const html = `
      <!DOCTYPE html>
      <html>

      <head>
        <style>
          .frame {
            width: 100%;
            height: 2000px;
          }
      
          .frame-l {
            float: left;
          }
      
          .frame-r {
            float: right;
          }
      
          table {
            width: 100%;
          }
      
          th {
            font-size: 200%;
            font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
            font-weight: 100;
          }
        </style>
      </head>
      
      <body>
        <table>
          <th>Previous report</th>
          <th>Recent report</th>
          <tr>
            <td>
              <iframe class="frame-l frame" src="${previousReport}"></iframe>
            </td>
            <td>
              <iframe class="frame-r frame" src="${recentReport}"></iframe>
            </td>
          </tr>
        </table>
      </body>
      
      </html>
`
      if (fs.existsSync('../lighthouse/report')) {
        if (!fs.existsSync('../lighthouse/report/0')) {
          fs.mkdirSync('../lighthouse/report/0')
        }
        fs.writeFileSync('../lighthouse/report/0/compare-report.html', html)
      }
      else { console.log('There are no reports to compare.') }
    }
  })
}
