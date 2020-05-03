import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import Class from '../models/Class';
import uploadConfig from '../config/upload';
import AppError from '../errors/AppError';

interface Request {
  id: string;
  videoFilename: string;
}

class UpdateClassVideoService {
  public async execute({ id, videoFilename }: Request): Promise<Class> {
    const classRepository = getRepository(Class);

    const findClass = await classRepository.findOne(id);

    if (!findClass) {
      const videoPath = path.join(uploadConfig.directory, videoFilename);
      await fs.promises.unlink(videoPath);

      throw new AppError('Class not found for upload this video');
    }

    if (findClass.video) {
      const classVideoFilePath = path.join(
        uploadConfig.directory,
        findClass.video,
      );
      const classVideoFileExists = await fs.promises.stat(classVideoFilePath);

      if (classVideoFileExists) await fs.promises.unlink(classVideoFilePath);
    }

    findClass.video = videoFilename;

    await classRepository.save(findClass);

    return findClass;
  }
}

export default UpdateClassVideoService;
