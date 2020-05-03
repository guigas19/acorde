import { Router } from 'express';
import { getRepository } from 'typeorm';
import multer from 'multer';
import uploadConfig from '../config/upload';

import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import UpdateClassVideoService from '../services/UpdateClassVideoService';
import Class from '../models/Class';

const classesRouter = Router();

classesRouter.use(ensureAuthenticated);

const upload = multer(uploadConfig);

classesRouter.get('/', async (req, res) => {
  const classRepository = getRepository(Class);
  const classes = await classRepository.find();
  return res.json(classes);
});

classesRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  const classRepository = getRepository(Class);
  const findClass = await classRepository.findOne(id);
  return res.json(findClass);
});

classesRouter.post('/', async (req, res) => {
  const { title, description } = req.body;
  const classRepository = getRepository(Class);
  const newClass = classRepository.create({ title, description });
  await classRepository.save(newClass);

  return res.json(newClass);
});

classesRouter.patch('/video/:id', upload.single('video'), async (req, res) => {
  const { id } = req.params;

  const updateClassVideo = new UpdateClassVideoService();

  const newClass = await updateClassVideo.execute({
    id,
    videoFilename: req.file.filename,
  });

  return res.json(newClass);
});

export default classesRouter;
