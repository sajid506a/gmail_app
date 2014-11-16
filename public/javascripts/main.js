var App = {
	Message: Backbone.Model.extend({
		initialize: function () {
			_.bindAll(this);
			this.on("change", this.somethingChanged);
		},
		somethingChanged: function (model, data) {
			console.log("Changed property: ", data.changes);
		}
	}),
	MessageList: Backbone.Collection.extend({
		initialize: function (options) {
			this.model = options.model;
		},
		url: "/api/messages"
	}),
	MessageView: Backbone.View.extend({
		template: Handlebars.compile($("#messageTemplate").html()),
		initialize: function (options) {
			_.bindAll(this);
			_.bindAll(this.options);
			this.model = options.model;
			this.setElement(this.template(this));
			this.model.on("change:isSelected", this.toggleSelection);
		},
		events: {
			"click": "open",
			"change .checkbox": "change"
		},
		open: function (event){
			if(event.target.nodeName !== "INPUT") {
				alert("Open action performed on message with ID:" + this.model.cid);
			}
		},
		change: function(event){
			this.model.set("isSelected", event.target.checked);
		},
		toggleSelection: function (model, isSelected) {
			if(isSelected) {
				this.$el.addClass("active");
			} else {
				this.$el.removeClass("active");
			}
		},
		options: {
			from: function () { return this.model.get("from") },
			subject: function () { return this.model.get("subject") },
			body: function () { return this.model.get("body") },
		}
	}),
	MessageListView: Backbone.View.extend({
		initialize: function () {
			_.bindAll(this);
			this.collection.on("reset", this.collectionReset);
		},
		collectionReset: function () {
			var $temp = [];
			this.$el.empty();
			if(!this.collection.length) {
				this.$el.text("There are no conversations with this label.");
			}
			this.collection.each(function(model, index){
				var messageView = new App.MessageView({model: model});
				$temp.push(messageView.$el);
			}, this);
			this.$el.append($temp);
		}
	}),
	FolderNavigationView: Backbone.View.extend({
		events: {
			"click a": "navigate"
		},
		navigate: function (event) {
			var $target = $(event.target),
				folderName = $target.data("value");
			event.preventDefault();
			this.$el.find("a").removeClass("active");
			$target.addClass("active");
			Backbone.history.navigate(event.target.pathname, true);
		}
	}),
	SelectedMessagesView: Backbone.View.extend({
		initialize: function () {
			_.bindAll(this);
			this.collection.on("change:isSelected", this.updateSelectedCount);
			this.collection.on("reset", this.updateSelectedCount);
			this.$count = this.$el.find(".count");
		},
		updateSelectedCount: function () {
			var selectedModels = this.collection.where({isSelected: true}),
				selectedCount = selectedModels.length;

			this.$count.text(selectedCount);
			if (selectedCount) {
				this.$el.fadeIn(200);
			} else {
				this.$el.hide();
			}
			
		}
	}),
	Router: Backbone.Router.extend({
		initialize: function (options) {
			this.collection = options.collection;
			Backbone.history.start({pushState: true});
			_.bindAll(this);
			var path = Backbone.history.fragment;
			if(path) {
				Backbone.history.navigate(path, true);
			}
		},
		routes: {
	    	"folder/:folderName": "navigate",
	  	},
	  	navigate: function (folderName) {
	  		folderName = (folderName === undefined) ? "inbox" : folderName;
			this.collection.fetch({
				data: { folder: folderName}
			})
		}
	}),

	docReady: function () {
		var messageList = new App.MessageList({
				model: App.Message
			}),
			messageListView = new App.MessageListView({
				el: $("#messages"),
				collection: messageList
			}),
			selectedMessagesView = new App.SelectedMessagesView({
				el: $("#selection"),
				collection: messageList
			}),
			router = new App.Router({collection: messageList}),
			folderNavigationView = new App.FolderNavigationView({
				el: $("#folders"),
				collection: messageList
			});
	}
};

$(document).ready(App.docReady);