$(function () {

    window.notices = $("#notices");

    window.Candidate = Backbone.Model.extend({
        urlRoot: "/candidates",
        defaults: {
            firstName: '',
            lastName: '',
            startDate: new Date(),
            email: ''
        }
    });

    window.Candidates = Backbone.Collection.extend({
        model: Candidate,
        url: "/candidates"
    });

    window.candidates = new Candidates();

    window.CandidateView = Backbone.View.extend({
        tagName: 'tr',
        className: 'candidate',

        events: {
            'click #edit': 'edit',
            'click #delete': 'delete',
            'click #save': 'save',
            'keypress input': 'saveOnEnter'
        },

        initialize: function () {
            _.bindAll(this,
                'render',
                'edit',
                'delete',
                'slideAndRemove',
                'reportError');

            this.mode = 'view';

            this.viewTemplate = _.template($('#view-candidate-template').html());
            this.editTemplate = _.template($('#edit-candidate-template').html());

            this.model.on('change', this.render, this);
        },

        render: function () {
            if (this.mode === 'view') {
                this.$el.html(this.viewTemplate(this.model.toJSON()));
            } else if (this.mode === 'edit') {
                this.$el.html(this.editTemplate(this.model.toJSON()));
                this.$el.find('#startDate').datepicker({
                    dateFormat: 'dd M yy',
                    showOptions: { direction: "down" }
                });
                this.$el.find('input').css('margin-bottom', '0px');
                this.$el.find('input').css('height', '30px');
            }
            return this;
        },

        edit: function () {
            this.mode = 'edit';
            this.render();
            notices.notify('create', {
                title: 'Edit',
                text: 'Editing candidate ' + this.model.attributes['firstName'] + ' ' + this.model.attributes['lastName']
            });
        },

        slideAndRemove: function () {
            this.$el.slideUp(250, function () {
                $(this).remove();
            });
            notices.notify('create', {
                title: 'Delete',
                text: 'Deleted candidate'
            });
        },

        delete: function () {
            this.model.destroy({
                //wait: true,
                dataType: "text",
                success: this.slideAndRemove,
                error: this.reportError
            });
        },

        saveOnEnter: function (e) {
            // Process only on return pressed
            if (e.keyCode == 13) {
                this.save();
            }
        },

        save: function () {
            this.model.save({
                    firstName: this.$el.find('#firstName').val(),
                    lastName: this.$el.find('#lastName').val(),
                    startDate: this.$el.find('#startDate').datepicker('getDate'),
                    email: this.$el.find('#email').val()
                },
                {
                    //wait: true,
                    success: this.saveSuccess,
                    error: this.reportError
                }
            );
            this.mode = 'view';
            this.render();
        },

        saveSuccess: function (model) {
            notices.notify('create', {
                title: 'Save',
                text: 'Saving candidate ' + model.attributes['firstName'] + ' ' + model.attributes['lastName']
            });
        },

        reportError: function (model, response, options) {
            notices.notify('create', {
                title: response.status + ': ' + response.statusText,
                text: "Error for candidate" + model.attributes['firstName'] + ' ' + model.attributes['lastName']
            });
        }

    })
    ;

    window.AppView = Backbone.View.extend({
        el: $('body'),

        events: {
            'click #addBtn': 'add',
            'click #notifyBtn': 'notify'
        },

        initialize: function () {
            _.bindAll(this,
                'render',
                'renderCandidate',
                'add',
                'notify');

            this.collection.on('add', this.renderCandidate, this);
            this.collection.on('reset', this.render, this);

            this.collection.fetch();
        },

        render: function () {
            this.collection.each(this.renderCandidate);
            return this;
        },

        renderCandidate: function (candidate) {
            var view = new CandidateView({
                model: candidate
            });
            this.$el.find('#candidates').append(view.render().el);
        },

        add: function () {
            var candidate = new Candidate();
            var view = new CandidateView({
                model: candidate
            });
            view.mode = 'edit';
            this.$el.find('#candidates').append(view.render().el);
            view.$el.find('input:first').focus();
        },

        notify: function () {
            notices.notify('create', {
                title: 'Sample notification',
                text: 'This is my first message'
            });
        }

    });

    window.AppRouter = Backbone.Router.extend({
        routes: {
            '': 'home'
        },

        initialize: function () {
            this.appView = new AppView({
                collection: window.candidates
            });
        },

        home: function () {
            this.appView.render();
        }
    });

    window.App = new AppRouter();
    Backbone.history.start({
        pushState: false
    });

    window.App.home();

// Init jQuery notify plugin
    notices.notify({
        speed: 250,
        expires: 3000
    });
})
;
