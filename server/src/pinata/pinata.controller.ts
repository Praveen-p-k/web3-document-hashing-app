import 'multer';
import {
  Controller,
  Get,
  Post,
  Param,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Delete,
  Body,
} from '@nestjs/common';
import { PinataService } from './pinata.service';
import axios from 'axios';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/multer.config';
import { UploadFileDto } from './dto/upload-file.dto';
import { UserService } from 'src/user/user.service';

@Controller('pinata')
export class PinataController {
  constructor(
    private readonly pinataService: PinataService,
    private readonly userService: UserService,
  ) {}

  @Post('upload/:address')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Param() uploadFileDto: UploadFileDto,
  ): Promise<{ hash: string }> {
    const { address } = uploadFileDto;
    if (!file) throw new NotFoundException('File not found');
    const { hash } = await this.pinataService.uploadFile(address, file);

    return {
      hash,
    };
  }

  @Get('get-files/:cid')
  async getFileByCid(@Param('cid') cid: string): Promise<{ link: string }> {
    try {
      await axios.get(`https://gateway.pinata.cloud/ipfs/${cid}`);

      return {
        link: `https://ipfs.io/ipfs/${cid}`,
      };
    } catch (error) {
      console.error('Error fetching file from IPFS:', error.response.data);
    }
  }

  @Get('get-files')
  async getFilesFromPinata(): Promise<{ cid: string; link: string }> {
    return await this.pinataService.getFilesFromPinata();
  }

  @Post('update-sign')
  async updateFile(
    @Body() body: any,
  ): Promise<{ cid: string; status: string }> {
    const { signature, address } = body;

    // const response = await axios.get(
    //   `https://gateway.pinata.cloud/ipfs/${cid}`,
    //   {
    //     responseType: 'arraybuffer',
    //   },
    // );

    // const modifiedPdfBuffer = await this.pinataService.addPageAndText(
    //   signature,
    //   response.data,
    // );

    // const newCid =
    //   await this.pinataService.uploadEditedPDFToPinata(modifiedPdfBuffer);

    // await this.pinataService.deleteFileFromPinata(cid);

    await this.userService.updateUserSignature(address, { signature });
    const cid = (await this.userService.filterUserByCid(address)).cid;

    return {
      cid,
      status: 'signature updated successfully',
    };
  }

  @Delete('delete/:cid')
  async deleteFile(@Param('cid') cid: string): Promise<any> {
    return await this.pinataService.deleteFileFromPinata(cid);
  }
}
