import express from 'express';
import homeControllers from '../controllers/homeController';
import gameControllers from '../controllers/gameController';
import userControllers from '../controllers/userController';
import meControllers from '../controllers/meController';

let router = express.Router();

let initWebRoutes = (app) => {
	router.get('/', homeControllers.getHomepage); // trang chủ
	router.get('/search', homeControllers.search);

	// --------------User space---------------
	// Login
	router.get('/login', userControllers.loginForm); // render trang loggin
	router.post('/user/loading-user', userControllers.loginSuccess); // post user lên server để kiểm tra
	router.get('/logged', userControllers.logged); // render trang home của admin

	// Register
	router.get('/user/register', userControllers.registerForm); // render trang register
	router.post('/user/register-new-user', userControllers.postNewUser); // post new user

	// Forget password
	router.get('/user/forget-password', userControllers.forgetPassword);
	router.post('/user/change-password', userControllers.changePassword);

	// Logout
	router.get('/logout', userControllers.logout);

	// Read
	router.get('/game', userControllers.gameManager); // trang quản lý bài đăng
	router.get('/game/trash', userControllers.gameManager_trash); // trang quản lý bài đăng đã xóa

	// -------------Game Route Space----------------
	// Create
	router.get('/game/create', gameControllers.createGame); // tạo bài viết mới
	router.post('/post-new-game', gameControllers.postNewGame); // đẩy viết mới mới lên server

	// Edit
	router.get('/game/edit/:id', gameControllers.editGame); // render trang chỉnh sửa bài viết
	router.put('/put-edited-game/:id', gameControllers.putUpdatedGame); // post viết mới sau khi chỉnh sửa

	// Delete
	router.delete('/game/:id', gameControllers.moveToTrash); // chuyển tới thùng rác
	router.delete('/game/:id/force-delete', gameControllers.forceDelete); // xoá vĩnh viễn

	// Restore
	router.patch('/game/:id/restore', gameControllers.restoreGame); // khôi phục từ thùng rác

	// Handle events
	router.post('/game/handle-form-action', gameControllers.handleFormAction);

	// Slug
	router.get('/:slug', gameControllers.showGame); // show viết mới khi click vào 1 viết mới trong trang chủ
	router.post('/post-comment/:slug', gameControllers.postComment); // post comment

	// Me
	router.get('/me/favourite', meControllers.getFavourite); //get favourite post
	router.post('/add-to-favourite/:slug', meControllers.postFavourite); // post favourite
	router.delete('/remove-from-favourite/:slug', meControllers.removeFavourite); // delete favourite
	router.get('/user/change-password', meControllers.changePassword); // post favourite

	return app.use('/', router);
};

module.exports = initWebRoutes;
