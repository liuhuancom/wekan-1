let previousPath;
FlowRouter.triggers.exit([({path}) => {
  previousPath = path;
}]);

FlowRouter.route('/', {
  name: 'home',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action() {
    Session.set('currentBoard', null);
    Session.set('currentList', null);
    Session.set('currentCard', null);

    Filter.reset();
    EscapeActions.executeAll();

    BlazeLayout.render('defaultLayout', {
      headerBar: 'boardListHeaderBar',
      content: 'boardList',
    });
  },
});


FlowRouter.route('/get_login/:username', {
  name: 'get_login',
  action: function (params, queryParams) {
    // alert('sss');
    //const aaaaa = "111111";
    //console.log('Yeah! We are on the post:', params.username);

    BlazeLayout.render('defaultLayout', {
      headerBar: 'boardHeaderBar',
      content: 'legulogin',
    });
    console.log('eeeeeeah! We are on the post:', params.username);

  },
});

FlowRouter.route('/api2/users', {
  name: 'get_login2',
  action: function (params, queryParams) {
    // alert('sss');
    console.log('aaaaaaaaaaaaaa:', params);

    let json = queryParams;
    let data = JSON.parse(json.leguorigjson);
    const id = Accounts.createUser({
      username: data.pinyin + String(data.mobile).substr(7),
      email: data.email||data.pinyin+'@legu.cc',
      password: data.password || '123456',
      from: 'admin',
    });
    console.log('xxxxxx',data,id);
    // Session.set('legu_user',json.leguorigjson.pinyin+json.leguorigjson.mobile);

    // Meteor.user().setAvatarUrl("http://localhost:3000/cfs/files/avatars/ozeLtBsHz4hi3F7oC/WX20180308-162356@2x.png");

    Users.update(id, {
      // $set: { 'profile.fullname': req.body.fullname },
      $set: {'profile': {'fullname': data.name, 'avatarUrl': data.avatar}},
    });

    let group = ['@all'];
    if (data.legugroup) {
      data.legugroup.forEach(function (data) {
        group.push('@' + data);
      });
    }
    Users.update(id, {$addToSet: {legugroup: {$each:group}}});
    // Users.update(id, {$addToSet: {legugroup: '@all'}});

    BlazeLayout.render('legulogin');
    console.log('bbbbbbbbbbb', queryParams);

  },
});

FlowRouter.route('/b/:id/:slug', {
  name: 'board',
  action(params) {
    const currentBoard = params.id;
    const previousBoard = Session.get('currentBoard');
    Session.set('currentBoard', currentBoard);
    Session.set('currentCard', null);

    // If we close a card, we'll execute again this route action but we don't
    // want to excape every current actions (filters, etc.)
    if (previousBoard !== currentBoard) {
      Filter.reset();
      EscapeActions.executeAll();
    } else {
      EscapeActions.executeUpTo('popup-close');
    }

    BlazeLayout.render('defaultLayout', {
      headerBar: 'boardHeaderBar',
      content: 'board',
    });
  },
});

FlowRouter.route('/b/:boardId/:slug/:cardId', {
  name: 'card',
  action(params) {
    EscapeActions.executeUpTo('inlinedForm');

    Session.set('currentBoard', params.boardId);
    Session.set('currentCard', params.cardId);

    BlazeLayout.render('defaultLayout', {
      headerBar: 'boardHeaderBar',
      content: 'board',
    });
  },
});

FlowRouter.route('/shortcuts', {
  name: 'shortcuts',
  action() {
    const shortcutsTemplate = 'keyboardShortcuts';

    EscapeActions.executeUpTo('popup-close');

    if (previousPath) {
      Modal.open(shortcutsTemplate, {
        header: 'shortcutsModalTitle',
        onCloseGoTo: previousPath,
      });
    } else {
      BlazeLayout.render('defaultLayout', {
        headerBar: 'shortcutsHeaderBar',
        content: shortcutsTemplate,
      });
    }
  },
});

FlowRouter.route('/import/:source', {
  name: 'import',
  triggersEnter: [AccountsTemplates.ensureSignedIn],
  action(params) {
    if (Session.get('currentBoard')) {
      Session.set('fromBoard', Session.get('currentBoard'));
    }
    Session.set('currentBoard', null);
    Session.set('currentList', null);
    Session.set('currentCard', null);
    Session.set('importSource', params.source);

    Filter.reset();
    EscapeActions.executeAll();
    BlazeLayout.render('defaultLayout', {
      headerBar: 'importHeaderBar',
      content: 'import',
    });
  },
});

FlowRouter.route('/setting', {
  name: 'setting',
  triggersEnter: [
    AccountsTemplates.ensureSignedIn,
    () => {
      Session.set('currentBoard', null);
      Session.set('currentList', null);
      Session.set('currentCard', null);

      Filter.reset();
      EscapeActions.executeAll();
    },
  ],
  action() {
    BlazeLayout.render('defaultLayout', {
      headerBar: 'settingHeaderBar',
      content: 'setting',
    });
  },
});

FlowRouter.route('/information', {
  name: 'information',
  triggersEnter: [
    AccountsTemplates.ensureSignedIn,
    () => {
      Session.set('currentBoard', null);
      Session.set('currentList', null);
      Session.set('currentCard', null);

      Filter.reset();
      EscapeActions.executeAll();
    },
  ],
  action() {
    BlazeLayout.render('defaultLayout', {
      headerBar: 'settingHeaderBar',
      content: 'information',
    });
  },
});

FlowRouter.route('/people', {
  name: 'people',
  triggersEnter: [
    AccountsTemplates.ensureSignedIn,
    () => {
      Session.set('currentBoard', null);
      Session.set('currentList', null);
      Session.set('currentCard', null);

      Filter.reset();
      EscapeActions.executeAll();
    },
  ],
  action() {
    BlazeLayout.render('defaultLayout', {
      headerBar: 'settingHeaderBar',
      content: 'people',
    });
  },
});

FlowRouter.notFound = {
  action() {
    BlazeLayout.render('defaultLayout', { content: 'notFound' });
  },
};

// We maintain a list of redirections to ensure that we don't break old URLs
// when we change our routing scheme.
const redirections = {
  '/boards': '/',
  '/boards/:id/:slug': '/b/:id/:slug',
  '/boards/:id/:slug/:cardId': '/b/:id/:slug/:cardId',
  '/import': '/import/trello',
};

_.each(redirections, (newPath, oldPath) => {
  FlowRouter.route(oldPath, {
    triggersEnter: [(context, redirect) => {
      redirect(FlowRouter.path(newPath, context.params));
    }],
  });
});

// As it is not possible to use template helpers in the page <head> we create a
// reactive function whose role is to set any page-specific tag in the <head>
// using the `kadira:dochead` package. Currently we only use it to display the
// board title if we are in a board page (see #364) but we may want to support
// some <meta> tags in the future.
const appTitle = 'Wekan';

// XXX The `Meteor.startup` should not be necessary -- we don't need to wait for
// the complete DOM to be ready to call `DocHead.setTitle`. But the problem is
// that the global variable `Boards` is undefined when this file loads so we
// wait a bit until hopefully all files are loaded. This will be fixed in a
// clean way once Meteor will support ES6 modules -- hopefully in Meteor 1.3.
Meteor.isClient && Meteor.startup(() => {
  Tracker.autorun(() => {
    const currentBoard = Boards.findOne(Session.get('currentBoard'));
    const titleStack = [appTitle];
    if (currentBoard) {
      titleStack.push(currentBoard.title);
    }
    DocHead.setTitle(titleStack.reverse().join(' - '));
  });
});
