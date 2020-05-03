import { Router } from 'express';
import multer from 'multer';
import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';

import CreateUsersService from '../services/CreateUsersService';
import ListUsersService from '../services/ListUsersService';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();

usersRouter.use(ensureAuthenticated);

const upload = multer(uploadConfig);

usersRouter.get('/', async (req, res) => {
  const listUsers = new ListUsersService();

  const users = await listUsers.excute();

  return res.json(users);
});

usersRouter.post('/', async (req, res) => {
  const { name, email, password } = req.body;

  const createUser = new CreateUsersService();

  const user = await createUser.execute({
    name,
    email,
    password,
  });

  return res.json(user);
});

usersRouter.patch('/avatar', upload.single('avatar'), async (req, res) => {
  const updateAvatar = new UpdateUserAvatarService();

  const user = await updateAvatar.execute({
    user_id: req.user.id,
    avatarFilename: req.file.filename,
  });

  delete user.password;
  return res.json(user);
});

export default usersRouter;
