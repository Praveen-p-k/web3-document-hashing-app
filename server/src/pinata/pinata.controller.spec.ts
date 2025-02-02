import { Test, TestingModule } from '@nestjs/testing';
import { PinataController } from './pinata.controller';
import { PinataService } from './pinata.service';
import { UserService } from '../user/user.service';
import { NotFoundException } from '@nestjs/common';

describe('PinataController', () => {
  let controller: PinataController;
  let pinataService: PinataService;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PinataController],
      providers: [PinataService, UserService],
    }).compile();

    controller = module.get<PinataController>(PinataController);
    pinataService = module.get<PinataService>(PinataService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined(); 
  });

  describe('uploadFile', () => {
    it('should upload a file', async () => {
      const file = {} as Express.Multer.File;
      const address = 'exampleAddress';
      const hash = 'exampleHash';

      jest.spyOn(pinataService, 'uploadFile').mockResolvedValueOnce({ hash });

      const result = await controller.uploadFile(file, { address });

      expect(result).toEqual({ hash });
    });

    it('should throw NotFoundException if file is not found', async () => {
      const file = undefined;
      const address = 'exampleAddress';

      await expect(controller.uploadFile(file, { address })).rejects.toThrowError(NotFoundException);
    });
  });

  describe('getFileByCid', () => {
    it('should return link if file found on IPFS', async () => {
      const cid = 'exampleCID';
      const expectedLink = `https://ipfs.io/ipfs/${cid}`;

      jest.spyOn(pinataService, 'getFileByCid').mockResolvedValueOnce({ link: expectedLink });

      const result = await controller.getFileByCid(cid);

      expect(result).toEqual({ link: expectedLink });
    });

    it('should handle error if file not found on IPFS', async () => {
      const cid = 'nonExistingCID';

      jest.spyOn(pinataService, 'getFileByCid').mockRejectedValueOnce(new Error('File not found'));

      await expect(controller.getFileByCid(cid)).resolves.toBeUndefined();
    });
  });

  describe('getFilesFromPinata', () => {
    it('should return pinned files from Pinata', async () => {
      const pinnedFiles = [{ name: 'file1' }, { name: 'file2' }];

      jest.spyOn(pinataService, 'getFilesFromPinata').mockResolvedValueOnce(pinnedFiles);

      const result = await controller.getFilesFromPinata();

      expect(result).toEqual(pinnedFiles);
    });

    it('should handle error if unable to fetch pinned files from Pinata', async () => {
      jest.spyOn(pinataService, 'getFilesFromPinata').mockRejectedValueOnce(new Error('Error fetching files'));

      await expect(controller.getFilesFromPinata()).resolves.toBeUndefined();
    });
  });

  describe('updateFile', () => {
    it('should update file signature and return new CID', async () => {
      const body = { signature: 'newSignature', address: 'exampleAddress' };
      const cid = 'updatedCID';
      const expectedStatus = 'signature updated successfully';

      jest.spyOn(pinataService, 'uploadEditedPDFToPinata').mockResolvedValueOnce(cid);
      jest.spyOn(userService, 'updateUserSignature').mockResolvedValueOnce({});
      jest.spyOn(userService, 'filterUserByCid').mockResolvedValueOnce({ cid });

      const result = await controller.updateFile(body);

      expect(result).toEqual({ cid, status: expectedStatus });
    });
  });

  describe('deleteFile', () => {
    it('should delete file from Pinata', async () => {
      const cid = 'exampleCID';
      const expectedResponse = 'File deleted successfully';

      jest.spyOn(pinataService, 'deleteFileFromPinata').mockResolvedValueOnce(expectedResponse);

      const result = await controller.deleteFile(cid);

      expect(result).toEqual(expectedResponse);
    });

    it('should handle error if unable to delete file from Pinata', async () => {
      const cid = 'exampleCID';

      jest.spyOn(pinataService, 'deleteFileFromPinata').mockRejectedValueOnce(new NotFoundException('File not found'));

      await expect(controller.deleteFile(cid)).rejects.toThrowError(NotFoundException);
    });
  });
});
