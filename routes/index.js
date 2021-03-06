/**
 * Homepage
 */


var config = require('../lib/config')
  , Job = require('../lib/job')
  , moment = require('moment')
  , db = require('../lib/db')
  ;

module.exports = function (req, res, next) {
  var values = req.renderValues || {}
    , partials = { content: '{{>pages/index}}' }
    , dashboardData = []
    ;

  db.jobs.find({}, function (err, jobs) {
    jobs.forEach(function (job) {
      if (job.nextBuildNumber && job.nextBuildNumber > 1) {
        job.latestBuild = job.previousBuilds[job.nextBuildNumber - 1];
        job.latestBuild.timeago = moment(job.latestBuild.date).fromNow();
      }
      dashboardData.push(job);
    });

    values.dashboardData = dashboardData;
    values.noJobYet = dashboardData.length === 0;

    return res.render('layout', { values: values
                                , partials: partials
                                });
  });
};
