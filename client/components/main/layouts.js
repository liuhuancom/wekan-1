BlazeLayout.setRoot('body');

const i18nTagToT9n = (i18nTag) => {
  // t9n/i18n tags are same now, see: https://github.com/softwarerero/meteor-accounts-t9n/pull/129
  // but we keep this conversion function here, to be aware that that they are different system.
  return i18nTag;
};

Template.userFormsLayout.onRendered(() => {
  const i18nTag = navigator.language;
  if (i18nTag) {
    T9n.setLanguage(i18nTagToT9n(i18nTag));
  }
  EscapeActions.executeAll();
});

Template.userFormsLayout.helpers({
  languages() {
    return _.map(TAPi18n.getLanguages(), (lang, code) => {
      return {
        tag: code,
        name: lang.name === 'br' ? 'Brezhoneg' : lang.name === 'ig' ? 'Igbo' : lang.name,
      };
    }).sort(function(a, b) {
      if (a.name === b.name) {
        return 0;
      } else {
        return a.name > b.name ? 1 : -1;
      }
    });
  },

  isCurrentLanguage() {
    const t9nTag = i18nTagToT9n(this.tag);
    const curLang = T9n.getLanguage() || 'en';
    return t9nTag === curLang;
  },
});


Template.userFormsLayout.events({
  'change .js-userform-set-language'(evt) {
    const i18nTag = $(evt.currentTarget).val();
    T9n.setLanguage(i18nTagToT9n(i18nTag));
    evt.preventDefault();
  },
});

Template.defaultLayout.events({
  'click .js-close-modal': () => {
    Modal.close();
  },
});


function GetUrlParam(paraName) {
  var url = document.location.toString();
  var arrObj = url.split('?');

  if (arrObj.length > 1) {
    var arrPara = arrObj[1].split('&');
    var arr;

    for (var i = 0; i < arrPara.length; i++) {
      arr = arrPara[i].split('=');

      if (arr != null && arr[0] == paraName) {
        return arr[1];
      }
    }
    return '';
  }
  else {
    return '';
  }
}

function autoLogin(){
  if(location.href.indexOf('api2/users')==-1)return;
  alert('start login....'+GetUrlParam("name"));
  Meteor.loginWithPassword(GetUrlParam("name"),'123456',function(){
    FlowRouter.go('/');
  });
}


//console.log('sss');
//   var test = window.location.href;
//console.log(GetUrlParam("name"));
//Meteor.loginWithPassword(GetUrlParam("name"),'liuhuan',function(){FlowRouter.go('/');});
