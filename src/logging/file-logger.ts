import { mkdir, stat, access, appendFile, rename } from 'node:fs/promises';
import { constants } from 'node:fs';
import { join, dirname, extname, basename } from 'node:path';

const LOG_MAX_FILE_SIZE = 10;

export class FileLogger {
  private logFilePath: string;
  private errorLogFilePath: string;
  private maxFileSize: number;

  constructor(logDir: string = 'logs') {
    this.logFilePath = join(logDir, 'combined.log');
    this.errorLogFilePath = join(logDir, 'error.log');
    this.maxFileSize = (parseInt(process.env.LOG_MAX_FILE_SIZE, 10) || LOG_MAX_FILE_SIZE) * 1024;
    this.ensureLogDir(logDir);
  }

  private async ensureLogDir(logDir: string) {
    try {
      await access(logDir, constants.F_OK);
    } catch {
      await mkdir(logDir, { recursive: true });
    }
  }

  async log(message: string) {
    await this.writeToFile(this.logFilePath, message);
  }

  async error(message: string) {
    await this.writeToFile(this.logFilePath, message);
    await this.writeToFile(this.errorLogFilePath, message);
  }

  private async writeToFile(filePath: string, message: string) {
    const formattedMessage = `[${new Date().toISOString()}] ${message}`;

    await this.checkAndRotate(filePath);

    try {
      await appendFile(filePath, formattedMessage + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  private async checkAndRotate(filePath: string) {
    try {
      const stats = await stat(filePath);
      if (stats.size > this.maxFileSize) {
        await this.rotate(filePath);
      }
    } catch (err) {
      console.error('File does not exist, nothing to rotate', err);
    }
  }

  private async rotate(filePath: string) {
    const dir = dirname(filePath);
    const ext = extname(filePath);
    const base = basename(filePath, ext);
    const newPath = join(dir, `${base}-${Date.now()}${ext}`);

    try {
      await rename(filePath, newPath);
    } catch (err) {
      console.error('Failed to rotate log file:', err);
    }
  }
}
