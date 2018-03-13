// Template.cards.events({
//   'click .member': Popup.open('cardMember')
// });

Template.minicard.helpers({
  canModifyCard() {
    return Meteor.user() && Meteor.user().isBoardMember() && !Meteor.user().isCommentOnly();
  },
  isComplete(title) {
    if(title.startsWith('~',0) || title.endsWith('~',0)){

      // $(event.currentTarget).addClass('is-checked');
      return true;

    }else{
      return false;
      // $(event.currentTarget).removeClass('is-checked');
    }

  }
});

BlazeComponent.extendComponent({
  template() {
    return 'minicard';
  },

  toggleItem(event) {
    event.preventDefault();
    console.log(this.currentData().checklist);
    const checklist = this.currentData().checklist;
    const item = this.currentData().item;
    if (checklist && item && item._id) {
      checklist.toggleItem(item._id);
    }
  },

  legutoggleItem(event) {
    event.preventDefault();
    // toggleClass('is-checked');
    // console.log(this.currentData());
    console.log(this.currentData().title);
    let title = this.currentData().title;

    console.log(title);

    if(this.currentData().title.startsWith('~',0) || this.currentData().title.endsWith('~',0)){
      Cards.update(
        { _id: this.currentData()._id },
        {
          $set:{title:this.currentData().title.replace(/~/g,'')}
        },
      );
      $(event.currentTarget).addClass('is-checked');

    }else{
      Cards.update(
        { _id: this.currentData()._id },
        {
          $set:{title:'~~'+ this.currentData().title + '~~'}
        },
      );
      $(event.currentTarget).removeClass('is-checked');
    }
    // this.currentData().complete;


    console.log(event.target);
    console.log(this);
    console.log(event);
    $(event.currentTarget).toggleClass('is-checked');
  },



  events() {
    return [{
      'click .legu-minicards .check-box': this.legutoggleItem,
    }];
  },

}).register('minicard');
