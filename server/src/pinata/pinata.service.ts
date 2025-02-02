import { Injectable, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import * as FormData from 'form-data';
import { PDFDocument, rgb } from 'pdf-lib';
import { Stream } from 'stream';
import { createHash } from 'crypto';
import 'multer';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PinataService {
  private readonly API_Key: string;
  private readonly API_Secret: string;
  private readonly JWT: string;

  constructor(private readonly userService: UserService) {
    this.API_Key = process.env.API_Key;
    this.API_Secret = process.env.API_Secret;
    this.JWT = process.env.JWT_KEY;
  }

  async uploadFile(
    address: string,
    file: Express.Multer.File,
  ): Promise<{ hash: string }> {
    const modifiedPdfBuffer = await this.addPageAndText(address, file.buffer);

    const formData = new FormData();
    const stream = Stream.Readable.from(modifiedPdfBuffer);

    const hash = createHash('sha256').update(modifiedPdfBuffer).digest('hex');

    formData.append('file', stream, { filename: file.originalname });

    const pinataMetadata = JSON.stringify({
      name: file.originalname,
    });
    formData.append('pinataMetadata', pinataMetadata);

    try {
      const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            pinata_api_key: this.API_Key,
            pinata_secret_api_key: this.API_Secret,
            Authorization: `Bearer ${this.JWT}`,
          },
        },
      );

      const cid = await res.data.IpfsHash;

      await this.userService.create({
        address,
        cid,
        file_hash: hash,
        url: `https://ipfs.io/ipfs/${cid}`,
      });

      return {
        hash,
      };
    } catch (error) {
      throw new Error(error.response.data);
    }
  }

  async getFilesFromPinata(): Promise<any> {
    try {
      const response = await axios.get(
        'https://api.pinata.cloud/data/pinList',
        {
          headers: {
            pinata_api_key: this.API_Key,
            pinata_secret_api_key: this.API_Secret,
            Authorization: `Bearer ${this.JWT}`,
          },
        },
      );
      const pinnedFiles = response.data.rows;
      return pinnedFiles;
    } catch (error) {
      console.error('Error fetching pinned files:', error);
    }
  }

  async deleteFileFromPinata(ipfsHash: string): Promise<string> {
    try {
      const response = await axios.delete(
        `https://api.pinata.cloud/pinning/unpin/${ipfsHash}`,
        {
          headers: {
            pinata_api_key: this.API_Key,
            pinata_secret_api_key: this.API_Secret,
            Authorization: `Bearer ${this.JWT}`,
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new NotFoundException('Error deleting file from Pinata:', error);
    }
  }

  async addPageAndText(address: string, pdfBuffer: Buffer): Promise<Buffer> {
    try {
      const pdfDoc = await PDFDocument.load(pdfBuffer);

      const page = pdfDoc.addPage();
      const { height } = page.getSize();

      const fontSize = 24;
      page.drawText(address, {
        x: 50,
        y: height - 50 - fontSize,
        size: fontSize,
        color: rgb(0, 0, 0),
      });

      const modifiedPdfBytes = await pdfDoc.save();
      const modifiedPdfBuffer = Buffer.from(modifiedPdfBytes);
      return modifiedPdfBuffer;
    } catch (error) {
      console.error('Error adding page and text to PDF:', error);
      throw error;
    }
  }

  async uploadEditedPDFToPinata(modifiedPdfBuffer: Buffer): Promise<string> {
    try {
      const formData = new FormData();
      formData.append('file', modifiedPdfBuffer, 'edited-file.pdf');

      const response = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        formData,
        {
          headers: {
            ...formData.getHeaders(),
            pinata_api_key: this.API_Key,
            pinata_secret_api_key: this.API_Secret,
            Authorization: `Bearer ${this.JWT}`,
          },
        },
      );
      const ipfsHash = response.data.IpfsHash;

      return ipfsHash;
    } catch (error) {
      throw new Error(error.response.data);
    }
  }
}
