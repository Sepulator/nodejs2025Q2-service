import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';
import { FileLogger } from './file-logger';

@Injectable()
export class LoggingService extends ConsoleLogger {
  private fileLogger = new FileLogger();

  constructor() {
    super();
    this.setLogLevels(this.getLogLevelsFromEnv());
  }

  async log(message: any, context?: string) {
    if (this.isLevelEnabled('log')) {
      super.log(message, context);
      await this.fileLogger.log(`[LOG] [${context || ''}] ${message}`);
    }
  }

  async error(message: any, trace?: string, context?: string) {
    if (this.isLevelEnabled('error')) {
      super.error(message, trace, context);
      await this.fileLogger.error(`[ERROR] [${context || ''}] ${message}${trace || ''}`);
    }
  }

  async warn(message: any, context?: string) {
    if (this.isLevelEnabled('warn')) {
      super.warn(message, context);
      await this.fileLogger.log(`[WARN] [${context || ''}] ${message}`);
    }
  }

  async debug(message: any, context?: string) {
    if (this.isLevelEnabled('debug')) {
      super.debug(message, context);
      await this.fileLogger.log(`[DEBUG] [${context || ''}] ${message}`);
    }
  }

  async verbose(message: any, context?: string) {
    if (this.isLevelEnabled('verbose')) {
      super.verbose(message, context);
      await this.fileLogger.log(`[VERBOSE] [${context || ''}] ${message}`);
    }
  }

  private getLogLevelsFromEnv(): LogLevel[] {
    const level = process.env.LOG_LEVEL;
    const levels: LogLevel[] = ['log', 'warn', 'error'];
    const levelMap: { [key: string]: LogLevel[] } = {
      '0': [],
      '1': ['error'],
      '2': ['error', 'warn'],
      '3': ['error', 'warn', 'log'],
      '4': ['error', 'warn', 'log', 'debug'],
      '5': ['error', 'warn', 'log', 'debug', 'verbose'],
    };

    return levelMap[level] || levels;
  }
}
