export const multerOptions = {
  fileFilter: (req: any, file: any, callback: any) => {
    if (!file.originalname.match(/\.(pdf)$/)) {
      return callback(new Error('Only PDF files are allowed'), false);
    }
    callback(null, true);
  },
};
