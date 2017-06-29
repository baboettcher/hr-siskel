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
   /* this.comparator.on('click:', function(){

    });*/
  },

  comparator: 'title',

  sortByField: function(field) {
    this.sort(field);
    this.comparator = field;

    console.log(this.comparator);
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
    // your code here
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
    this.collection.on('change', function() {
      this.collection.sortByField(this.collection.comparator);
    }, this);
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
