// buffer each user's email text in a queue, then flush them in single email
Meteor.startup(() => {
  Notifications.subscribe('email', (user, title, description, params) => {
    // add quote to make titles easier to read in email text
    const quoteParams = _.clone(params);
    ['card', 'list', 'oldList', 'board', 'comment'].forEach((key) => {
      if (quoteParams[key]) quoteParams[key] = `"${params[key]}"`;
    });

    //const text = `${params.user} ${TAPi18n.__(description, quoteParams, user.getLanguage())}\n${params.url}`;
	const text = `${params.user} ${TAPi18n.__(description, quoteParams, user.getLanguage())}`;
	const _url = `${params.url}`;

    console.log('mail==',text);
    //user.addEmailBuffer(text);
	user.clearEmailBuffer();

	const _userId = user._id;
	const _user = Users.findOne(_userId);

	return;
	HTTP.post("http://10.0.0.5/senddmsg/index.php", {
		content:JSON.stringify({
			agentid:'164310138',
			content:text,
			name:_user.profile.fullname,
			url:_url
		})
	}, function(err, res){});
	
	return;
    // unlike setTimeout(func, delay, args),
    // Meteor.setTimeout(func, delay) does not accept args :-(
    // so we pass userId with closure
    const userId = user._id;
    Meteor.setTimeout(() => {
      const user = Users.findOne(userId);

      // for each user, in the timed period, only the first call will get the cached content,
      // other calls will get nothing
      const texts = user.getEmailBuffer();
      if (texts.length === 0) return;

      // merge the cached content into single email and flush
      const text = texts.join('\n\n');
      user.clearEmailBuffer();

      try {
        Email.send({
          to: user.emails[0].address.toLowerCase(),
          from: Accounts.emailTemplates.from,
          subject: TAPi18n.__('act-activity-notify', {}, user.getLanguage()),
          text,
        });
      } catch (e) {
        return;
      }
    }, 30000);
  });
});
