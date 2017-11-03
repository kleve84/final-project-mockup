import { Template } from 'meteor/templating';

Template.Favorites_Form_Field.onRendered(function onRendered() {
  this.$('.dropdown').dropdown();
});

