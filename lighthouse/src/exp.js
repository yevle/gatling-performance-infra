import fs from 'fs'

const report1Html = fs.readFileSync('/Users/solvd/IdeaProjects/gatling-performance-infra/lighthouse/report/Fri Dec 01 2023 14:42:37 GMT+0300 (GMT+03:00)/https:..demostore.gatling.io..html'); 
const report2Html = fs.readFileSync('/Users/solvd/IdeaProjects/gatling-performance-infra/lighthouse/report/Fri Dec 01 2023 14:42:37 GMT+0300 (GMT+03:00)/https:..demostore.gatling.io..html');

const html = `
  <html>
  <html>
  <body>
    <iframe width="500" height="5000" src="/https:..demostore.gatling.io..html"></iframe>
    <iframe width="500" height="5000" src="/Users/solvd/IdeaProjects/gatling-performance-infra/lighthouse/report/Fri Dec 01 2023 14:42:37 GMT+0300 (GMT+03:00)/https:..demostore.gatling.io..html"></iframe>
  </body>
</html>
  </html>
`

fs.writeFileSync('report.html', html);
