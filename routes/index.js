
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', {
  	title: 'Gmail example',
  	options: {
  		from: "{{options.from}}",
  		body: "{{options.body}}",
  		subject: "{{options.subject}}"
  	}
  });
};