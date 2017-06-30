var Movie = Backbone.Model.extend({

  defaults: {
    like: true
  },

  toggleLike: function() {
    this.set("like", !this.get("like"));
  }

});

var Movies = Backbone.Collection.extend({

  model: Movie,

  initialize: function() {
    // registers change on collection
    // sort sorts by current comparator by default if parameter not designated
    this.on('change', this.sort);
  },

  comparator: 'title',

  sortByField: function(field) {
    this.sort(field);
    this.comparator = field;
  }

  // events: {
  //   'change' : 'handleResort'
  // },

  // handleResort : function(){
  //   this.sortByField(this.comparator);
  //   console.log("something changed")
  // }

});

var AppView = Backbone.View.extend({

  events: {
    'click form input': 'handleClick'
  },

  handleClick: function(e) {
    var field = $(e.target).val();
    this.collection.sortByField(field);
    console.log(field);

  },

  render: function() {
    new MoviesView({
      el: this.$('#movies'),
      collection: this.collection
    }).render();
  }

});

var MovieView = Backbone.View.extend({

  template: _.template('<div class="movie"> \
                          <div class="like"> \
                            <button><img src="images/<%- like ? \'up\' : \'down\' %>.jpg"></button> \
                          </div> \
                          <span class="title"><%- title %></span> \
                          <span class="year">(<%- year %>)</span> \
                          <div class="rating">Fan rating: <%- rating %> of 10</div> \
                        </div>'),

  initialize: function() {
    // listen for change on model associated with this view
    // invoke render and pass 'this' to preserve binding
    this.model.on('change', this.render, this);
  },

  events: {
    'click button': 'handleClick',
  },

  //collection : Movies,

  handleClick: function() {
    this.model.toggleLike();
  },

/*  handleResort : function (){
    this.model.collection.sortByField(this.model.collection.comparator);
    console.log(this.model.collection);
  },*/

  render: function() {
    this.$el.html(this.template(this.model.attributes));
    return this.$el;
  }

});

var MoviesView = Backbone.View.extend({

  initialize: function() {
    // this.collection.on('change', function() {
    //   this.collection.sortByField(this.collection.comparator);
    // }, this);
    this.collection.on('sort', this.render, this);
  },

  render: function() {
    this.$el.empty();
    this.collection.forEach(this.renderMovie, this);
  },

  renderMovie: function(movie) {
    var movieView = new MovieView({model: movie});
    this.$el.append(movieView.render());
  }



});
