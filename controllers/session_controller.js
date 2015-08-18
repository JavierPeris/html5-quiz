// MW de autorización de accesos HTTP restringidos
exports.loginRequired = function(req, res, next) {
    console.log(req.session);
    if(req.session.user) {
	console.log('user');
	next();
    } else {
	res.redirect('/login');
    }
};

// Get /login -- Formulario de login
exports.new = function(req, res) {
    var errors = req.session.erros || {};
    req.session.errors = {};

    res.render('sessions/new', {errors: errors});
};

// POST /login -- Crear la sesión
exports.create = function(req, res) {

    var login = req.body.login;
    var password = req.body.password;

    var userController = require('./user_controller');
    userController.autenticar(login, password, function(error, user) {

	if(error) {
	    req.session.errors = [{"message": 'Se ha producido un error: ' + error}];
	    res.redirect("/login");
	    return;
	}

	req.session.user = {id:user.id, username: user.username};

	res.redirect(req.session.redir.toString());
    });
};

//DELETE /logout --Destruir sesión
exports.destroy = function(req, res) {
    delete req.session.user;
    res.redirect(req.session.redir.toString());
};
