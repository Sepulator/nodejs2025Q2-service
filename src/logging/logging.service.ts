import { ConsoleLogger, Injectable, LogLevel } from '@nestjs/common';

@Injectable()
export class LoggingService extends ConsoleLogger {
  constructor() {
    super();
    this.setLogLevels(this.getLogLevelsFromEnv());
  }

  log(message: any, context?: string) {
    if (this.isLevelEnabled('log')) {
      super.log(message, context);
    }
  }

  error(message: any, trace?: string, context?: string) {
    if (this.isLevelEnabled('error')) {
      super.error(message, trace, context);
    }
  }

  warn(message: any, context?: string) {
    if (this.isLevelEnabled('warn')) {
      super.warn(message, context);
    }
  }

  debug(message: any, context?: string) {
    if (this.isLevelEnabled('debug')) {
      super.debug(message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (this.isLevelEnabled('verbose')) {
      super.verbose(message, context);
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
