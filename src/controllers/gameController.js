import Game from '../models/Game';

//----------------------
//render trang quản lý game
let gameManager = (req, res, next) => {
	Promise.all([Game.find({}), Game.countDocumentsDeleted()]).then(
		([data, deletedcount]) => {
			res.render('pages/admin/postedManager.ejs', { data, deletedcount });
		}
	);
};
let gameManager_trash = (req, res, next) => {
	Game.findDeleted({})
		.then((data) => res.render('pages/admin/deletedManager.ejs', { data }))
		.catch(next);
};
//----------------------

//----------------------
//show ra nội dung khi click vào
let showGame = (req, res, next) => {
	Game.findOne({ slug: req.params.slug })
		.then((data) => {
			res.render('pages/game/showGame.ejs', { data });
		})
		.catch(next);
}; //----------------------

//----------------------
//render trang tạo Game
let createGame = (req, res) => {
	return res.render('pages/game/createGames.ejs');
};
//đẩy dữ liệu đc nhập lên server
let postNewGame = (req, res, next) => {
	const game = new Game(req.body);
	game.screenshots = req.body.screenshots
		.split('\n')
		.map((screenshot) => screenshot.trim());
	game.save()
		.then(() => res.redirect('/game/manager'))
		.catch(next);
	// res.send(game);
}; //----------------------

//----------------------
//render trang chỉnh sửa game
let editGame = (req, res, next) => {
	Game.findOne({ _id: req.query.id })
		.then((data) => {
			res.render('pages/game/editGame.ejs', { data });
		})
		.catch(next);
};
let putUpdatedGame = async (req, res, next) => {
	const screenshots = req.body.screenshots
		.split('\n')
		.map((screenshot) => screenshot.trim());
	req.body.screenshots = screenshots;
	await Game.updateOne({ _id: req.body._id }, req.body);
	res.redirect('/game/manager');
};

let deleteGame = (req, res, next) => {
	Game.delete({ _id: req.query.id })
		.then(() => res.redirect('/game/manager'))
		.catch(next);
};
let forceDelete = (req, res, next) => {
	Game.deleteOne({ _id: req.query.id })
		.then(() => res.redirect('back'))
		.catch(next);
};

let restoreGame = (req, res, next) => {
	Game.restore({ _id: req.query.id })
		.then(() => res.redirect('back'))
		.catch(next);
};

let handleFormAction = (req, res, next) => {
	switch (req.query.action) {
		case 'delete':
			Game.delete({ _id: { $in: req.query.gameIds } })
				.then(() => res.redirect('/game/manager'))
				.catch(next);
			break;
		case 'restore':
			Game.restore({ _id: { $in: req.query.gameIds } })
				.then(() => res.redirect('back'))
				.catch(next);
			break;
		case 'force-delete':
			Game.deleteOne({ _id: { $in: req.query.gameIds } })
				.then(() => res.redirect('back'))
				.catch(next);
			break;

		default:
			res.json({ message: 'Unknown action' });
			break;
	}
};

module.exports = {
	createGame,
	postNewGame,
	gameManager,
	gameManager_trash,
	showGame,
	editGame,
	putUpdatedGame,
	deleteGame,
	forceDelete,
	restoreGame,
	handleFormAction,
};
