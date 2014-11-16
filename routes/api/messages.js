var folder = {
	inbox: [
		{
			from: "test1",
			subject: "Test subject 1",
			body: "Body text not very long 1"
		},
		{
			from: "test2",
			subject: "Test subject 2",
			body: "Body text not very long 2"
		},
		{
			from: "test3",
			subject: "Test subject 3",
			body: "Body text not very long 3"
		},
		{
			from: "test4",
			subject: "Test subject 4",
			body: "Body text not very long 4"		
		},
		{
			from: "test5",
			subject: "Test subject 5",
			body: "Body text not very long 5"
		},
		{
			from: "test6",
			subject: "Test subject 6",
			body: "Body text not very long 6"
		},
	],
	sent: [
		{
			from: "Sent 1",
			subject: "My message subject 1",
			body: "Body text not very long 1"
		},
		{
			from: "Sent 2",
			subject: "Another message context 2",
			body: "Body text not very long 2"
		}
	],
	trash: []
}

exports.list = function(req, res){
	var folderName = req.query.folder,
		response = folder[folderName];

  	res.send(response);
};