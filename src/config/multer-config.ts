import { HttpException, HttpStatus } from '@nestjs/common';
import { MulterModuleOptions } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const multerConfig: MulterModuleOptions = {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, callback) => {
      const uniqueSuffix = uuidv4();
      const fileExtension = file.originalname.split('.')[1];
      const filename = `${file.originalname.split('.')[0]}_${uniqueSuffix}.${fileExtension}`;
      callback(null, filename);
    },
  }),
  fileFilter(req, file, callback) {
    console.log(file);
    // const ext = path.extname(file?.originalname);
    const ext = file.originalname.split('.').pop();

    if (
      !(
        ext == 'png' ||
        ext == 'pdf' ||
        ext == 'jpg' ||
        ext == 'jpeg' ||
        ext == 'csv'
      )
    ) {
      return callback(
        new HttpException('Only csv are allowed', HttpStatus.BAD_REQUEST),
        false,
      );
    }
    if (file.size > 1000000) {
      return callback(
        new HttpException(
          'File size must be less than 10MB',
          HttpStatus.BAD_REQUEST,
        ),
        false,
      );
    }

    callback(null, true);
  },
};
